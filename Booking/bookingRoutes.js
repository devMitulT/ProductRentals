const express = require('express');
const { getBookingDetails } = require('./controller/getBookingDetails');
const {
  bookProductForGivenRangeOfDays,
} = require('./controller/bookProductForRangeOfDays');
const { updateBooking } = require('./controller/updateBookingDetails');
const { deleteBooking } = require('./controller/deleteBooking');

const router = express.Router();

router.get('/product-bookings', getBookingDetails);
router.post('/bookings', bookProductForGivenRangeOfDays);
router.put('/update-booking/:bid', updateBooking);
router.delete('/delete-booking/:bid', deleteBooking);
module.exports = { bookingRouter: router };
