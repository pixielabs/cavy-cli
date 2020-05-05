const { writeFileSync } = require('fs');
var xml2js = require('xml2js');

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

// Takes a result object and tranforms into XML according to the JUnit reporting
// specifications.
function constructXML(results) {
  const filename = 'cavy_results.xml';
  console.log(`Writing results to ${filename}`);
  let formattedResults = {
    "testsuites": {
      "testsuite": results.map(suite => formattedSuite(suite))
    }
  }
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(formattedResults);
  writeFileSync(filename, xml);
}

module.exports = constructXML;