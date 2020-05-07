const { writeFileSync } = require('fs');
var xml2js = require('xml2js');
var os = require('os');

// Private: Returns a failure XML element, with required properties and inner
// text.
function formattedTestError(test) {
  return {
    $: {
      message: test.message,
      // At the moment, Cavy doesn't have different failure types.
      type: 'cavy test failure'
    },
    _: test.errorMessage
  }
}

// Private: Returns a testcase XML element, with required properties.
function formattedTestCase(test) {
  const formattedTest = {
    $: {
      classname: test.describeLabel,
      name: test.description,
      time: test.time
    }
  }

  // If the test failed, add a failure XML element.
  if (test.errorMessage) { formattedTest.failure = formattedTestError(test) }
  return formattedTest;
}

// Public: Takes a result object and tranforms into XML according to the JUnit
// reporting specifications.
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
        // At the moment, cavy reports an error in the same way as a failure.
        errors: 0,
        time: results.time,
        timestamp: results.timestamp,
        hostname: os.hostname()
      },
      testcase: results.testCases.map(test => formattedTestCase(test))
    }
  }

  const xml = builder.buildObject(formattedResults);
  writeFileSync(filename, xml);
}

module.exports = constructXML;