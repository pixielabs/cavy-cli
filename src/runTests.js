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
  console.log(`cavy: found an ${testEntryFile} entry point. Temporarily replacing ${entryFile} to run tests`);

  const cmd = `mv ${entryFile} index.notest.js && mv ${testEntryFile} index.js`;
  console.log(`cavy: running \`${cmd}\`...`);
  execSync(cmd);

  // Save that we did this, so we can undo it later.
  switched = true;
}

// If file changes have been made, revert them.
function teardown(entryFile, testEntryFile) {
  console.log(`cavy: putting your ${entryFile} back`);
  const cmd = `mv index.js ${testEntryFile} && mv index.notest.js ${entryFile}`;
  console.log(`cavy: running \`${cmd}\`...`);
  execSync(cmd);
}

function runAdbReverse() {
  try {
    // Run ADB reverse tcp:8082 tcp:8082 to allow reporting of test results
    // from React Native. Borrowed from react-native-cli.
    const adbPath = getAdbPath();
    const adbArgs = ['reverse', 'tcp:8082', 'tcp:8082'];
    console.log(`cavy: Running ${adbPath} ${adbArgs.join(' ')}`);
    execFileSync(adbPath, adbArgs, {stdio: 'inherit'});
  } catch(e) {
    console.error(`Could not run adb reverse: ${e.message}`);
    process.exit(1);
  }
}

// Borrowed from react-native-cli.
function getAdbPath() {
  return process.env.ANDROID_HOME
    ? process.env.ANDROID_HOME + '/platform-tools/adb'
    : 'adb';
}

// Runs tests using the React Native CLI.
// command: `cavy run-ios` or `cavy run-android`
// file: the file to boot the app from, supplied as a command option
// args: any extra arguments the user would usually to pass to `react native run...`
function runTests(command, file, args) {
  // Assume entry file is 'index.js' if user doesn't supply one.
  const entryFile = file || 'index.js';
  // Assume that the user has set up Cavy in a corresponding .test.js file.
  const testEntryFile = entryFile.replace(/\.js$/, '.test.js');
  // Check whether the app has this test file and if so, swap it into index.js.
  if (existsSync(testEntryFile)) {
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
  // Build the app, start the test server and wait for results.
  console.log(`cavy: running \`react-native ${command}\`...`);

  let rn = spawn('react-native', [command, ...args], { stdio: 'inherit' });

  // Wait for the app to build first...
  rn.on('close', (code) => {
    console.log(`cavy: react-native exited with code ${code}.`);
    // ... quit if something went wrong.
    if (code) {
      return process.exit(code);
    }
    // ... start test server, listening for test results to be posted.
    const app = server.listen(8082, () => {
      if (command == 'run-android') {
        runAdbReverse();
      }
      console.log(`cavy: listening on port 8082 for test results...`);
    });
  });
}

module.exports = runTests;
