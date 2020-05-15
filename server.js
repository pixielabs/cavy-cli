const http = require('http');
const WebSocket = require('ws');
const chalk = require('chalk');
const constructXML = require('./src/junitFormatter');

// Initialize a server
const server = http.createServer();

// Setup local variables for server
server.locals = {
  appBooted: false,
  testCount: 0
};

// Initialize a WebSocket Server instance
const wss = new WebSocket.Server({server});

// Setup the wanted behaviour for specific socket events
wss.on('connection', socket => {
  socket.on('message', message => {
    const json = JSON.parse(message);

    switch(json.route) {
      case 'singleResult':
        logTestResult(json.data);
        break;
      case 'testingComplete':
        shutDownServer(json.data);
        break;
    }
  });

  // Now we have made a connection with Cavy, we know the app has booted.
  server.locals.appBooted = true;
})

// Internal: Takes a count and string, returns formatted and pluralized string.
// e.g. countString(5, 'failure') => '5 failures'
//      countString(1, 'failure') => '1 failure'
//      countString(0, 'failure') => '0 failures'
function countString(count, str) {
  let string = (count == 1) ? str : str + 's';
  return `${count} ${string}`;
}

// Internal: Accepts a test result json object and console.logs the result.
function logTestResult(testResultJson) {
  const { message, passed } = testResultJson;

  server.locals.testCount++ ;
  formattedMessage = `${server.locals.testCount}) ${message}`;

  if (passed) {
    // Log green test result if test passed
    console.log(chalk.green(formattedMessage));
  } else {
    // Log red test result if test failed
    console.log(chalk.red(formattedMessage));
  }
};

// Internal: Accepts a json report object, console.logs the overall result of
// the test suite and quits the process with either exit code 1 or 0 depending
// on whether any tests failed.
function shutDownServer(reportJson) {
  const { results, fullResults, errorCount, duration } = reportJson;

  // Set the testCount to zero at the end of the test suite.
  server.locals.testCount = 0;

  console.log(`Finished in ${duration} seconds`);
  const endMsg = `${countString(results.length, 'example')}, ${countString(errorCount, 'failure')}`;

  // If requested, construct XML report.
  if (server.locals.outputAsXml) {
    constructXML(fullResults);
  }

  // If all tests pass, exit with code 0, else code 1
  if (!errorCount) {
    console.log(chalk.green(endMsg));
    if (!server.locals.dev) {
      process.exit(0);
    }
  } else {
    console.log(chalk.red(endMsg));
    if (!server.locals.dev) {
      process.exit(1);
    }
  }
  console.log('--------------------');
};

module.exports = server;
