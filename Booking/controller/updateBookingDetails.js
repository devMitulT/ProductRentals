const Booking = require('../models/bookingModel');

const updateBooking = async (req, res) => {
  try {
    const booking_id = req.params.bid;
    const { booking_name, start_date, end_date, notes } = req.body;

    const booking = await Booking.findById({
      _id: booking_id,
      isDeleted: false,
    });
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
      isDeleted: false,
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
      { _id: booking_id, isDeleted: false },
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

module.exports = { updateBooking };
