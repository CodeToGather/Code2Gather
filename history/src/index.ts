/**
 * Entry point for express server app.
 */
import dotenv from 'dotenv';

import { ApiServer } from './server';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const apiServer = new ApiServer();
apiServer.initialize();

export default apiServer;
