const Event = require('./Event');
const Booking = require('./Booking');

function initializeSeats(sections) {
  const seats = {};
  sections.forEach(section => {
    seats[section.name] = {};
    section.rows.forEach(row => {
      seats[section.name][row.name] = new Array(row.totalSeats).fill(false);
    });
  });
  return seats;
}

async function getAllEvents() {
  try {
    const events = await Event.find().lean();
    return events.map(event => ({
      ...event,
      id: event._id.toString()
    }));
  } catch (error) {
    throw error;
  }
}

async function getEventById(id) {
  try {
    const event = await Event.findById(id).lean();
    if (!event) return null;
    return {
      ...event,
      id: event._id.toString()
    };
  } catch (error) {
    throw error;
  }
}

async function createEvent(name, date, sections) {
  try {
    const seats = initializeSeats(sections);
    const event = new Event({
      name,
      date: new Date(date),
      sections,
      seats
    });
    await event.save();
    return {
      ...event.toObject(),
      id: event._id.toString()
    };
  } catch (error) {
    throw error;
  }
}

async function getAvailability(eventId) {
  try {
    const event = await Event.findById(eventId).lean();
    if (!event) return null;

    // Get all bookings for this event
    const bookings = await Booking.find({ eventId: eventId }).lean();

    const availability = {};
    event.sections.forEach(section => {
      availability[section.name] = {};
      section.rows.forEach(row => {
        const totalSeats = row.totalSeats;
        
        // Count booked seats for this section/row from bookings
        const sectionRowBookings = bookings.filter(
          booking => booking.section === section.name && booking.row === row.name
        );
        
        // Count booked seats (from seatNumbers if available, otherwise use quantity for old bookings)
        let bookedCount = 0;
        sectionRowBookings.forEach(booking => {
          if (booking.seatNumbers && Array.isArray(booking.seatNumbers) && booking.seatNumbers.length > 0) {
            bookedCount += booking.seatNumbers.length;
          } else {
            // Old bookings without seatNumbers - use quantity
            bookedCount += booking.quantity || 0;
          }
        });
        
        availability[section.name][row.name] = {
          available: totalSeats - bookedCount,
          total: totalSeats,
          booked: bookedCount
        };
      });
    });
    return availability;
  } catch (error) {
    throw error;
  }
}

async function getSeatDetails(eventId, section, row) {
  try {
    const event = await Event.findById(eventId).lean();
    if (!event) return null;

    if (!event.seats[section] || !event.seats[section][row]) {
      return null;
    }

    // Get all bookings for this event, section, and row
    const bookings = await Booking.find({
      eventId: eventId,
      section: section,
      row: row
    }).lean();

    // Collect all booked seat numbers from bookings
    const bookedSeatNumbers = new Set();
    bookings.forEach(booking => {
      if (booking.seatNumbers && Array.isArray(booking.seatNumbers)) {
        booking.seatNumbers.forEach(seatNum => bookedSeatNumbers.add(seatNum));
      }
    });

    const totalSeats = event.seats[section][row].length;
    
    // Return seat details based on bookings (source of truth)
    return Array.from({ length: totalSeats }, (_, index) => {
      const seatNumber = index + 1;
      return {
        seatNumber: seatNumber,
        isBooked: bookedSeatNumbers.has(seatNumber)
      };
    });
  } catch (error) {
    throw error;
  }
}

