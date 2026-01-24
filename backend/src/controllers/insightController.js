const { getDb } = require('../config/db');

async function getOverview(req, res, next) {
  try {
    const db = getDb();
    const [rooms, availableRooms, bookings, users] = await Promise.all([
      db.collection('rooms').countDocuments(),
      db.collection('rooms').countDocuments({ isAvailable: true }),
      db.collection('bookings').countDocuments(),
      db.collection('users').countDocuments(),
    ]);

    const occupancyRate = rooms === 0 ? 0 : Math.round(((rooms - availableRooms) / rooms) * 100);

    res.json({
      success: true,
      data: {
        totals: {
          rooms,
          availableRooms,
          bookings,
          users,
        },
        occupancyRate,
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getRecentBookings(req, res, next) {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const db = getDb();
    const data = await db.collection('bookings').aggregate([
      { $match: { createdAt: { $gte: lastWeek } } },
      { $sort: { createdAt: -1 } }
    ]).toArray();

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOverview,
  getRecentBookings,
};
