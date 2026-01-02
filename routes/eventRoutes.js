const express = require('express');
const router = express.Router();
const {
  createEventHandler,
  getAllEventsHandler,
  getAvailabilityHandler,
  getSeatDetailsHandler,
  purchaseTicketsHandler,
  getBookingByIdHandler
} = require('../controllers/eventController');

// Event routes
router.post('/', createEventHandler);
router.get('/', getAllEventsHandler);

// Booking routes
router.get('/bookings/:id', getBookingByIdHandler);

// Event-specific routes
router.get('/:id/availability', getAvailabilityHandler);
router.get('/:id/seats', getSeatDetailsHandler);
router.post('/:id/purchase', purchaseTicketsHandler);

module.exports = router;
