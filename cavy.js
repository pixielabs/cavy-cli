#!/usr/bin/env node
const program = require('commander');
const init = require('./src/init');
const runTests = require('./src/runTests');

function getCommandParams(command, args) {
  const commandIndex = args.indexOf(command);
  return args.slice(commandIndex, args.length);
}

// Stop quitting unless we want to
process.stdin.resume();

program
  .command('init [specFolderName]')
  .description('Add cavy to a project with optional spec folder name')
  .action(specFolderName => {
    init(specFolderName);
  });

program
  .command('run-ios')
  .description('Run cavy spec on an ios simulator or device')
  .allowUnknownOption()
  .action(cmd => {
    const command = cmd.name();
    const args = getCommandParams(command, process.argv);
    runTests(command, args);
  });

program
  .command('run-android')
  .description('Run cavy spec on an android simulator or device')
  .allowUnknownOption()
  .action(cmd => {
    const command = cmd.name();
    const args = getCommandParams(command, process.argv);
    runTests(command, args);
  });

program.parse(process.argv);
