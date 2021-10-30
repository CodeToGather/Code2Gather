const express = require('express');
const helmet = require('helmet');
const { createServer } = require('http');
const morgan = require('morgan');
const { Server: SocketServer } = require('socket.io');

const routes = require('./routes');
const setUpIo = require('./socketService');

const cors = require('cors');

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? /.*placeholder\.placeholder\.app.*/
      : '*',
};

class ApiServer {
  server = null;
  io = null;

  async initialize(port = 3001) {
    const app = express();
    app.use(express.json({ limit: '20mb' }));
    app.use(express.urlencoded({ extended: true, limit: '20mb' }));
    app.use(cors(corsOptions));
    app.use(helmet());
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Express server has started on port ${port}.`);
      app.use(morgan('dev'));
    }
    app.use(routes);

    const server = createServer(app);
    server.timeout = 1200000;
    const io = new SocketServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      allowEIO3: true,
      maxHttpBufferSize: 1e8,
      pingTimeout: 60000,
    });
    server.listen(port);
    setUpIo(io);

    this.server = server;
    this.io = io;
  }

  async close() {
    console.log('\nShutting down...');
    this.server?.close();
    this.io?.close();
  }
}

module.exports = { ApiServer };
