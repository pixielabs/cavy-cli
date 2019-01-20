#!/usr/bin/env node
const program = require('commander');
const { spawn, execFileSync, execSync } = require('child_process');
const { existsSync } = require('fs');

const server = require('./server')

// Stop quitting unless we want to
process.stdin.resume();

let testEntryPoint = false;

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

// If file changes have been made, revert them.
function teardown() {
  if (testEntryPoint) {
    console.log('cavy: putting your index.js back');
    const cmd = 'mv index.js index.test.js && mv index.notest.js index.js';
    console.log(`cavy: running \`${cmd}\`...`);
    execSync(cmd);
  }
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
  teardown();
});

// If the user interrupts the process (ctrl-c), revert any file changes before
// exiting.
process.on('SIGINT', () => {
  console.log('cavy: Received SIGINT, cleaning up');
  process.exit(1);
});

// Build the app, start the test server and wait for results.
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
