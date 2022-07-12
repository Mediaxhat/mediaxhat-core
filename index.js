const express = require('express');
const path = require('path');
const app = express();
const compression = require('compression')

app.use(compression())

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(80);