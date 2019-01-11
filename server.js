const express = require('express');
const server = express();
const chalk = require('chalk');

server.use(express.json());

// Internal: Takes a count and string, returns formatted and pluralized string.
// e.g. countString(5, 'failure') => '5 failures'
//      countString(1, 'failure') => '1 failure'
//      countString(0, 'failure') => '0 failures'
function countString(count, str) {
  let string = (count == 1) ? str : str + 's';
  return `${count} ${string}`;
};

// Public: POST route which accepts json report object, console logs the results
// and quits the process with either exit code 1 or 0 depending on whether any
// tests failed.
server.post('/report', (req, res) => {
  const results = req.body['results'];
  const errorCount = req.body['errorCount'];
  const duration = req.body['duration'];

  results.forEach((result, index) => {
    message = `${index + 1}) ${result['message']}`;

    if (result['passed']) {
      // Log green test result if test passed
      console.log(chalk.green(message));
    } else {
      // Log red test result if test failed
      console.log(chalk.red(message));
    }
  })

  console.log(`Finished in ${duration} seconds`);
  const endMsg = `${countString(results.length, 'example')}, ${countString(errorCount, 'failure')}`;

  // If all tests pass, exit with code 0, else code 1
  if (!errorCount) {
    console.log(chalk.green(endMsg));
    res.send('ok');
    process.exit(0);
  } else {
    console.log(chalk.red(endMsg));
    res.send('failed');
    process.exit(1);
  }
});

module.exports = server;
