const { validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');
const { sendBookingEmail } = require('../utils/sendEmail');

async function createBooking(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { roomId, userId, checkIn, checkOut, guests, notes, email, contactNumber } = req.body;
    const db = getDb();

    if (!ObjectId.isValid(roomId) || !ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid room or user ID.' });
    }

    const roomObjectId = new ObjectId(roomId);
    const userObjectId = new ObjectId(userId);
    const room = await db.collection('rooms').findOne({ _id: roomObjectId });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    if (!room.isAvailable) {
      return res.status(400).json({ success: false, message: 'Room is not available right now.' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid booking dates supplied.' });
    }

    checkInDate.setHours(0, 0, 0, 0);
    checkOutDate.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    if (checkOutDate.getTime() < checkInDate.getTime() + msPerDay) {
      return res.status(400).json({ success: false, message: 'Check-out must be at least 1 day after check-in.' });
    }

    if (Number(guests) > Number(room.capacity || 0)) {
      return res.status(400).json({
        success: false,
        message: `This room can host up to ${room.capacity} guest${room.capacity > 1 ? 's' : ''}.`,
      });
    }

    const user = await db.collection('users').findOne({ _id: userObjectId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const normalizedEmail = (email || user.email || '').trim().toLowerCase();
    const totalNights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / msPerDay);
    const totalPrice = totalNights * Number(room.price || 0) * 85;

    const booking = {
      roomId: roomObjectId,
      userId: userObjectId,
      date: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      email: normalizedEmail,
      contactNumber: (contactNumber || '').trim(),
      guests: Number(guests),
      notes: (notes || '').trim(),
      status: 'Confirmed',
      createdAt: new Date(),
    };

    const result = await db.collection('bookings').insertOne(booking);
    booking._id = result.insertedId;

    await db.collection('rooms').updateOne(
      { _id: roomObjectId },
      { $set: { isAvailable: false } }
    );

    const bookingData = {
      name: user.name || user.fullName || normalizedEmail.split('@')[0] || 'Resident',
      room: room.roomNumber || room.name || 'N/A',
      checkIn: checkInDate,
      checkOut: checkOutDate,
      price: totalPrice,
      id: booking._id.toString(),
    };

    const emailResult = normalizedEmail
      ? await sendBookingEmail(normalizedEmail, bookingData)
      : { success: false, message: 'No recipient email available for this booking.' };

    res.status(201).json({
      success: true,
      emailSent: emailResult.success,
      message: emailResult.success
        ? 'Room booked successfully! Confirmation email sent.'
        : 'Room booked successfully, but the confirmation email could not be sent right now.',
      booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    next(error);
  }
}

async function getBookings(req, res, next) {
  try {
    const db = getDb();
    const data = await db.collection('bookings').aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'roomInfo',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
    ]).toArray();

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    next(error);
  }
}

async function getUserBookings(req, res, next) {
  try {
    const { userId } = req.params;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const db = getDb();

    const bookings = await db.collection('bookings').aggregate([
      { $match: { userId: new ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'roomInfo',
        },
      },
    ]).toArray();

    const mapped = bookings.map((booking) => ({
      ...booking,
      roomId: booking.roomInfo && booking.roomInfo.length > 0 ? booking.roomInfo[0] : null,
    }));

    res.json({ success: true, data: mapped });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    next(error);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { bookingId } = req.params;

    if (!ObjectId.isValid(bookingId)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID' });
    }

    const db = getDb();
    const booking = await db.collection('bookings').findOne({ _id: new ObjectId(bookingId) });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    await db.collection('bookings').deleteOne({ _id: new ObjectId(bookingId) });
    await db.collection('rooms').updateOne({ _id: booking.roomId }, { $set: { isAvailable: true } });

    res.json({ success: true, message: 'Booking cancelled successfully.' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    next(error);
  }
}

module.exports = {
  createBooking,
  getBookings,
  getUserBookings,
  cancelBooking,
};
