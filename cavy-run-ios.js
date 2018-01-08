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
  console.log(`child process exited with code ${code}`);
  if (!code) {
    server.listen(4000, () => { console.log('listening'); });
  } else {
    process.exit(code);
  }
});
