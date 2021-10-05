const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();

// TODO: change to actual service base url
const PAIRING_BASE_URL = 'http://localhost:3001/pairing';
const ROOM_BASE_URL = 'http://localhost:3002/room';
const HISTORY_BASE_URL = 'http://localhost:3003/history';

const pairingProxy = (req, res) => {
  proxy.web(req, res, { target: PAIRING_BASE_URL });
};

const roomProxy = (req, res) => {
  proxy.web(req, res, { target: ROOM_BASE_URL });
};

const historyProxy = (req, res) => {
  proxy.web(req, res, { target: HISTORY_BASE_URL });
};

module.exports = { pairingProxy, roomProxy, historyProxy };
