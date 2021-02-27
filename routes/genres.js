const auth = require('../middleware/auth');
const { Genre, validate } = require('../models/Genre');
const express = require('express');
const router = express.Router();

const notFoundMsg = 'The genre with the given ID was not found.';

// Get all genres
router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    return res.send(genres);
  }
  catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    return res.status(500).send(ex.errors);
  }
});

// Get single genre
router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send(notFoundMsg);

  res.send(genre);
});

// Create genre
// authenticated endpoint
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name,
  });

  try {
    const result = await genre.save();
    return res.send(result);
  }
  catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    return res.status(500).send(ex.errors);
  }
});

// Update genre
router.put('/:id', auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name } = req.body;
    const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, {
      $set: { name },
    }, { new: true });

    if (!updatedGenre) return res.status(404).send(notFoundMsg);

    res.send(updatedGenre);
  }
  catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    return res.status(500).send(ex.errors);
  }
});

// Delete genre
router.delete('/:id', auth, async (req, res) => {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send(notFoundMsg);

    res.send(genre);
  }
  catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    return res.status(500).send(ex.errors);
  }
});

module.exports = router;