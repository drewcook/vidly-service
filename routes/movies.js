const express = require('express');
const Joi = require('joi');

// Setup the router
const router = express.Router();

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
router.get('/', (req, res) => {
  res.send(movies);
});

// Get single movie
router.get('/:id', (req, res) => {
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send(notFoundMsg);

  res.send(movie);
});

// Create movie
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send(notFoundMsg);

  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  movie.title = req.body.title;
  movie.genre = req.body.genre;

  res.send(movie);
});

// Delete movie
router.delete('/:id', (req, res) => {
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send(notFoundMsg);

  const index = movies.indexOf(movie);
  movies.splice(index, 1);

  res.send(movie);
});

module.exports = router;