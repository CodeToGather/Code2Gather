const code = require('http-status-codes');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const checkAuth = require('./middleware/checkAuth.middleware');

const { pairingProxy, roomProxy, historyProxy } = require('./proxy');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// middleware: auth service
app.use('/', checkAuth);

// test route
app.get('/hello', (req, res) => {
  res.json({
    message: 'hello world',
  });
});

app.use('/pairing', pairingProxy);
app.use('/room', roomProxy);
app.use('/history', historyProxy);

// catch 404
app.use((req, res) => {
  res.status(code.NOT_FOUND).json({
    message: 'No such route exists',
  });
});

module.exports = app;
