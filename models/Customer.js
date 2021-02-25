const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  phone: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 10,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
});

const Customer = mongoose.model('Customer', customerSchema);

const validateCustomer = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    phone: Joi.string().min(10).max(10).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
};

 module.exports = {
   Customer,
   validate: validateCustomer,
 };
