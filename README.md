# Slotly

Slotly is a full-stack appointment booking application that allows users to view available time slots and book appointments. It also provides functionality for creating and managing appointment slots.

## Features

- **View available slots** — Browse upcoming appointment slots.
- **Book appointments** — Submit your name and email to book a slot.
- **Prevent double bookings** — Ensure each time slot can only be booked once.
- **Manage time slots** — Create new appointment slots.
- **Booking status** — Distinguish between available and booked slots.
- **Responsive interface** — Use the application on different screen sizes.

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Pino

### Database
- PostgreSQL hosted on Neon

## Project Structure

```text
slotly/
├── client/                 # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- A PostgreSQL database
- Git

### 1. Clone the repository

```bash
git clone https://github.com/AliJupan/slotly.git
cd slotly
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and configure your database connection according to the project's Prisma configuration.

Make sure your Prisma database schema is applied before starting the server.

Start the backend using the start script defined in `server/package.json`:

```bash
npm start
```

### 3. Set up the frontend

Open a second terminal:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check backend health |
| GET | `/api/slots` | Retrieve appointment slots |
| GET | `/api/slots/:id` | Retrieve a specific slot |
| POST | `/api/slots` | Create an appointment slot |
| POST | `/api/bookings` | Book an appointment |

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string, if required by the Prisma configuration |
| `VITE_API_URL` | Base URL of the backend API |

Keep credentials and other secrets in environment files. **Never commit `.env` files or database credentials to GitHub.**

## Deployment

The application is intended to use:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon PostgreSQL

Deployment configuration and production environment variables must be set up for each service.

## License

This project was developed as a full-stack application project.
