const { getAllBookings, getAdminStats } = require('../models/dataStore');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const {
  ADMIN_BOOKINGS_SUCCESS,
  ADMIN_BOOKINGS_ERROR,
  ADMIN_STATS_SUCCESS,
  ADMIN_STATS_ERROR
} = require('../utils/messages');

async function getAllBookingsHandler(req, res) {
  try {
    const bookings = await getAllBookings();
    return sendSuccess(res, ADMIN_BOOKINGS_SUCCESS, bookings);
  } catch (error) {
    return sendError(res, ADMIN_BOOKINGS_ERROR, 500);
  }
}

async function getAdminStatsHandler(req, res) {
  try {
    const stats = await getAdminStats();
    return sendSuccess(res, ADMIN_STATS_SUCCESS, stats);
  } catch (error) {
    return sendError(res, ADMIN_STATS_ERROR, 500);
  }
}

module.exports = {
  getAllBookingsHandler,
  getAdminStatsHandler
};
