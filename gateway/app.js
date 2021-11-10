const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const checkAuth = require('./middleware/checkAuth.middleware');
const {
  roomProxy,
  historyProxy,
  authProxy,
  pairingWsProxy,
  roomWsProxy,
  codingWsProxy,
  videoProxy,
} = require('./proxy');

const app = express();

const corsOptions = {
  // TODO: Fix the production URL once deployed
  origin:
    process.env.NODE_ENV === 'production'
      ? /.*placeholder\.placeholder\.app.*/
      : '*',
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

// Test route
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Hello world',
  });
});

// For authentication purposes
app.use('/auth', authProxy);

// Websocket routes are authenticated by the sockets, if required
app.use(pairingWsProxy);
app.use(roomWsProxy);
app.use(codingWsProxy);

// Middleware: auth service
// All routes after this will be authenticated
app.use(checkAuth);

app.use('/room', roomProxy);
app.use('/history', historyProxy);
app.use('/video', videoProxy);

module.exports = app;
