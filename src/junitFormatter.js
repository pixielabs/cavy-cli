const { writeFileSync } = require('fs');
var xml2js = require('xml2js');

function formattedTestCase(test) {
  const formattedTest = {
    $: {
      classname: test.describeLabel,
      name: test.description,
      time: test.time
    }
  }

  if (test.errorMessage) {
    formattedTest.failure = {
      $: { message: test.message },
      _: test.errorMessage
    }
  }

  return formattedTest;
}

// Takes a result object and tranforms into XML according to the JUnit reporting
// specifications.
function constructXML(results) {
  const filename = 'cavy_results.xml';
  console.log(`Writing results to ${filename}`);

  const builder = new xml2js.Builder();
  const formattedResults = {
    testsuite: {
      $: {
        name: 'cavy',
        tests: results.length,
        failures: results.testCases.filter(test => test.errorMessage).length,
        errors: 0,
        time: results.time,
        timestamp: results.timestamp,
        hostname: 'hostname'
      },
      testCase: results.testCases.map(test => formattedTestCase(test))
    }
  }

  const xml = builder.buildObject(formattedResults);
  writeFileSync(filename, xml);
}

module.exports = constructXML;