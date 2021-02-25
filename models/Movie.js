const Joi = require('joi');
const mongoose = require('mongoose');

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
    minLength: 5,
    maxLength: 50,
  },
  genre: {
    type: String,
    required: true,
    enum: ['action', 'adventure', 'comedy', 'drama', 'documentary', 'horror', 'thriller']
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = {
  Movie,
  validate: validateMovie,
};
