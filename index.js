// Create server
const express = require('express');
const app = express();

// Setup the config
require('./startup/config')();

// Setup the DB
require('./startup/database')();

// Setup the logger
const { setupLogging, logger } = require('./startup/logging');
setupLogging(app);

// Setup the routes
require('./startup/routes')(app);

// Setup Joi validation for API
require('./startup/apiValidation')();

// **** THIS ISN'T NECESSARY FOR API BACKENDS ONLY, but...
// Set the templating engine to the pug package
app.set('view engine', 'pug');
// this is default so doens't need to explicitly be set, but for demo purposes...
app.set('views', './views');

// Listen on server port for requests
const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));

throw new Error('woah bro');
