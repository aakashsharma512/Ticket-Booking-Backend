# Backend - Ticket Booking System

Node.js and Express backend with MongoDB Atlas for ticket booking system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in backend folder:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://aakisharma512_db_user:6U2WM5ApGF6b88O6@cluster0.d5cmrnm.mongodb.net/ticket_booking?retryWrites=true&w=majority
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### POST /events
Create a new event with name, date, and sections.

### GET /events
Get all events with basic details.

### GET /events/:id/availability
Get seat availability by section and row.

### GET /events/:id/seats
Get detailed seat information for a section and row.

Query Parameters: section, row

### POST /events/:id/purchase
Purchase tickets for an event.

Request Body:
```json
{
  "section": "Section A",
  "row": "Row 1",
  "quantity": 2
}
```

### GET /events/bookings/:id
Get booking details by booking ID.

### GET /admin/bookings
Get all bookings (Admin).

### GET /admin/stats
Get admin statistics (total bookings, tickets, revenue).

## Testing

Run unit tests:
```bash
npm test
```

## Project Structure

- `server.js` - Main Express server
- `config/database.js` - MongoDB connection
- `routes/` - API routes
- `controllers/` - Business logic handlers
- `models/` - Database models and data access
- `middleware/` - Request logging middleware
- `utils/` - Helper functions and messages
- `tests/` - Unit tests

## Database

Uses MongoDB Atlas (cloud database). Connection string is in `.env` file.

