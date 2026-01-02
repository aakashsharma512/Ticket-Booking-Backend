const { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  getAvailability, 
  getSeatDetails,
  bookSeats,
  getBookingById
} = require('../models/dataStore');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const {
  EVENT_CREATE_SUCCESS,
  EVENT_CREATE_ERROR,
  EVENT_LIST_SUCCESS,
  EVENT_LIST_ERROR,
  EVENT_INVALID_DATA,
  AVAILABILITY_SUCCESS,
  AVAILABILITY_ERROR,
  AVAILABILITY_NOT_FOUND,
  SEATS_SUCCESS,
  SEATS_ERROR,
  SEATS_NOT_FOUND,
  SEATS_MISSING_PARAMS,
  BOOKING_PURCHASE_SUCCESS,
  BOOKING_PURCHASE_ERROR,
  BOOKING_INVALID_DATA,
  BOOKING_NOT_ENOUGH_SEATS,
  BOOKING_INVALID_SECTION_ROW,
  BOOKING_GET_SUCCESS,
  BOOKING_GET_ERROR,
  BOOKING_NOT_FOUND
} = require('../utils/messages');

async function createEventHandler(req, res) {
  try {
    const { name, date, sections } = req.body;

    if (!name || !date || !sections || !Array.isArray(sections)) {
      return sendError(res, EVENT_INVALID_DATA, 400);
    }

    const event = await createEvent(name, date, sections);
    return sendSuccess(res, EVENT_CREATE_SUCCESS, event, 201);
  } catch (error) {
    return sendError(res, EVENT_CREATE_ERROR, 500);
  }
}

async function getAllEventsHandler(req, res) {
  try {
    const events = await getAllEvents();
    const eventList = events.map(event => ({
      id: event.id,
      name: event.name,
      date: event.date
    }));
    return sendSuccess(res, EVENT_LIST_SUCCESS, eventList);
  } catch (error) {
    return sendError(res, EVENT_LIST_ERROR, 500);
  }
}

async function getAvailabilityHandler(req, res) {
  try {
    const eventId = req.params.id;
    const availability = await getAvailability(eventId);

    if (!availability) {
      return sendError(res, AVAILABILITY_NOT_FOUND, 404);
    }

    return sendSuccess(res, AVAILABILITY_SUCCESS, availability);
  } catch (error) {
    return sendError(res, AVAILABILITY_ERROR, 500);
  }
}

async function getSeatDetailsHandler(req, res) {
  try {
    const eventId = req.params.id;
    const { section, row } = req.query;

    if (!section || !row) {
      return sendError(res, SEATS_MISSING_PARAMS, 400);
    }

    const seatDetails = await getSeatDetails(eventId, section, row);

    if (!seatDetails) {
      return sendError(res, SEATS_NOT_FOUND, 404);
    }

    return sendSuccess(res, SEATS_SUCCESS, seatDetails);
  } catch (error) {
    return sendError(res, SEATS_ERROR, 500);
  }
}

async function purchaseTicketsHandler(req, res) {
  try {
    const eventId = req.params.id;
    const { section, row, quantity } = req.body;

    if (!section || !row || !quantity || quantity <= 0) {
      return sendError(res, BOOKING_INVALID_DATA, 400);
    }

    const result = await bookSeats(eventId, section, row, quantity);

    if (!result.success) {
      if (result.error === 'Not enough seats available') {
        return sendError(res, BOOKING_NOT_ENOUGH_SEATS, 400);
      }
      if (result.error === 'Invalid section or row') {
        return sendError(res, BOOKING_INVALID_SECTION_ROW, 400);
      }
      return sendError(res, result.error || BOOKING_PURCHASE_ERROR, 400);
    }

    const { booking } = result;
    const bookingData = {
      bookingId: booking.id,
      eventId: eventId,
      section,
      row,
      quantity,
      groupDiscount: booking.groupDiscount
    };

    return sendSuccess(res, BOOKING_PURCHASE_SUCCESS, bookingData, 201);
  } catch (error) {
    return sendError(res, BOOKING_PURCHASE_ERROR, 500);
  }
}

async function getBookingByIdHandler(req, res) {
  try {
    const bookingId = req.params.id;
    const booking = await getBookingById(bookingId);
    
    if (!booking) {
      return sendError(res, BOOKING_NOT_FOUND, 404);
    }

    return sendSuccess(res, BOOKING_GET_SUCCESS, booking);
  } catch (error) {
    return sendError(res, BOOKING_GET_ERROR, 500);
  }
}

module.exports = {
  createEventHandler,
  getAllEventsHandler,
  getAvailabilityHandler,
  getSeatDetailsHandler,
  purchaseTicketsHandler,
  getBookingByIdHandler
};
