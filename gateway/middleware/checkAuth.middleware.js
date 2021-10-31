const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { AUTH_BASE_URL } = require('../proxy');

const checkAuth = async (req, res, next) => {
  const url = `${AUTH_BASE_URL}/auth`;
  await axios
    .get(url, {
      headers: {
        // only include authorization header
        // content-length and other headers for post request may affect the GET /auth route
        authorization: req.headers.authorization,
      },
    })
    .then((authRes) => {
      const { uid } = authRes.data;
      // overwrite authorization header with uid before proxying
      req.headers.authorization = uid;
      next();
    })
    .catch(() => {
      res.status(StatusCodes.UNAUTHORIZED).json();
    });
};

module.exports = checkAuth;
