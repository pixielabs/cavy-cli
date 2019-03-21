const { existsSync } = require('fs');

// This is called if the user types `cavy init`
function init() {
  if (existsSync('index.js')) {
    console.log('HELLO');
    process.exit(1);
  }
}

module.exports = init;
