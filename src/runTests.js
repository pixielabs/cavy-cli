// Command to run iOS or Android tests
// `cavy run-ios` or `cavy run-android`
//
const server = require('../server');
const { existsSync } = require('fs');
const { spawn, execFileSync, execSync } = require('child_process');

let switched = false;

// Swap the user's test file into index.js to build the test app, and save a
// temporary version of the entry file so we can put it back later.
function switchEntryFile(entryFile, testEntryFile) {
  console.log(`cavy: Found an ${testEntryFile} entry point. Temporarily replacing ${entryFile} to run tests.`);

  const cmd = `mv ${entryFile} index.notest.js && mv ${testEntryFile} ${entryFile}`;
  console.log(`cavy: Running \`${cmd}\`...`);
  execSync(cmd);

  // Save that we did this, so we can undo it later.
  switched = true;
}

// If file changes have been made, revert them.
function teardown(entryFile, testEntryFile) {
  console.log(`cavy: Putting your ${entryFile} back.`);
  const cmd = `mv ${entryFile} ${testEntryFile} && mv index.notest.js ${entryFile}`;
  console.log(`cavy: Running \`${cmd}\`...`);
  execSync(cmd);
}

function runAdbReverse(port) {
  try {
    // Run ADB reverse tcp:<port> tcp:<port> to allow reporting of test results
    // from React Native. Borrowed from react-native-cli.
    const adbPath = getAdbPath();
    const adbArgs = ['reverse', `tcp:${port}`, `tcp:${port}`];
    console.log(`cavy: Running ${adbPath} ${adbArgs.join(' ')}`);
    execFileSync(adbPath, adbArgs, {stdio: 'inherit'});
  } catch(e) {
    console.error(`Could not run adb reverse: ${e.message}.`);
    process.exit(1);
  }
}

// Borrowed from react-native-cli.
function getAdbPath() {
  return process.env.ANDROID_HOME
    ? process.env.ANDROID_HOME + '/platform-tools/adb'
    : 'adb';
}

// Start test server, listening for test results to be posted.
function runServer(command, dev, port) {
  server.locals.dev = dev;
  const serverPort = port !== undefined ? port : 8082
  const app = server.listen(serverPort, () => {
    if (command == 'run-android') {
      runAdbReverse(serverPort);
    }
    console.log(`cavy: Listening on port ${serverPort} for test results...`);
  });
}

// Runs tests using the React Native CLI.
// command: `cavy run-ios` or `cavy run-android`
// file: the file to boot the app from, supplied as a command option
// skipbuild: whether to skip the React Native build/run step
// dev: whether to keep the server alive after tests finish
// args: any extra arguments the user would usually to pass to `react native run...`
function runTests(command, file, skipbuild, dev, port, args) {

  // Assume entry file is 'index.js' if user doesn't supply one.
  const entryFile = file || 'index.js';
  const regex = /\.js$/;

  // Check that the app entry file ends in .js before continuing.
  if (!regex.test(entryFile)) {
    console.log(`cavy: Please provide an app entry file that ends in .js`);
    process.exit(1);
  }

  // Assume that the user has set up Cavy in a corresponding .test.js file.
  const testEntryFile = entryFile.replace(regex, '.test.js');
  const testEntryFileExists = existsSync(testEntryFile);

  // Warn the user and exit if no corresponding test file exists.
  if (file && !testEntryFileExists) {
    console.log(`cavy: Could not find test entry point named ${testEntryFile}.`);
    process.exit(1);
  }
  
  // Check whether the app has this test file and if so, swap it into index.js.
  if (testEntryFileExists) {
    switchEntryFile(entryFile, testEntryFile);
  }

  // Handle reverting any file changes made before exiting the process.
  process.on('exit', () => {
    if (switched) {
      teardown(entryFile, testEntryFile)
    };
  });
  // If the user interrupts the process (ctrl-c), revert any file changes before
  // exiting.
  process.on('SIGINT', () => {
    console.log('cavy: Received SIGINT, cleaning up');
    process.exit(1);
  });

  if (skipbuild) {
    runServer(command, dev, port);
  } else {
    // Build the app, start the test server and wait for results.
    console.log(`cavy: Running \`react-native ${command}\`...`);

    let rn = spawn('react-native', [command, ...args], {
      stdio: 'inherit',
      shell: true
    });

    // Wait for the app to build first...
    rn.on('close', (code) => {
      console.log(`cavy: react-native exited with code ${code}.`);
      // ... quit if something went wrong.
      if (code) {
        return process.exit(code);
      }
      runServer(command, dev, port);
    });
  }
}

module.exports = runTests;
