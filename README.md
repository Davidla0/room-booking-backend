# Room Booking – Backend Service

Backend microservice for the Room Booking platform.  
Built with:

- **Node.js + TypeScript**
- **Express**
- **PostgreSQL**
- **Prisma ORM**
- **JWT Authentication**
- **Stateless, containerized service**

This service is designed to run as an independent container (microservice) and expose a clean HTTP API for the frontend.

It is responsible for:

- User registration and login
- Room search with filters and date range availability
- Booking creation with conflict prevention (no double‑booking)
- Data persistence in PostgreSQL using Prisma
- Seed data for quick demo usage

---

## 1. Project Structure

```text
backend/
├── src/
│   ├── controllers/        # Express route handlers (auth, rooms, bookings)
│   ├── routes/             # Route definitions
│   ├── services/           # Business logic
│   ├── middleware/         # Auth, validation, logging
│   ├── types/              # TypeScript types/interfaces
│   ├── utils/              # Shared helpers (e.g. date overlap check)
│   ├── lib/
│   │   └── prisma.ts       # Prisma client initialization
│   └── scripts/
│       └── seed.ts         # Seed script for demo data
├── prisma/
│   ├── schema.prisma       # Prisma schema (User, Room, Booking)
│   └── migrations/         # Generated migrations
├── Dockerfile              # Backend container definition
├── package.json
└── README.md
```

---

## 2. Requirements

For local development without Docker:

- Node.js (LTS)
- PostgreSQL
- npm

For containerized environment:

- Docker

---

## 3. Environment Variables

The backend needs the following environment variables:

```env
# Connection string for Postgres
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/room_booking?schema=public"

# HTTP port for the API
PORT=4000

# JWT
JWT_SECRET="dev-secret-change-in-prod"
BCRYPT_SALT_ROUNDS=10
```

> When running inside Docker, the `DATABASE_URL` host will typically be the **service name** of the Postgres container (e.g. `room-booking-postgres`) instead of `localhost`.

Example (in Docker):

```env
DATABASE_URL="postgresql://postgres:postgres@room-booking-postgres:5432/room_booking?schema=public"
```

---

## 4. Running Locally (without Docker)

### 4.1. Start PostgreSQL

Create a database named `room_booking` and a user/password `postgres/postgres`  
(or adjust `DATABASE_URL` accordingly).

### 4.2. Install Dependencies

```bash
cd room-booking-backend
npm install
```

### 4.3. Run Prisma Migrations

```bash
npx prisma migrate dev
```

This will apply the migrations and create the tables:

- `User`
- `Room`
- `Booking`

### 4.4. (Optional) Seed Demo Data

```bash
npm run seed
```

The seed script will:

- Clear existing `User`, `Room`, and `Booking` rows
- Create a demo user:

  - email: `demo@example.com`
  - password: `demo1234`

- Insert 3 sample rooms
- Create one confirmed booking

### 4.5. Start the Backend Server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:4000
```

Health check:

```bash
curl http://localhost:4000/api/health
```

---

## 5. Running as a Dockerized Microservice

The backend is designed to run inside a container and talk to a Postgres container over a Docker network.

### 5.1. Run Postgres + Backend with Docker

to start the backend and postgress container run : 
```bash
docker compose up -d --build
 ```


Now the backend is available on `http://localhost:4000`, but running fully inside Docker.

### 5.2. Running Prisma Migrations & Seed **inside** the Container

When using Docker end‑to‑end, the DB lives in a container, so it is often convenient to run migrations and seed **inside** the backend container.

After the containers are up:

```bash
# Run migrations inside the backend container
docker exec -it room-booking-backend npx prisma migrate deploy

# Seed demo data
docker exec -it room-booking-backend node dist/scripts/seed.js
```

> This ensures the database schema and seed data are aligned with the exact version of the backend image they are testing.

---

## 6. API Overview

### Auth

- `POST /api/auth/register`  
  Body:
  ```json
  {
    "email": "user@example.com",
    "password": "string",
    "fullName": "User Name"
  }
  ```

- `POST /api/auth/login`  
  Body:
  ```json
  {
    "email": "user@example.com",
    "password": "string"
  }
  ```

Both endpoints return a JWT token and basic user info.

### Rooms

- `GET /api/rooms?location=tel-aviv&capacity=2&checkIn=2025-12-10&checkOut=2025-12-15`

Query parameters:

- `location` – optional, filter by city
- `capacity` – optional, minimum capacity
- `checkIn`, `checkOut` – required for availability check

Response contains:

- `items`: array of rooms
- `total`, `page`, `pageSize`

Only rooms that are **not already booked** in the requested date range are returned.

### Bookings

- `GET /api/bookings/me`  
  Requires `Authorization: Bearer <token>`.  
  Returns all bookings for the currently authenticated user.

- `POST /api/bookings`  
  Requires `Authorization: Bearer <token>`.  
  Body:
  ```json
  {
    "roomId": "uuid",
    "checkIn": "2025-12-10",
    "checkOut": "2025-12-15",
    "guests": 2
  }
  ```

Conflict detection logic ensures that:

- Overlapping bookings for the same room are rejected
- The client receives a clear error if the room is already booked

---

The backend is stateless and containerized, and can be deployed as a microservice behind a load balancer and consumed by the React frontend or any other client.
