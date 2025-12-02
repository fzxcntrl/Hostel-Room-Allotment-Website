const prisma = require('../prismaClient');

async function getOverview(req, res, next) {
  try {
    const [rooms, availableRooms, bookings, confirmedBookings, cancelledBookings, users] = await Promise.all([
      prisma.room.count(),
      prisma.room.count({ where: { status: 'Available' } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'Confirmed' } }),
      prisma.booking.count({ where: { status: 'Cancelled' } }),
      prisma.user.count(),
    ]);

    const occupancyRate = rooms === 0 ? 0 : Math.round(((rooms - availableRooms) / rooms) * 100);

    res.json({
      totals: {
        rooms,
        availableRooms,
        bookings,
        confirmedBookings,
        cancelledBookings,
        users,
      },
      occupancyRate,
    });
  } catch (error) {
    next(error);
  }
}

async function getRecentBookings(req, res, next) {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const data = await prisma.booking.findMany({
      where: { createdAt: { gte: lastWeek } },
      include: {
        room: { select: { name: true, type: true } },
        user: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOverview,
  getRecentBookings,
};
