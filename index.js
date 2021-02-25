const debug = require('debug')('vidly:startup');
const config = require('config');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const homepage = require('./routes/homepage');
const movies = require('./routes/movies');
const mongoose = require('mongoose');

// Connect to the local mongoDB instance
mongoose.connect('mongodb://localhost/vidly', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Create server
const app = express();
const isDevelopment = app.get('env') === 'development';

// **** THIS ISN'T NECESSARY FOR API BACKENDS ONLY, but...
// Set the templating engine to the pug package
app.set('view engine', 'pug');
// this is default so doens't need to explicitly be set, but for demo purposes...
app.set('views', './views');

// Middleware

// Built-in Express middleware
app.use(express.json()); // parses req.body
// key=value&key=value, parses this and populates req.body in json
app.use(express.urlencoded({ extended: true }));
// uses a static folder for assets, and provides a route to view the assets
// for example http://localhost:3000/public/readme.txt
app.use(express.static('public'));

// 3rd Party Middleware
app.use(helmet());  // sets headers for requests

// Use routes
app.use('/', homepage);
app.use('/api/movies', movies);

// Configuration
debug(config)
debug('Application Name: ' + config.get('name'));
debug('Mail Server: ' + config.get('mail.host'));
// debug('Mail Password: ' + config.get('mail.password'));

if (isDevelopment) {
  app.use(morgan('tiny')); // a logging middleware
  debug('Morgan enabled...');
}

// Custom middleware functions, called in sequence
// always define in separate file from index.js
app.use(logger);

// Listen on server port for requests
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
