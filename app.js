const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const requestLogger = require('./middleware/logger');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { sendError } = require('./utils/responseHelper');

const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use('/events', eventRoutes);
app.use('/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  return sendError(res, 'Route not found', 404);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  return sendError(res, 'Internal server error', 500);
});

module.exports = app;

