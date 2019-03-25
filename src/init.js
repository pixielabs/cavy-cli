// Command to set up Cavy within a repo
// `cavy init`
//
const indexContent = require('../templates/index.test.js');
const specContent = require('../templates/exampleSpec.js');
const { existsSync, writeFileSync, mkdirSync } = require('fs');

// Sets up Cavy entry index file and example spec.
function init(args) {
  if (existsSync('index.js')) {
    console.log('Adding Cavy to your project...');

    // The first additional argument to cavy init is taken to be the name
    // of the test folder. If nothing is provided, then fall back on `specs`.
    // This is used in the index.test.js file too.
    const folderName = args[1] || 'specs';

    // Create a exampleTest.js file in the specified folder in the route of the
    // project.
    mkdirSync(`./${folderName}`);
    writeFileSync(`./${folderName}/exampleSpec.js`, specContent);

    // Create an index.test.js file in the route of the project.
    writeFileSync('index.test.js', indexContent(folderName));

    // Exit
    console.log('Done!');
    process.exit(1);
  }
}

module.exports = init;
