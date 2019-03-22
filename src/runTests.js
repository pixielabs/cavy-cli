const server = require('../server');
const { existsSync } = require('fs');
const { spawn, execFileSync, execSync } = require('child_process');

// If file changes have been made, revert them.
function _teardown() {
  console.log('cavy: putting your index.js back');
  const cmd = 'mv index.js index.test.js && mv index.notest.js index.js';
  console.log(`cavy: running \`${cmd}\`...`);
  execSync(cmd);
}

// Borrowed from react-native-cli
function _getAdbPath() {
  return process.env.ANDROID_HOME
    ? process.env.ANDROID_HOME + '/platform-tools/adb'
    : 'adb';
}

// This is called if the user types `cavy run-ios` or `cavy run-android`. The
// command argument is one of `run-ios` or `run-android`.
function runTests(command, args) {
  let testEntryPoint = false;
  // Check whether the app has an index.test.js file...
  if (existsSync('index.test.js')) {
    // ... and if it does, use it to build the app - this is where Cavy config
    // should be.
    console.log('cavy: found an index.test.js entry point. Temporarily replacing index.js to run tests');

    const cmd = 'mv index.js index.notest.js && mv index.test.js index.js';
    console.log(`cavy: running \`${cmd}\`...`);
    execSync(cmd);

    // Save that we did this, so we can undo it later.
    testEntryPoint = true;
  }

  // Handle reverting any file changes made before exiting the process.
  process.on('exit', () => {
    if (testEntryPoint) {
      _teardown()
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
        try {
          // Run ADB reverse tcp:8082 tcp:8082 to allow reporting of test results
          // from React Native. Borrowed from react-native-cli.
          const adbPath = _getAdbPath();
          const adbArgs = ['reverse', 'tcp:8082', 'tcp:8082'];
          console.log(`cavy: Running ${adbPath} ${adbArgs.join(' ')}`);
          execFileSync(adbPath, adbArgs, {stdio: 'inherit'});
        } catch(e) {
          console.error(`Could not run adb reverse: ${e.message}`);
          process.exit(1);
        }
      }
      console.log(`cavy: listening on port 8082 for test results...`);
    });
  });
}

module.exports = runTests;
