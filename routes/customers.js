const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();

const validateCustomer = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    phone: Joi.string().min(10).max(10).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
};

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

const notFoundMsg = 'The customer with the given ID was not found.';

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort({ name: 1 });
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send(notFoundMsg);

  res.send(customer);
});

router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details);

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  try {
    const result = await customer.save();
    res.send(result)
  }
  catch (ex) {
    res.status(500).send(ex.errors);
  }
});

router.put('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details);

  const updated = await Customer.findByIdAndUpdate(req.params.id, {
    $set: {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
  }, { new: true });

  if (!updated) return res.status(404).send(notFoundMsg);

  res.send(updated);
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send(notFoundMsg);

  res.send(customer);
});

module.exports = router;