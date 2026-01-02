const express = require('express');
const router = express.Router();
const {
  getAllBookingsHandler,
  getAdminStatsHandler
} = require('../controllers/adminController');

// Admin routes
router.get('/bookings', getAllBookingsHandler);
router.get('/stats', getAdminStatsHandler);

module.exports = router;
