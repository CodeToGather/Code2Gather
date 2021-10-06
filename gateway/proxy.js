const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();

// TODO: change to actual service base url
const AUTH_BASE_URL = 'http://localhost:3002/auth';
const PAIRING_BASE_URL = 'http://localhost:3001/pairing';
const ROOM_BASE_URL = 'http://localhost:3002/room';
const HISTORY_BASE_URL = 'http://localhost:3003/history';

// Parse requests with a body
proxy.on('proxyReq', (proxyReq, req) => {
  if (req.body) {
    const bodyData = JSON.stringify(req.body);

    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));

    proxyReq.write(bodyData);
  }
});

const authProxy = (req, res) => {
  proxy.web(req, res, { target: AUTH_BASE_URL });
};

const pairingProxy = (req, res) => {
  proxy.web(req, res, { target: PAIRING_BASE_URL });
};

const roomProxy = (req, res) => {
  proxy.web(req, res, { target: ROOM_BASE_URL });
};

const historyProxy = (req, res) => {
  proxy.web(req, res, { target: HISTORY_BASE_URL });
};

module.exports = {
  authProxy,
  pairingProxy,
  roomProxy,
  historyProxy,
};
