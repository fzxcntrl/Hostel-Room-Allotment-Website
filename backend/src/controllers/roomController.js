const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');

async function getAllRooms(req, res, next) {
  try {
    const db = getDb();
    const rooms = await db.collection('rooms').find().sort({ price: 1 }).toArray();
    res.json({ success: true, data: rooms });
  } catch (error) {
    next(error);
  }
}

async function getRoomById(req, res, next) {
  try {
    const db = getDb();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid room id formats' });
    }

    const room = await db.collection('rooms').findOne({ _id: new ObjectId(id) });
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
}

async function getAvailableRooms(req, res, next) {
  try {
    const db = getDb();
    const rooms = await db.collection('rooms').find({ isAvailable: true }).sort({ price: 1 }).toArray();
    res.json({ success: true, data: rooms });
  } catch (error) {
    next(error);
  }
}

async function addRoom(req, res, next) {
  try {
    const db = getDb();
    const { roomNumber, type, price, isAvailable, description, name, capacity, amenities, photoUrl } = req.body;
    
    if (!roomNumber || !type || !price) {
      return res.status(400).json({ success: false, message: 'roomNumber, type, and price are required' });
    }

    const newRoom = {
      roomNumber,
      name: name || `Room ${roomNumber}`,
      type,
      capacity: capacity || 1,
      price: Number(price),
      isAvailable: isAvailable ?? true,
      description: description || '',
      amenities: amenities || [],
      photoUrl: photoUrl || '',
      createdAt: new Date(),
    };

    const result = await db.collection('rooms').insertOne(newRoom);
    newRoom._id = result.insertedId;
    
    res.status(201).json({ success: true, data: newRoom });
  } catch (error) {
    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Room number must be unique' });
    }
    next(error);
  }
}

async function updateRoomAvailability(req, res, next) {
  try {
     const db = getDb();
     const { id } = req.params;
     const { isAvailable } = req.body;

     if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid room id' });
     }

     if (typeof isAvailable !== 'boolean') {
        return res.status(400).json({ success: false, message: 'isAvailable must be a boolean' });
     }

     const result = await db.collection('rooms').updateOne(
        { _id: new ObjectId(id) },
        { $set: { isAvailable, updatedAt: new Date() } }
     );

     if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, message: 'Room not found' });
     }

     res.json({ success: true, message: 'Room updated successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllRooms,
  getRoomById,
  getAvailableRooms,
  addRoom,
  updateRoomAvailability
};
