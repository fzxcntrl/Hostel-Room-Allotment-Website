const { validationResult } = require('express-validator');
const prisma = require('../prismaClient');

async function createBooking(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { roomId, userId, checkIn, checkOut, guests, notes } = req.body;

    const [room, user] = await Promise.all([
      prisma.room.findUnique({ where: { id: roomId } }),
      prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    if (room.status !== 'Available') {
      return res.status(400).json({ message: 'Room is not available right now.' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      return res.status(400).json({ message: 'Check-out must be after check-in.' });
    }

    if (guests > room.capacity) {
      return res.status(400).json({ message: 'Guest count exceeds room capacity.' });
    }

    const booking = await prisma.booking.create({
      data: {
        roomId,
        userId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests,
        notes,
        status: 'Confirmed',
      },
    });

    await prisma.room.update({
      where: { id: roomId },
      data: { status: 'Booked' },
    });

    res.status(201).json({
      message: 'Room booked successfully!',
      booking,
    });
  } catch (error) {
    next(error);
  }
}

async function getBookings(req, res, next) {
  try {
    const data = await prisma.booking.findMany({
      include: {
        room: { select: { name: true, type: true } },
        user: { select: { fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getUserBookings(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userId } = req.params;
    const bookings = await prisma.booking.findMany({
      where: { userId: Number(userId) },
      include: { room: { select: { name: true, type: true, photoUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { bookingId } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
      include: { room: true },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled.' });
    }

    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'Cancelled' },
    });

    if (booking.room) {
      await prisma.room.update({
        where: { id: booking.roomId },
        data: { status: 'Available' },
      });
    }

    res.json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBooking,
  getBookings,
  getUserBookings,
  cancelBooking,
};
