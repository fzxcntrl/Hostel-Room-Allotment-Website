const express = require('express');
const insightController = require('../controllers/insightController');

const router = express.Router();

router.get('/overview', insightController.getOverview);
router.get('/recent-bookings', insightController.getRecentBookings);

module.exports = router;
