#!/usr/bin/env node --harmony

const program = require('commander');
const { spawn } = require('child_process');

const server = require('./server')

let reactNativeCommand;

program.
  version('0.0.1').
  option('-p, --port <port>', 'port to listen on', 8082, parseInt).
  arguments('<run-ios|run-android>', 'react-native command to run').
  action((cmd) => reactNativeCommand = cmd).
  parse(process.argv);

if (reactNativeCommand !== 'run-ios' && reactNativeCommand !== 'run-android') {
  program.outputHelp();
  process.exit(1);
}

console.log(`cavy: running \`react-native ${reactNativeCommand}\`...`);
let rn = spawn('react-native', [reactNativeCommand], {stdio: 'inherit'});
rn.on('close', (code) => {
  console.log(`cavy: react-native exited with code ${code}.`);
  if (code) {
    return process.exit(code);
  }

  // Start test server, listening for test results to be posted
  const app = server.listen(4000, () => {
    console.log('cavy: running Cavy tests...');
  });
});
