#!/usr/bin/env node
const program = require('commander');
const init = require('./src/init');
const runTests = require('./src/runTests');

function getCommandArgs(cmd) {
  // Get array of Cavy options (short and long).
  const options = cmd.options.map(option => [option.short, option.long]).flat();
  // Get array of all command line args.
  const allArgs = process.argv;
  const commandIndex = allArgs.indexOf(cmd.name());
  const args = allArgs.slice(commandIndex, allArgs.length)
  // Remove Cavy options from other options, so that RN cli doesn't try to call
  // them.
  options.forEach(option => {
    args.forEach((arg, i) => { if (arg == option) args.splice(i, 2) });
  });

  return args;
}

function test(cmd) {
  const args = getCommandArgs(cmd);
  const commandName = cmd.name();
  const entryFile = cmd.file;
  runTests(commandName, entryFile, args);
}

// Stop quitting unless we want to
process.stdin.resume();

program.version('1.1.0');

program
  .command('init [specFolderName]')
  .description('Add cavy to a project with optional spec folder name')
  .action(specFolderName => {
    init(specFolderName);
  });

program
  .command('run-ios')
  .description('Run cavy spec on an ios simulator or device')
  .option('-f, --file <file>', 'App entry file')
  .allowUnknownOption()
  .action(cmd => test(cmd));

program
  .command('run-android')
  .description('Run cavy spec on an android simulator or device')
  .option('-f, --file <file>', 'App entry file')
  .allowUnknownOption()
  .action(cmd => test(cmd));

program.parse(process.argv);
