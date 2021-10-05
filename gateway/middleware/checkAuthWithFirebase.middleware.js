const admin = require("firebase-admin");

function checkAuthWithFirebase(req, res, next) {
  if (req.headers.authtoken) {
    admin
      .auth()
      .verifyIdToken(req.headers.authtoken)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        console.log(uid);
        next();
      })
      .catch(() => {
        res.status(403).json({
          message: "Unauthorized.",
        });
      });
  } else {
    res.status(403).json({
      message: "Unauthorized.",
    });
  }
}

module.exports = checkAuthWithFirebase;
