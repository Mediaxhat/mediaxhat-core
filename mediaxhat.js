const express = require('express');
const path = require('path');
const app = express();
const compression = require('compression')
const cluster = require('node:cluster');
const numCPUs = require('node:os').cpus().length;
const process = require('node:process');

app.use(compression())

app.use(express.static(path.join(__dirname, 'build')));

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  
  app.listen(3000);

  console.log(`Worker ${process.pid} started`);
}