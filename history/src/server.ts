import cors, { CorsOptions } from 'cors';
import express, { RequestHandler } from 'express';
import helmet from 'helmet';
import { Server } from 'http';
import morgan from 'morgan';

import routes from './routes';

export const corsOptions: CorsOptions = {
  // TODO: Fix the production URL once deployed
  origin:
    process.env.NODE_ENV === 'production'
      ? /.*placeholder\.placeholder\.app.*/
      : '*',
};

export class ApiServer {
  public server: Server | null = null;

  async initialize(port = 3001): Promise<void> {
    const app = express();

    app.use(express.json({ limit: '20mb' }) as RequestHandler);
    app.use(
      express.urlencoded({ extended: true, limit: '20mb' }) as RequestHandler
    );
    app.use(cors(corsOptions));
    app.use(helmet() as RequestHandler);

    if (process.env.NODE_ENV !== 'test') {
      app.use(morgan('dev') as RequestHandler);
    }
    app.use('/', routes);
    this.server = app.listen(port);
    this.server.timeout = 1200000;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Express server has started on port ${port}.`);
    }
  }

  async close(): Promise<void> {
    this.server && this.server.close();
  }
}

export default ApiServer;
