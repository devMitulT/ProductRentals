const Booking = require('../models/bookingModel');

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

module.exports = { bookProductForGivenRangeOfDays };
