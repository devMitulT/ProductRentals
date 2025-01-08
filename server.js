const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { bookingRouter } = require('./Booking/bookingRoutes');
const { connectDB } = require('./ConnectDataBase.js');

const app = express();

app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

dotenv.config();

const db = connectDB();

app.use('/api/booking', bookingRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
