const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {
  bookProductForGivenRangeOfDays,
  getBookingDetails,
  updateBooking,
  deleteBooking,
} = require('./controller/bookingController.js');

const app = express();

app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOURL, {});
    console.log(`MongoDb Connect : ${conn.connection.host}`);
    return conn;
  } catch (e) {
    console.error('Error connecting to MongoDB', e.message);
    process.exit(1);
  }
};
const db = connectDB();

app.get('/api/product-bookings', getBookingDetails);
app.post('/api/bookings', bookProductForGivenRangeOfDays);
app.put('/api/update-booking/:bid', updateBooking);
app.delete('/api/delete-booking/:bid', deleteBooking);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
