const mongoose = require('mongoose');
const { logger } = require('../startup/logging');

const DB_CONNECTION_STRING = 'mongodb://localhost/vidly';

const setupDb = () => {
  // Connect to the local mongoDB instance
  mongoose.connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
    .then(() => logger.info('Connected to MongoDB...'));
};

module.exports = setupDb;
