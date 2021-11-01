/**
 * Entry point for express server app.
 */
import { ApiServer } from './server';

const apiServer = new ApiServer();
apiServer.initialize();

export default apiServer;
