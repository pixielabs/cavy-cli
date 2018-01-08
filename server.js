const express = require('express');
const server = express();

server.post('/report', (req, res) => {
  console.log('I got a report');
  res.send('I got a report');
});

module.exports = server;
