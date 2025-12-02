require('dotenv').config();
const express = require('express');
const cors = require('cors');

const seedDatabase = require('./utils/seedDatabase');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const insightRoutes = require('./routes/insightRoutes');
const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hostel allotment API is running.' });
});

app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/insights', insightRoutes);

app.use(errorHandler);

async function start() {
  try {
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

start();
