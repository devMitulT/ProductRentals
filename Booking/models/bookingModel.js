const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    product_id: {
      type: Number,
      required: true,
      description: 'The ID of the product being booked',
    },
    booking_name: {
      type: String,
      required: true,
      description: 'The Name of the user making the booking',
    },
    notes: {
      type: String,
      description: 'Booking Description ',
    },
    start_date: {
      type: Date,
      required: true,
      description: 'The start date of the booking',
    },
    end_date: {
      type: Date,
      required: true,
      description: 'The end date of the booking',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
