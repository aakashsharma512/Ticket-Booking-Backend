// Events Messages
const EVENT_CREATE_SUCCESS = 'Event created successfully';
const EVENT_CREATE_ERROR = 'Failed to create event';
const EVENT_LIST_SUCCESS = 'Events list retrieved successfully';
const EVENT_LIST_ERROR = 'Failed to fetch events';
const EVENT_NOT_FOUND = 'Event not found';
const EVENT_INVALID_DATA = 'Invalid event data';

// Availability Messages
const AVAILABILITY_SUCCESS = 'Seat availability retrieved successfully';
const AVAILABILITY_ERROR = 'Failed to fetch availability';
const AVAILABILITY_NOT_FOUND = 'Event not found';

// Seats Messages
const SEATS_SUCCESS = 'Seat details retrieved successfully';
const SEATS_ERROR = 'Failed to fetch seat details';
const SEATS_NOT_FOUND = 'Event, section or row not found';
const SEATS_MISSING_PARAMS = 'Section and row are required';

// Booking Messages
const BOOKING_PURCHASE_SUCCESS = 'Tickets purchased successfully';
const BOOKING_PURCHASE_ERROR = 'Failed to process booking';
const BOOKING_INVALID_DATA = 'Invalid booking data';
const BOOKING_NOT_ENOUGH_SEATS = 'Not enough seats available';
const BOOKING_INVALID_SECTION_ROW = 'Invalid section or row';
const BOOKING_GET_SUCCESS = 'Booking details retrieved successfully';
const BOOKING_GET_ERROR = 'Failed to fetch booking';
const BOOKING_NOT_FOUND = 'Booking not found';

// Admin Messages
const ADMIN_BOOKINGS_SUCCESS = 'Bookings list retrieved successfully';
const ADMIN_BOOKINGS_ERROR = 'Failed to fetch bookings';
const ADMIN_STATS_SUCCESS = 'Admin statistics retrieved successfully';
const ADMIN_STATS_ERROR = 'Failed to fetch stats';

module.exports = {
  EVENT_CREATE_SUCCESS,
  EVENT_CREATE_ERROR,
  EVENT_LIST_SUCCESS,
  EVENT_LIST_ERROR,
  EVENT_NOT_FOUND,
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
  BOOKING_NOT_FOUND,
  ADMIN_BOOKINGS_SUCCESS,
  ADMIN_BOOKINGS_ERROR,
  ADMIN_STATS_SUCCESS,
  ADMIN_STATS_ERROR
};
