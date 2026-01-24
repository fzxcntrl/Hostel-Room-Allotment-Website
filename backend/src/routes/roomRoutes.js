const express = require('express');
const { getAllRooms, getAvailableRooms, addRoom, getRoomById, updateRoomAvailability } = require('../controllers/roomController');
const router = express.Router();

router.get('/', getAllRooms);
router.get('/available', getAvailableRooms);
router.get('/:id', getRoomById);
router.post('/', addRoom);
router.patch('/:id', updateRoomAvailability);

module.exports = router;
