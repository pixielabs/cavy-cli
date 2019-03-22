const indexContent = require('../templates/index.test.js');
const specContent = require('../templates/exampleSpec.js');
const { existsSync, writeFileSync, mkdirSync } = require('fs');

// This is called if the user types `cavy init`
function init() {
  if (existsSync('index.js')) {
    console.log('Adding Cavy to your project...');
    // Create an index.test.js file in the route of the project
    writeFileSync('index.test.js', indexContent);
    // Create a exampleTest.js file in a spec folder in the route of the project.
    mkdirSync('./specs');
    writeFileSync('./specs/exampleSpec.js', specContent);
    // Exit
    process.exit(1);
  }
}

module.exports = init;
