const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { Rental } = require('../models/Rental');
const { Movie } = require('../models/Movie');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { differenceInDays } = require('date-fns');

const validateReturn = (req) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
};

// Create a return
router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const { customerId, movieId } = req.body;
  const rental = await Rental.lookup({ customerId, movieId });
  if (!rental) return res.status(404).send('Rental not found');

  if (rental.dateReturned) return res.status(400).send('Return already processed');

  // set return date
  rental.dateReturned = new Date();
  // calculate rental fee
  // charge minimum 1 day if within 24 hours
  const rentalDays = differenceInDays(rental.dateReturned, rental.dateOut);
  rental.rentalFee = rentalDays < 1 ? rental.movie.dailyRentalRate : rental.movie.dailyRentalRate * rentalDays;
  await rental.save();

  // increase movie stock
  await Movie.updateOne({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1 }
  });

  return res.status(200).send(rental);
});

module.exports = router;
