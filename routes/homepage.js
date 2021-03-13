const express = require('express');
const router = express.Router();

// Pug templating
router.get('/', (req, res) => {
  // This will look at our pug views and serve up index.js using the provided variables
  res.render('index', {
    title: 'The Vidly App',
    message: 'Vidly Service API'
  });
});

router.get('/dogs', (req, res) => {
  res.render('dogs', {
    title: 'The Vidly App - Dogs',
    message: 'Welcome to the dogs page.'
  });
});

module.exports = router;