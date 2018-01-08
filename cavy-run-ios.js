const { spawn } = require('child_process');
const rn = spawn('react-native', ['run-ios']);
const server = require('./server.js')

rn.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

rn.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

rn.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
  if (!code) {
    // Start test server, listening for test results to be posted
    const app = server.listen(4000, () => {
      console.log('Running Cavy tests...');
    });
  } else {
    process.exit(code);
  }
});
