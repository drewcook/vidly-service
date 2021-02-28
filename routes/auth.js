const { User } = require('../models/User');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const validate = (request) => {
  const schema = Joi.object({
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(5).max(255),
  });

  return schema.validate(request);
};

router.post('/', async (req, res) => {
  // Check agasint Joi validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user exists, return vague message to client
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  // Use bcrypt to check if password matches
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  // Genereate the JWT and store user's ID and return it to client
  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;