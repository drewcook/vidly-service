const express = require('express');
const router = express.Router();

// Pug templating
router.get('/', (req, res) => {
  // This will look at our pug views and serve up index.js using the provided variables
  res.render('index', {
    title: 'My Express App',
    message: 'The Home Page'
  })
});

module.exports = router;