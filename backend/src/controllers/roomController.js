const prisma = require('../prismaClient');

async function getAllRooms(req, res, next) {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { pricePerNight: 'asc' },
    });
    res.json(rooms);
  } catch (error) {
    next(error);
  }
}

async function getAvailableRooms(req, res, next) {
  try {
    const rooms = await prisma.room.findMany({
      where: { status: 'Available' },
      orderBy: { capacity: 'asc' },
    });
    res.json(rooms);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllRooms,
  getAvailableRooms,
};
