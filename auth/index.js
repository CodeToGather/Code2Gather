const admin = require('firebase-admin');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { StatusCodes } = require('http-status-codes');
const { verify } = require('jsonwebtoken');
const axios = require('axios');

const {
  createAuthenticationToken,
  isBearerToken,
  isAccessTokenSignedPayload,
} = require('./token');
const {
  verifyTokenWithFirebase,
  getUserWithIdFromFirebase,
} = require('./service');

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const corsOptions = {
  origin: '*',
};

const app = express();

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.post('/login', async (req, res) => {
  try {
    const { token, githubUsername, photoUrl, profileUrl } = req.body;
    if (token == null) {
      throw new Error();
    }

    const uid = await verifyTokenWithFirebase(token);
    if (uid == null) {
      throw new Error();
    }

    const createUserResponse = await axios.post(
      `${process.env.HISTORY_URL}/user`,
      {
        id: uid,
        githubUsername,
        photoUrl,
        profileUrl,
      },
    );

    if (createUserResponse.status !== 200) {
      throw new Error();
    }

    const jwtToken = createAuthenticationToken(uid);
    res.status(StatusCodes.OK).json({ token: jwtToken });
    return;
  } catch {
    res.status(StatusCodes.BAD_REQUEST).json();
  }
});

app.get('/auth', async (req, res) => {
  const bearerToken = req.headers.authorization;
  if (!isBearerToken(bearerToken) || process.env.JWT_SECRET == null) {
    res.status(StatusCodes.UNAUTHORIZED).json();
    return;
  }
  const token = bearerToken.split(' ')[1];

  let payload;
  try {
    payload = verify(token, process.env.JWT_SECRET);
    if (!isAccessTokenSignedPayload(payload)) {
      throw new Error();
    }
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json();
    return;
  }

  const { uid } = payload;
  try {
    await getUserWithIdFromFirebase(uid);
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json();
    return;
  }

  res.status(StatusCodes.OK).json({ uid });
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on: ${process.env.PORT}`);
});

module.exports = app;
