const {
  getAllEvents,
  getEventById,
  createEvent,
  getAvailability,
  getSeatDetails,
  bookSeats,
  resetData
} = require('../models/dataStore');

describe('Event Booking System', () => {
  beforeEach(() => {
    resetData();
  });

  test('should create a new event', () => {
    const eventData = {
      name: 'Test Concert',
      date: '2025-07-10T19:00:00Z',
      sections: [
        {
          name: 'Section A',
          rows: [
            { name: 'Row 1', totalSeats: 10 },
            { name: 'Row 2', totalSeats: 8 }
          ]
        }
      ]
    };

    const event = createEvent(eventData.name, eventData.date, eventData.sections);
    
    expect(event).toBeDefined();
    expect(event.id).toBe(1);
    expect(event.name).toBe('Test Concert');
    expect(event.sections).toHaveLength(1);
    expect(event.seats['Section A']['Row 1']).toHaveLength(10);
  });

  test('should get availability for an event', () => {
    const event = createEvent('Test Event', '2025-07-10T19:00:00Z', [
      {
        name: 'Section A',
        rows: [{ name: 'Row 1', totalSeats: 10 }]
      }
    ]);

    const availability = getAvailability(event.id);
    
    expect(availability).toBeDefined();
    expect(availability['Section A']['Row 1'].total).toBe(10);
    expect(availability['Section A']['Row 1'].available).toBe(10);
    expect(availability['Section A']['Row 1'].booked).toBe(0);
  });

  test('should book seats successfully', () => {
    const event = createEvent('Test Event', '2025-07-10T19:00:00Z', [
      {
        name: 'Section A',
        rows: [{ name: 'Row 1', totalSeats: 10 }]
      }
    ]);

    const result = bookSeats(event.id, 'Section A', 'Row 1', 3);
    
    expect(result.success).toBe(true);
    expect(result.booking.quantity).toBe(3);
    expect(result.booking.groupDiscount).toBe(false);

    const availability = getAvailability(event.id);
    expect(availability['Section A']['Row 1'].available).toBe(7);
    expect(availability['Section A']['Row 1'].booked).toBe(3);
  });

  test('should apply group discount for 4 or more tickets', () => {
    const event = createEvent('Test Event', '2025-07-10T19:00:00Z', [
      {
        name: 'Section A',
        rows: [{ name: 'Row 1', totalSeats: 10 }]
      }
    ]);

    const result = bookSeats(event.id, 'Section A', 'Row 1', 4);
    
    expect(result.success).toBe(true);
    expect(result.booking.groupDiscount).toBe(true);
  });

  test('should prevent overbooking', () => {
    const event = createEvent('Test Event', '2025-07-10T19:00:00Z', [
      {
        name: 'Section A',
        rows: [{ name: 'Row 1', totalSeats: 5 }]
      }
    ]);

    const result1 = bookSeats(event.id, 'Section A', 'Row 1', 3);
    expect(result1.success).toBe(true);

    const result2 = bookSeats(event.id, 'Section A', 'Row 1', 3);
    expect(result2.success).toBe(false);
    expect(result2.error).toBe('Not enough seats available');
    expect(result2.available).toBe(2);
  });

  test('should not allow booking invalid section or row', () => {
    const event = createEvent('Test Event', '2025-07-10T19:00:00Z', [
      {
        name: 'Section A',
        rows: [{ name: 'Row 1', totalSeats: 10 }]
      }
    ]);

    const result1 = bookSeats(event.id, 'Invalid Section', 'Row 1', 2);
    expect(result1.success).toBe(false);
    expect(result1.error).toBe('Invalid section or row');

    const result2 = bookSeats(event.id, 'Section A', 'Invalid Row', 2);
    expect(result2.success).toBe(false);
    expect(result2.error).toBe('Invalid section or row');
  });

  test('should get seat details for a section and row', () => {
    const event = createEvent('Test Event', '2025-07-10T19:00:00Z', [
      {
        name: 'Section A',
        rows: [{ name: 'Row 1', totalSeats: 5 }]
      }
    ]);

    bookSeats(event.id, 'Section A', 'Row 1', 2);
    
    const seatDetails = getSeatDetails(event.id, 'Section A', 'Row 1');
    
    expect(seatDetails).toHaveLength(5);
    expect(seatDetails.filter(s => s.isBooked).length).toBe(2);
    expect(seatDetails.filter(s => !s.isBooked).length).toBe(3);
  });
});

