const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const requestLogger = require('./middleware/logger');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/events', eventRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
