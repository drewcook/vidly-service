const config = require('config');

const setupConfig = () => {
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.')
  };
};

module.exports = setupConfig;
