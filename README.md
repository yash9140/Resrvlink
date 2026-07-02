# ResrvLink - Restaurant Reservation Management System

ResrvLink is a production-ready, full-stack MERN application for managing restaurant reservations. It features smart table allocation, overlap-prevention reservation logic, and a premium modern UI with role-based access control.

## Project Overview
This system handles reservations professionally by dynamically assigning the best available table to a customer based on guest count and preventing any time overlaps or double bookings.

## Tech Stack
- **Frontend**: React (Vite), React Router, Axios, Context API, CSS (Custom Design System)
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT Auth, bcrypt, Helmet, CORS, Express Validator, Winston Logger

## Folder Structure
```text
/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── context/        # React Context (Auth)
│   │   ├── hooks/          # Custom hooks (useAuth)
│   │   ├── layouts/        # Page Layouts (Customer, Admin)
│   │   ├── pages/          # Route Pages
│   │   ├── routes/         # Protected/Admin Routes
│   │   ├── services/       # Axios API integration
│   │   └── styles/         # Global CSS & Design System
│   └── package.json
└── server/                 # Backend Node/Express API
    ├── config/             # DB Configuration
    ├── controllers/        # Request handlers
    ├── middleware/         # Auth, Error, Validation middlewares
    ├── models/             # Mongoose Schemas
    ├── routes/             # API Routes
    ├── services/           # Core business logic (Allocations)
    ├── utils/              # Loggers, Error formatting
    ├── validators/         # Express-validator schemas
    ├── seeder.js           # Database seeder script
    └── package.json
```

## Setup & Installation

### 1. Environment Variables
**Backend (`server/.env`)**
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Frontend (`client/.env`)**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Run Backend
```bash
cd server
npm install
npm run seed  # Seed 8 tables & admin user
npm run dev   # Start server on port 5000
```
*(Admin credentials generated: admin@resrvlink.com / Admin@123456)*

### 3. Run Frontend
```bash
cd client
npm install
npm run dev   # Start frontend on port 5173
```

## Core Reservation Logic
The system implements a "Smallest-Fit Table Allocation" algorithm wrapped in MongoDB Transactions:
1. Validates input (guest count, future date, valid times).
2. Finds all active tables with `seatingCapacity >= guestCount`, ordered ascending by capacity.
3. Iterates over candidates and performs an overlap query (`existStart < newEnd AND existEnd > newStart`).
4. Assigns the first table with zero conflicts.
5. Saves the reservation atomically.

## Role-Based Access
- **Public**: Can register and login.
- **Customer**: Can view dashboard, create reservations, view own reservations, and cancel upcoming ones.
- **Admin**: Can view all reservations, filter by date, update/cancel any reservation, and fully manage tables (CRUD).

## Deployment
- **Frontend (Vercel)**: Set `VITE_API_BASE_URL` to the deployed backend URL.
- **Backend (Render)**: Set all `.env` variables and ensure `CLIENT_URL` matches the Vercel domain to prevent CORS issues.

## Assumptions & Limitations
- Operating hours are implicitly defined by the UI time slots (10:00 - 22:30).
- Automatic end times are assumed to be 1 hour after start time for UI simplicity.

## Future Improvements
- SMS/Email notifications on reservation creation.
- Visual floor plan mapping for admins.
- Payment integration for reservation holds.