async function bookSeats(eventId, section, row, quantity, seatNumbers = null) {
  try {
    const event = await Event.findById(eventId);
    if (!event) return { success: false, error: 'Event not found' };

    if (!event.seats[section] || !event.seats[section][row]) {
      return { success: false, error: 'Invalid section or row' };
    }

    const totalSeats = event.seats[section][row].length;

    // Get existing bookings to check for conflicts
    const existingBookings = await Booking.find({
      eventId: eventId,
      section: section,
      row: row
    }).lean();

    const bookedSeatNumbers = new Set();
    existingBookings.forEach(booking => {
      if (booking.seatNumbers && Array.isArray(booking.seatNumbers)) {
        booking.seatNumbers.forEach(seatNum => bookedSeatNumbers.add(seatNum));
      }
    });

    // If seatNumbers provided, book specific seats
    if (seatNumbers && Array.isArray(seatNumbers) && seatNumbers.length === quantity) {
      // Validate seat numbers
      for (const seatNum of seatNumbers) {
        if (seatNum < 1 || seatNum > totalSeats) {
          return { success: false, error: `Invalid seat number: ${seatNum}` };
        }
        if (bookedSeatNumbers.has(seatNum)) {
          return { success: false, error: `Seat ${seatNum} is already booked` };
        }
      }
    } else {
      // Sequential booking (backward compatibility for tests)
      const availableCount = totalSeats - bookedSeatNumbers.size;
      if (availableCount < quantity) {
        return { success: false, error: 'Not enough seats available', available: availableCount };
      }
    }

    // Determine which seat numbers were booked
    const seatsToBook = seatNumbers && Array.isArray(seatNumbers) && seatNumbers.length === quantity
      ? seatNumbers.sort((a, b) => a - b)
      : [];

    const booking = new Booking({
      eventId: event._id,
      section,
      row,
      quantity,
      seatNumbers: seatsToBook,
      groupDiscount: quantity >= 4
    });
    await booking.save();

    return {
      success: true,
      booking: {
        id: booking._id.toString(),
        eventId: eventId,
        section,
        row,
        quantity,
        groupDiscount: booking.groupDiscount,
        bookedAt: booking.createdAt
      }
    };
  } catch (error) {
    throw error;
  }
}

async function getBookingById(bookingId) {
  try {
    const booking = await Booking.findById(bookingId).populate('eventId', 'name date').lean();
    if (!booking) return null;
    
    const eventIdObj = booking.eventId;
    const eventIdString = eventIdObj?._id ? eventIdObj._id.toString() : (eventIdObj ? eventIdObj.toString() : null);
    const eventName = eventIdObj?.name || null;
    const eventDate = eventIdObj?.date || null;
    
    return {
      id: booking._id.toString(),
      eventId: eventIdString,
      section: booking.section,
      row: booking.row,
      quantity: booking.quantity,
      groupDiscount: booking.groupDiscount,
      bookedAt: booking.createdAt,
      eventName: eventName,
      eventDate: eventDate
    };
  } catch (error) {
    throw error;
  }
}

async function getAllBookings() {
  try {
    const bookings = await Booking.find().lean();
    return bookings.map(booking => ({
      ...booking,
      id: booking._id.toString(),
      eventId: booking.eventId.toString()
    }));
  } catch (error) {
    throw error;
  }
}

async function getBookingsByEventId(eventId) {
  try {
    const bookings = await Booking.find({ eventId }).lean();
    return bookings.map(booking => ({
      ...booking,
      id: booking._id.toString()
    }));
  } catch (error) {
    throw error;
  }
}

async function getAdminStats() {
  try {
    const bookings = await Booking.find().lean();
    const totalTickets = bookings.reduce((sum, booking) => sum + booking.quantity, 0);
    const basePrice = 100;
    const discountedPrice = 80;
    const revenue = bookings.reduce((sum, booking) => {
      const price = booking.groupDiscount ? discountedPrice : basePrice;
      return sum + (booking.quantity * price);
    }, 0);
    const totalBookings = bookings.length;

    const bookingsByEvent = {};
    bookings.forEach(booking => {
      const eventId = booking.eventId.toString();
      if (!bookingsByEvent[eventId]) {
        bookingsByEvent[eventId] = 0;
      }
      bookingsByEvent[eventId] += booking.quantity;
    });

    return {
      totalBookings,
      totalTickets,
      revenue,
      bookingsByEvent
    };
  } catch (error) {
    throw error;
  }
}

async function resetData() {
  try {
    await Event.deleteMany({});
    await Booking.deleteMany({});
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  getAvailability,
  getSeatDetails,
  bookSeats,
  getBookingById,
  getAllBookings,
  getBookingsByEventId,
  getAdminStats,
  resetData
};
