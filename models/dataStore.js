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

    const availability = {};
    event.sections.forEach(section => {
      availability[section.name] = {};
      section.rows.forEach(row => {
        const seats = event.seats[section.name]?.[row.name] || [];
        const bookedSeats = seats.filter(seat => seat === true).length;
        const totalSeats = row.totalSeats;
        availability[section.name][row.name] = {
          available: totalSeats - bookedSeats,
          total: totalSeats,
          booked: bookedSeats
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

    const seats = event.seats[section][row];
    return seats.map((isBooked, index) => ({
      seatNumber: index + 1,
      isBooked: isBooked
    }));
  } catch (error) {
    throw error;
  }
}

async function bookSeats(eventId, section, row, quantity) {
  try {
    const event = await Event.findById(eventId);
    if (!event) return { success: false, error: 'Event not found' };

    if (!event.seats[section] || !event.seats[section][row]) {
      return { success: false, error: 'Invalid section or row' };
    }

    const seats = event.seats[section][row];
    const availableSeats = seats.filter(seat => seat === false).length;

    if (availableSeats < quantity) {
      return { success: false, error: 'Not enough seats available', available: availableSeats };
    }

    let bookedCount = 0;
    for (let i = 0; i < seats.length && bookedCount < quantity; i++) {
      if (seats[i] === false) {
        seats[i] = true;
        bookedCount++;
      }
    }

    event.markModified('seats');
    await event.save();

    const booking = new Booking({
      eventId: event._id,
      section,
      row,
      quantity,
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
