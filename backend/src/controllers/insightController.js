const { getDb } = require('../config/db');

async function getOverview(req, res, next) {
  try {
    const db = getDb();
    const roomsCollection = db.collection('rooms');
    const allRooms = await roomsCollection.find().toArray();
    const roomsCount = allRooms.length;
    const availableRoomsCount = allRooms.filter(r => r.isAvailable).length;
    
    // Dynamic Total beds = sum of capacities
    const totalBeds = allRooms.reduce((sum, r) => sum + (r.capacity || 1), 0);

    const [bookings, users] = await Promise.all([
      db.collection('bookings').countDocuments(),
      db.collection('users').countDocuments(),
    ]);

    const occupancyRate = roomsCount === 0 ? 0 : Math.round(((roomsCount - availableRoomsCount) / roomsCount) * 100);

    res.json({
      success: true,
      data: {
        totals: {
          rooms: totalBeds, // Serve total beds to frontend as "rooms" field or frontend handles it
          availableRooms: availableRoomsCount, // Serve open rooms
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
