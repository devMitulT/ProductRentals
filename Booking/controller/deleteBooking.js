const Booking = require('../models/bookingModel');

const deleteBooking = async (req, res) => {
  try {
    const booking_id = req.params.bid;

    const deletedBooking = await Booking.findOneAndUpdate(
      { _id: booking_id },
      { isDeleted: true }
    );

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

module.exports = { deleteBooking };
