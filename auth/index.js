const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const code = require('http-status-codes');

const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const verifyTokenWithFirebase = require('./service');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/auth', async (req, res) => {
  try {
    if (req.headers.authtoken) {
      const uid = await verifyTokenWithFirebase(req.headers.authtoken);
      if (uid) {
        res.status(code.OK).json();
        return;
      }
      res.status(code.FORBIDDEN).json();
    }
  } catch {
    res.status(code.FORBIDDEN).json();
  }
});

app.listen(3002, () => {
  console.log('Listening on: 3002');
});

module.exports = app;
