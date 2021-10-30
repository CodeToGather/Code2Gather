const httpProxy = require('http-proxy');
const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = httpProxy.createProxyServer();

// TODO: change to actual service base url
const AUTH_BASE_URL = 'http://localhost:3002/auth';
const PAIRING_BASE_URL = 'http://localhost:3001/pairing';
const ROOM_BASE_URL = 'http://localhost:3002/room';
const HISTORY_BASE_URL = 'http://localhost:3003/history';
const CODING_BASE_URL = 'http://localhost:3004/coding';

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

const pairingWsProxy = createProxyMiddleware('/pairing', {
  target: PAIRING_BASE_URL,
  ws: true,
});

const roomProxy = (req, res) => {
  proxy.web(req, res, { target: ROOM_BASE_URL });
};

const historyProxy = (req, res) => {
  proxy.web(req, res, { target: HISTORY_BASE_URL });
};

const codingProxy = (req, res) => {
  proxy.web(req, res, { target: CODING_BASE_URL });
};

module.exports = {
  authProxy,
  historyProxy,
  pairingWsProxy,
  videoProxy,
  codeExecutorProxy,
  codingProxy,
  roomProxy,
  historyProxy,
  codingProxy,
};
