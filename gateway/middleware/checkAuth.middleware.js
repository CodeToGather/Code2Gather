const axios = require('axios');

// TODO: change base url based on NODE_ENV
const AUTH_BASE_URL = 'http://localhost:3002';
const CHECK_AUTH_PATH = 'auth';

const checkAuth = async (req, res, next) => {
  const url = `${AUTH_BASE_URL}/${CHECK_AUTH_PATH}`;
  await axios
    .get(url, {
      headers: req.headers,
    })
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(403).json();
    });
};

module.exports = checkAuth;
