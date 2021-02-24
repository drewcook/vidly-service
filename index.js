const debug = require('debug')('vidly:startup');
const config = require('config');
const express = require('express');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger');
const authentication = require('./authenticate');

// Create server
const app = express();
const isDevelopment = app.get('env') === 'development';

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

// Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

if (isDevelopment) {
  app.use(morgan('tiny')); // a logging middleware
  debug('Morgan enabled...');
}

// Custom middleware functions, called in sequence
// always define in separate file from index.js
app.use(logger);
app.use(authentication);

// helpers
const validateMovie = (movie) => {
  const schema = Joi.object({
    genre: Joi.string().required(),
    title: Joi.string().min(1).required(),
  });

  return schema.validate(movie);
};

const movies = [
  {
    id: 1,
    title: 'Forrest Gump',
    genre: 'drama',
  },
  {
    id: 2,
    title: 'The Hurt Locker',
    genre: 'action',
  },
  {
    id: 3,
    title: 'Finding Nemo',
    genre: 'family',
  },
  {
    id: 4,
    title: 'Saving Private Ryan',
    genre: 'action',
  },
];

const notFoundMsg = 'The movie with the given ID was not found.';

// Get all movies
app.get('/api/movies', (req, res) => {
  res.send(movies);
});

// Get single movie
app.get('/api/movies/:id', (req, res) => {
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send(notFoundMsg);

  res.send(movie);
});

// Create movie
app.post('/api/movies', (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = {
    id: movies.length + 1,
    ...req.body,
  };

  movies.push(movie);

  res.send(movie);
});

// Update movie
app.put('/api/movies/:id', (req, res) => {
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send(notFoundMsg);

  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  movie.title = req.body.title;
  movie.genre = req.body.genre;

  res.send(movie);
});

// Delete movie
app.delete('/api/movies/:id', (req, res) => {
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send(notFoundMsg);

  const index = movies.indexOf(movie);
  movies.splice(index, 1);

  res.send(movie);
});

// Listen on server port for requests
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
