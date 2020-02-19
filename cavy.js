#!/usr/bin/env node
const program = require('commander');
const init = require('./src/init');
const runTests = require('./src/runTests');

function getCommandArgs(cmd) {
  // Get array of all command line args.
  const allArgs = process.argv;
  const commandIndex = allArgs.indexOf(cmd.name());
  const args = allArgs.slice(commandIndex, allArgs.length)

  // Remove Cavy options from other args so RN cli doesn't try to call them.
  cmd.options.forEach(option => {
    for (var i = 0; i < args.length; i++) {
      if ([option.short, option.long].includes(args[i])) {
        // Remove the option flag itself and its value.
        args.splice(i, 2)
        // Only remove the first instance of the match - the second might be
        // a valid RN CLI command option.
        break;
      };
    }
  });
  return args;
}

function test(cmd) {
  const args = getCommandArgs(cmd);
  const commandName = cmd.name();
  const entryFile = cmd.file;
  const skipbuild = cmd.skipbuild;
  const dev = cmd.dev;
  const port = cmd.port;
  runTests(commandName, entryFile, skipbuild, dev, port, args);
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
  .option('-f, --file <file>', 'App entry file (defaults to index.js)')
  .option(
    '-s, --skipbuild',
    'Swap the index files and start the report server without first building the app'
  )
  .option('-d, --dev', 'Keep report server alive until manually killed')
  .option('-p, --port <port>', 'Port to run Cavy on')
  .allowUnknownOption()
  .action(cmd => test(cmd));

program
  .command('run-android')
  .description('Run cavy spec on an android simulator or device')
  .option('-f, --file <file>', 'App entry file (defaults to index.js)')
  .option(
    '-s, --skipbuild',
    'Swap the index files and start the report server without first building the app'
  )
  .option('-d, --dev', 'Keep report server alive until manually killed')
  .option('-p, --port <port>', 'Port to run Cavy on')
  .allowUnknownOption()
  .action(cmd => test(cmd));

program.parse(process.argv);
