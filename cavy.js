#!/usr/bin/env node

const program = require('commander');
const { spawn, execFileSync } = require('child_process');

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

if (reactNativeCommand !== 'run-ios' && reactNativeCommand !== 'run-android') {
  program.outputHelp();
  process.exit(1);
}

console.log(`cavy: running \`react-native ${reactNativeCommand}\`...`);
let rn = spawn('react-native', [reactNativeCommand, ...getCommandParams(reactNativeCommand, process.argv)], {stdio: 'inherit'});
rn.on('close', (code) => {
  console.log(`cavy: react-native exited with code ${code}.`);
  if (code) {
    return process.exit(code);
  }

  // Start test server, listening for test results to be posted
  const app = server.listen(8082, () => {
    if (reactNativeCommand == 'run-android') {
      try {
        // Runs ADB reverse tcp:8082 tcp:8082 to allow reporting of test results
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
