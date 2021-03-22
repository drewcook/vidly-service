const express = require('express');
const router = express.Router();
const { Rental } = require('../models/Rental');
const { Movie } = require('../models/Movie');
const auth = require('../middleware/auth');
const { differenceInDays } = require('date-fns');

// Create a return
router.post('/', auth, async (req, res) => {
  const { customerId, movieId } = req.body;
  if (!customerId) return res.status(400).send('customerId not provided');
  if (!movieId) return res.status(400).send('movieId not provided');

  const rental = await Rental.findOne({
    'customer._id': customerId,
    'movie._id': movieId,
  });
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
