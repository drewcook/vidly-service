const Joi = require('Joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(50),
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(5).max(255),
  });

  return schema.validate(user);
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 255,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
  },
});

userSchema.methods.generateAuthToken = function() {
  // set the auth in the response header so we can use it in the client
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  validate: validateUser,
};
