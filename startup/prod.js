const helmet = require('helmet');
const compression = require('compressions');

const setupProductionMiddleware = (app) => {
  // Sets headers for requests
  app.use(helmet());
  // Compresses our bundle size
  app.use(compression());
};

module.exports = setupProductionMiddleware;
