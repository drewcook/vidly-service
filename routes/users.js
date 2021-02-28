const auth = require('../middleware/auth');
const { User, validate } = require('../models/User');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.find().sort('name');
  res.send(users);
});

// Get the current user
// we protect this by having a custom endpoint that uses the JWT to get the user payload
router.get('/me', auth, async (req, res) => {
  // rememver, we set req.user from our auth middleware
  // we will only hit this route handler if the middleware succeeds
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

// Create a new user
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  try {
    // Set the user, then assign it a hashed password before saving
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    await user.save();

    const token = user.generateAuthToken();
    // Use prefix 'x-' for any custom headers we set within an application
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
  }
  catch (ex) {
    res.status(500).send(ex.errors);
  }
});

module.exports = router;