const admin = require('firebase-admin');

const verifyTokenWithFirebase = async (token) => {
  try {
    return await admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => decodedToken.uid);
  } catch {
    throw new Error('Invalid credentials');
  }
};

const getUserWithIdFromFirebase = async (uid) => {
  try {
    return await admin
      .auth()
      .getUser(uid)
      .then((userRecord) => userRecord);
  } catch {
    throw new Error('Invalid user');
  }
};

module.exports = { verifyTokenWithFirebase, getUserWithIdFromFirebase };
