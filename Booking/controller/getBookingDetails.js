const moment = require('moment');
const Booking = require('../models/bookingModel');

const getBookingDetails = async (req, res) => {
  try {
    const { product_id, month, year } = req.query;

    if (!product_id || !month || !year) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);

    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res
        .status(400)
        .json({ message: 'Invalid year or month value provided.' });
    }

    const startOfMonth = moment()
      .year(yearNum)
      .month(monthNum - 1)
      .startOf('month')
      .startOf('day')
      .toDate();

    const endOfMonth = moment(startOfMonth)
      .endOf('month')
      .endOf('day')
      .toDate();

    const bookings = await Booking.find({
      product_id,
      $or: [
        { start_date: { $gte: startOfMonth, $lte: endOfMonth } },
        { end_date: { $gte: startOfMonth, $lte: endOfMonth } },
      ],
    });

    if (bookings.length === 0) {
      return res.status(200).json({
        message:
          'There is no booking found for given product in given year and month',
        bookings,
      });
    }

    res.status(200).json({
      message: 'Bookings For given product',
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

module.exports = { getBookingDetails };
