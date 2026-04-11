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

    const room = await db.collection('rooms').findOne({ _id: new ObjectId(roomId) });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    if (!room.isAvailable) {
      return res.status(400).json({ success: false, message: 'Room is not available right now.' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    checkInDate.setHours(0, 0, 0, 0);
    checkOutDate.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    if (checkOutDate.getTime() < checkInDate.getTime() + msPerDay) {
      return res.status(400).json({ success: false, message: 'Check-out must be at least 1 day after check-in.' });
    }

    const booking = {
      roomId: new ObjectId(roomId),
      userId: new ObjectId(userId),
      date: new Date(checkIn),
      checkOutDate: new Date(checkOut),
      email: email || '',
      contactNumber: contactNumber || '',
      status: 'Confirmed',
      createdAt: new Date(),
    };
    
    const result = await db.collection('bookings').insertOne(booking);
    booking._id = result.insertedId;

    await db.collection('rooms').updateOne(
      { _id: new ObjectId(roomId) },
      { $set: { isAvailable: false } }
    );

    const bookingData = {
      name: 'Resident',
      room: room.name || `Room ${room.roomNumber}`,
      checkIn: checkInDate.toLocaleDateString(),
      checkOut: checkOutDate.toLocaleDateString(),
      price: (room.price * 85).toString(),
      id: booking._id.toString()
    };
    
    // Fetch user details for the email formatting
    const userObj = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if(userObj) {
      bookingData.name = userObj.name || userObj.email.split('@')[0];
    }
    const userEmail = email || userObj?.email;

    if (userEmail) {
      await sendBookingEmail(userEmail, bookingData);
    }

    res.status(201).json({
      success: true,
      message: 'Room booked successfully! Confirmation email sent.',
      booking,
    });
  } catch (error) {
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
          as: 'roomInfo'
        }
      },
      {
         $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      }
    ]).toArray();
    
    res.json({ success: true, data });
  } catch (error) {
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
           as: 'roomInfo'
        }
      }
    ]).toArray();

    // Map it to match what the frontend expects 
    const mapped = bookings.map(b => ({
      ...b,
      roomId: b.roomInfo && b.roomInfo.length > 0 ? b.roomInfo[0] : null
    }));

    res.json({ success: true, data: mapped });
  } catch (error) {
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
        return res.status(400).json({ success: false, message: 'Invalid booking ID' })
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
    next(error);
  }
}

module.exports = {
  createBooking,
  getBookings,
  getUserBookings,
  cancelBooking,
};
