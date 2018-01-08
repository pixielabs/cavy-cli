#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const figlet = require('figlet')

program
  .version('0.0.1')
  .command('run-ios', 'run `react-native run-ios` and capture Cavy test results')
  .parse(process.argv)

console.log(figlet.textSync('Cavy', {font: 'isometric3'}));
