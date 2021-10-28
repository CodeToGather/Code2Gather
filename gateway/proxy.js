const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();

// TODO: change to actual service base url
const AUTH_BASE_URL = 'http://localhost:8001';
const HISTORY_BASE_URL = 'http://localhost:8002';
const PAIRING_BASE_URL = 'http://localhost:8003';
const VIDEO_BASE_URL = 'http://localhost:8004';
const CODE_EXECUTOR_BASE_URL = 'http://localhost:8005';
const CODING_BASE_URL = 'http://localhost:8006';
const ROOM_BASE_URL = 'http://localhost:8007';

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

const historyProxy = (req, res) => {
  proxy.web(req, res, { target: HISTORY_BASE_URL });
};

const pairingProxy = (req, res) => {
  proxy.web(req, res, { target: PAIRING_BASE_URL });
};

const videoProxy = (req, res) => {
  proxy.web(req, res, { target: VIDEO_BASE_URL });
};

const codeExecutorProxy = (req, res) => {
  proxy.web(req, res, { target: CODE_EXECUTOR_BASE_URL });
};

const codingProxy = (req, res) => {
  proxy.web(req, res, { target: CODING_BASE_URL });
};

const roomProxy = (req, res) => {
  proxy.web(req, res, { target: ROOM_BASE_URL });
};

module.exports = {
  authProxy,
  historyProxy,
  pairingProxy,
  videoProxy,
  codeExecutorProxy,
  codingProxy,
  roomProxy,
};
