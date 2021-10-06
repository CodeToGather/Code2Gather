const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const code = require('http-status-codes');

const admin = require('firebase-admin');

const dotenv = require('dotenv');
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});


const app = express();
const verifyTokenWithFirebase = require('./service');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/auth', async (req, res) => {
  try {
    if (req.headers.authorization) {
      const uid = await verifyTokenWithFirebase(req.headers.authorization);
      if (uid) {
        res.status(code.OK).json();
        return;
      }
    }
    res.status(code.FORBIDDEN).json();
  } catch {
    res.status(code.FORBIDDEN).json();
  }
});

app.listen(3002, () => {
  console.log('Listening on: 3002');
});

module.exports = app;
