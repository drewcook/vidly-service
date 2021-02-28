const mongoose = require('mongoose');
const { logger } = require('../startup/logging');

const setupDb = () => {
  // Connect to the local mongoDB instance
  mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
    .then(() => logger.info('Connected to MongoDB...'));
};

module.exports = setupDb;
