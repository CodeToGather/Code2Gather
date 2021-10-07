const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const checkAuth = require('./middleware/checkAuth.middleware');
const { pairingProxy, roomProxy, historyProxy, authProxy, codingProxy } = require('./proxy');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

// Test route
app.get('/hello', (_req, res) => {
  res.json({
    message: 'Hello world',
  });
});

// For authentication purposes
app.use('/auth', authProxy);

// Middleware: auth service
// All routes after this will be authenticated
app.use(checkAuth);

app.use('/pairing', pairingProxy);
app.use('/room', roomProxy);
app.use('/history', historyProxy);
app.use('/coding', codingProxy);

module.exports = app;
