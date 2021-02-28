const Joi = require('joi');
const mongoose = require('mongoose');

const validateRental = (rental) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental);
};

const Rental = mongoose.model('Rental', new mongoose.Schema({
  // We may not want to use customerSchema and/or movieSchema
  // It could have 40 properties, so we create our own shema here.
  // We will populate this customer from customer data when POSTing.
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
}));

module.exports = {
  Rental,
  validate: validateRental,
};
