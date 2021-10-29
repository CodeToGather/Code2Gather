import cors, { CorsOptions } from 'cors';
import express, { RequestHandler } from 'express';
import helmet from 'helmet';
import { createServer, Server } from 'http';
import morgan from 'morgan';
import { Server as SocketServer } from 'socket.io';

import routes from './routes';
import setUpIo from './socket';

const corsOptions: CorsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? /.*placeholder\.placeholder\.app.*/
      : '*',
};

export class ApiServer {
  public server: Server | null = null;
  public io: SocketServer | null = null;

  async initialize(port = 8003): Promise<void> {
    const app = express();
    app.use(express.json({ limit: '20mb' }) as RequestHandler);
    app.use(
      express.urlencoded({ extended: true, limit: '20mb' }) as RequestHandler,
    );
    app.use(cors(corsOptions));
    app.use(helmet() as RequestHandler);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Express server has started on port ${port}.`);
      app.use(morgan('dev') as RequestHandler);
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
      path: '/pairing',
    });
    server.listen(port);
    setUpIo(io);

    this.server = server;
    this.io = io;
  }

  async close(): Promise<void> {
    console.log('\nShutting down...');
    this.server?.close();
    this.io?.close();
  }
}

export default ApiServer;
