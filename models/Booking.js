const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  section: {
    type: String,
    required: true
  },
  row: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  seatNumbers: {
    type: [Number],
    default: []
  },
  groupDiscount: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);

