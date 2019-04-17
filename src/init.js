// Command to set up Cavy within a repo
// `cavy init`
//
const indexContent = require('../templates/index.test.js');
const specContent = require('../templates/exampleSpec.js');
const { existsSync, writeFileSync, mkdirSync } = require('fs');

REACT_NATIVE_PATH = 'node_modules/react-native'
DEFAULT_TEST_DIR = 'specs';
DEFAULT_ENTRY_FILE = 'index.test.js';

// Takes a string a strips out any reserved characters for filenames on
// Unix-like systems or Windows.
function sanitiseFolderName(name) {
  const regex = /[<>:"\/\\|?*]/g;
  return name.replace(regex, '')
}

// Sets up Cavy entry index file and example spec.
function setUpCavy(specFolderName) {
  console.log('cavy: Adding Cavy to your project...');

  // The first additional argument to cavy init is the name of the test
  // directory. This is used in the index.test.js file too.
  let folderName = specFolderName || DEFAULT_TEST_DIR;
  folderName = sanitiseFolderName(folderName);

  if (existsSync(folderName)) {
    console.log(`cavy: Looks like a ./${folderName} directory already exists for this project.`);
    console.log('cavy: To continue set up, re-run the command with an alternative test directory name: `cavy init <test-directory>`')
    process.exit(0)
  }

  // Create a exampleTest.js file in the specified folder in the route of the
  // project.
  mkdirSync(`./${folderName}`);
  writeFileSync(`./${folderName}/exampleSpec.js`, specContent);

  // Don't overwrite any index.test.js file that already exists.
  if (existsSync(DEFAULT_ENTRY_FILE)) {
    console.log(`cavy: ${DEFAULT_ENTRY_FILE} already exists, skipping this step.`);
  } else {
    // Create an index.test.js file in the route of the project.
    writeFileSync(DEFAULT_ENTRY_FILE, indexContent(folderName));
  }

  // Exit
  console.log('cavy: Done!');
  process.exit(1);
}

// Checks that you're inside a React Native project, and if so runs setUpCavy.
function init(specFolderName) {
  console.log(specFolderName);
  if (existsSync(REACT_NATIVE_PATH)) {
    setUpCavy(specFolderName);
  } else {
    console.log("cavy: Make sure you're inside a React Native project and that you've run npm install.");
    process.exit(0)
  }
};

module.exports = init;
