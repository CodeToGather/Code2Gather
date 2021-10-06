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

module.exports = verifyTokenWithFirebase;
