const express = require('express');
const server = express();
const chalk = require('chalk');
const { writeFileSync } = require('fs');
const parser = require('xml2json');

server.use(express.json());

// Internal: Takes a count and string, returns formatted and pluralized string.
// e.g. countString(5, 'failure') => '5 failures'
//      countString(1, 'failure') => '1 failure'
//      countString(0, 'failure') => '0 failures'
function countString(count, str) {
  let string = (count == 1) ? str : str + 's';
  return `${count} ${string}`;
};

function formattedCase(testcase) {  
  if (testcase.errorMsg) {
    testcase.failure = {
      message: testcase.name,
      $t: testcase.errorMsg
    }
  }

  ['passed', 'errorMsg', 'message'].forEach(k => delete testcase[k]);

  return testcase;
}

function formattedSuite(suite) {
  return (
    {
      name: suite.name,
      timestamp: suite.timestamp,
      tests: suite.testcases.length,
      failures: suite.testcases.filter(testcase => testcase.errorMsg).length,
      errors: 0,
      testCase: suite.testcases.map(testcase => formattedCase(testcase))
    }
  )
}

function constructXML(results) {
  const filename = 'cavy_results.xml';
  console.log(`Writing results to XML ${filename}`);

  let formattedResults = {
    "testsuites": {
      "testsuite": results.map(suite => formattedSuite(suite))
    }
  }

  const stringified = JSON.stringify(formattedResults);
  const xml = parser.toXml(stringified);

  writeFileSync(filename, xml);
}

// Public: POST route which accepts json report object, console logs the results
// and quits the process with either exit code 1 or 0 depending on whether any
// tests failed.
server.post('/report', (req, res) => {
  const results = req.body['results'];
  const resultsJson = req.body['fullResults'];
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

  // If requested, construct XML report.
  if (req.app.locals.xml) {    
    constructXML(resultsJson);
  }

  // If all tests pass, exit with code 0, else code 1
  if (!errorCount) {
    console.log(chalk.green(endMsg));
    res.send('ok');
    if (!req.app.locals.dev) {
      process.exit(0);
    }
  } else {
    console.log(chalk.red(endMsg));
    res.send('failed');
    if (!req.app.locals.dev) {
      process.exit(1);
    }
  }
  console.log('--------------------');
});

// Public: GET route that can be used to check whether the server is listening
// without have to hit /report.
server.get('/', (req, res) => {
  res.send('cavy-cli running');
});

module.exports = server;
