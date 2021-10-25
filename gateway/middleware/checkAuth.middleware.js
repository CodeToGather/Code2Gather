const axios = require('axios');
const { StatusCodes } = require('http-status-codes');

// TODO: change base url based on NODE_ENV
const AUTH_BASE_URL = 'http://localhost:3002';
const CHECK_AUTH_PATH = 'auth';

const checkAuth = async (req, res, next) => {
  const url = `${AUTH_BASE_URL}/${CHECK_AUTH_PATH}`;
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
