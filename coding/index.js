const { ApiServer } = require('./server');

const apiServer = new ApiServer();
apiServer.initialize();

module.exports = apiServer;
