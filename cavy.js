#!/usr/bin/env node
const program = require('commander');
const { spawn, execFileSync, exec } = require('child_process');

const server = require('./server')

function getCommandParams(command, args) {
  const commandIndex = args.indexOf(command);

  return args.slice(commandIndex, args.length)
}

// Borrowed from react-native-cli
function getAdbPath() {
  return process.env.ANDROID_HOME
    ? process.env.ANDROID_HOME + '/platform-tools/adb'
    : 'adb';
}

let reactNativeCommand;

program.
  version('0.0.3').
  arguments('<run-ios|run-android>', 'react-native command to run').
  action((cmd) => reactNativeCommand = cmd).
  parse(process.argv);

// Check that the user has entered a valid argument
if (reactNativeCommand !== 'run-ios' && reactNativeCommand !== 'run-android') {
  program.outputHelp();
  process.exit(1);
}

// Check whether the app has an index.test.js file...
const check = exec(`test -e ./index.test.js`);

// ... and if it does, use it to build the app - this is where Cavy config
// should be.
check.on('close', (code) => {
  if (code == 0) {
    // Set an env var so that the test server knows whether to teardown this
    // test setup process.
    process.env.TEST_ENTRY_POINT_PRESENT = 'true';
    const setUp = exec(`mv index.js index.temp.js && mv index.test.js index.js`);
    setUp.on('close', () => buildApp());
  } else {
    buildApp();
  }
});

// Build the app, start the test server and wait for results.
function buildApp() {
  console.log(`cavy: running \`react-native ${reactNativeCommand}\`...`);

  let rn = spawn('react-native', [reactNativeCommand, ...getCommandParams(reactNativeCommand, process.argv)], {stdio: 'inherit'});
  // Wait for the app to build first...
  rn.on('close', (code) => {
    console.log(`cavy: react-native exited with code ${code}.`);
    // ... quit if something went wrong.
    if (code) {
      return process.exit(code);
    }
    // ... start test server, listening for test results to be posted.
    const app = server.listen(8082, () => {
      if (reactNativeCommand == 'run-android') {
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
      console.log(`cavy: listening on port 8082 for test results...`);
    });
  });
}
