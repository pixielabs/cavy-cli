#!/usr/bin/env node
const program = require('commander');
const init = require('./src/init');
const runTests = require('./src/runTests');

function _getCommandParams(command, args) {
  const commandIndex = args.indexOf(command);

  return args.slice(commandIndex, args.length);
}

// Stop quitting unless we want to
process.stdin.resume();

let command;

program.
  version('0.0.3').
  arguments('<run-ios|run-android|init>', 'react-native command to run').
  action((cmd) => command = cmd).
  parse(process.argv);

// Check that the user has entered a valid argument
if (!['run-ios', 'run-android', 'init'].includes(command)) {
  program.outputHelp();
  process.exit(1);
}

const args = _getCommandParams(command, process.argv);

if (command == 'init') {
  init(args);
} else {
  runTests(command, args);
}
