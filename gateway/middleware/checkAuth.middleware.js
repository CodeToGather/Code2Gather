const axios = require('axios');
const { StatusCodes } = require('http-status-codes');

// TODO: change base url based on NODE_ENV
const AUTH_BASE_URL = 'http://localhost:3002';
const CHECK_AUTH_PATH = 'auth';

const checkAuth = async (req, res, next) => {
  const url = `${AUTH_BASE_URL}/${CHECK_AUTH_PATH}`;
  await axios
    .get(url, {
      headers: req.headers,
    })
    .then((authRes) => {
      const { uid } = authRes.data;
      res.locals.uid = uid;
      next();
    })
    .catch(() => {
      res.status(StatusCodes.UNAUTHORIZED).json();
    });
};

module.exports = checkAuth;
