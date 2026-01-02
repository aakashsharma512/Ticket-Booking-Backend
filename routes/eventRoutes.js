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

router.post('/', createEventHandler);
router.get('/', getAllEventsHandler);
router.get('/bookings/:id', getBookingByIdHandler);
router.get('/:id/availability', getAvailabilityHandler);
router.get('/:id/seats', getSeatDetailsHandler);
router.post('/:id/purchase', purchaseTicketsHandler);

module.exports = router;

