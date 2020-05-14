const http = require('http');
const WebSocket = require('ws');
const chalk = require('chalk');
const constructXML = require('./src/junitFormatter');

// Initialize a server
const server = http.createServer();

// Setup local variables for server
server.locals = { appBooted: false};

// Initialize a WebSocket Server instance
const wss = new WebSocket.Server({server});

// Setup the wanted behaviour for specific socket events
wss.on('connection', socket => {
  socket.on('message', message => {
    const resultsJSON = JSON.parse(message);
    processReport(resultsJSON);
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

// Internal: Accepts a json report object, console logs the results
// and quits the process with either exit code 1 or 0 depending on whether any
// tests failed.
function processReport(resultsJSON) {
  const { results, fullResults, errorCount, duration } = resultsJSON;

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
