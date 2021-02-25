const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');

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

// Schema
const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  genre: {
    type: String,
    required: true,
    enum: ['action', 'adventure', 'comedy', 'drama', 'documentary', 'horror', 'thriller']
  },
});
const Movie = mongoose.model('Movie', movieSchema);

const notFoundMsg = 'The movie with the given ID was not found.';

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ name: 1 });
    return res.send(movies);
  }
  catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    return res.status(500).send(ex.errors);
  }
});

// Get single movie
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).send(notFoundMsg);

    return res.send(movie);
  }
  catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    return res.status(500).send(ex.errors);
  }
});

// Create movie
router.post('/', async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = new Movie({
    ...req.body,
  });

  try {
    const result = await movie.save();
    return res.send(result);
  }
  catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    return res.status(500).send(ex.errors);
  }
});

// Update movie
router.put('/:id', async (req, res) => {
  try {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { title, genre } = req.body;
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {
      $set: { title, genre },
    }, { new: true });

    return res.send(updatedMovie);
  }
  catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    return res.status(500).send(ex.errors);
  }
});

// Delete movie
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send(notFoundMsg);
    return res.send(movie);
  }
  catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    return res.status(500).send(ex.errors);
  }
});

module.exports = router;