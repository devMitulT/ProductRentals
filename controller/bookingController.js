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

const bookProductForGivenRangeOfDays = async (req, res) => {
  try {
    const { product_id, booking_name, notes, start_date, end_date } = req.body;

    if (!product_id || !booking_name || !start_date || !end_date) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    if (start_date > end_date) {
      return res.status(400).json({
        message:
          'Please make sure the start date is earlier than the end date for your booking.',
      });
    }

    if (new Date(start_date) < new Date()) {
      return res.status(400).json({
        message:
          'Invalid dates. Please make sure the date is earlier than the current date for your booking.',
      });
    }

    const overlappingBookings = await Booking.find({
      product_id,
      $or: [
        {
          start_date: { $lte: new Date(end_date) },
          end_date: { $gte: new Date(start_date) },
        },
      ],
    });

    if (overlappingBookings.length > 0) {
      const overlappingDates = overlappingBookings.map((booking) => ({
        start_date: booking.start_date,
        end_date: booking.end_date,
      }));

      return res.status(400).json({
        message:
          'Conflict: The selected dates overlap with an existing booking.',
        overlappingDates,
      });
    }

    const booking = new Booking({
      product_id,
      booking_name,
      notes,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking successfully!',
      booking,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking_id = req.params.bid;
    const { booking_name, start_date, end_date, notes } = req.body;

    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const pid = booking.product_id;

    if (start_date > end_date) {
      return res.status(400).json({
        message:
          'Please make sure the start date is earlier than the end date for your booking.',
      });
    }

    if (new Date(start_date) < new Date()) {
      return res.status(400).json({
        message:
          'Invalid dates. Please make sure the date is earlier than the current date for your booking.',
      });
    }

    const overlappingBookings = await Booking.find({
      product_id: pid,
      _id: { $ne: booking_id },
      $or: [
        {
          start_date: { $lte: new Date(end_date) },
          end_date: { $gte: new Date(start_date) },
        },
      ],
    });

    if (overlappingBookings.length > 0) {
      const overlappingDates = overlappingBookings.map((booking) => ({
        start_date: booking.start_date,
        end_date: booking.end_date,
        booking_name: booking.booking_name,
      }));

      return res.status(400).json({
        message:
          'Conflict: The selected dates overlap with an existing booking.',
        overlappingDates,
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking_id,
      {
        booking_name,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        notes,
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Booking updated successfully',
      updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking_id = req.params.bid;

    const deletedBooking = await Booking.findOneAndDelete({ _id: booking_id });

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking Deleted', deletedBooking });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  getBookingDetails,
  bookProductForGivenRangeOfDays,
  updateBooking,
  deleteBooking,
};
