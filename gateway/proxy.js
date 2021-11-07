const httpProxy = require('http-proxy');
const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = httpProxy.createProxyServer();

const AUTH_BASE_URL = process.env.AUTH_URL;
const HISTORY_BASE_URL = process.env.HISTORY_URL;
const PAIRING_BASE_URL = process.env.PAIRING_URL;
const VIDEO_BASE_URL = process.env.VIDEO_URL;
const CODE_EXECUTOR_BASE_URL = process.env.CODE_EXECUTOR_URL;
const ROOM_BASE_URL = process.env.ROOM_URL;
const CODING_BASE_URL = process.env.CODING_URL;

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

const videoProxy = (req, res) => {
  proxy.web(req, res, { target: VIDEO_BASE_URL });
};

const codeExecutorProxy = (req, res) => {
  proxy.web(req, res, { target: CODE_EXECUTOR_BASE_URL });
};

const roomProxy = (req, res) => {
  proxy.web(req, res, { target: ROOM_BASE_URL });
};

const roomWsProxy = createProxyMiddleware('/roomws', {
  target: ROOM_BASE_URL,
  ws: true,
});

const codingWsProxy = createProxyMiddleware('/coding', {
  target: CODING_BASE_URL,
  ws: true,
});

module.exports = {
  authProxy,
  historyProxy,
  pairingWsProxy,
  roomWsProxy,
  videoProxy,
  codeExecutorProxy,
  roomProxy,
  codingWsProxy,
  AUTH_BASE_URL,
};
