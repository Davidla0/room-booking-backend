# Room Booking – Backend Service

Backend microservice for the Room Booking platform.  
Built with:

- **Node.js + TypeScript**
- **Express**
- **PostgreSQL (Docker)**
- **Prisma ORM**
- **JWT Authentication**
- **Stateless Architecture**

This service manages:

- User registration and login
- Room search with filters and date range availability
- Booking creation with conflict prevention (no double booking)
- Data persistence in PostgreSQL via Prisma
- Database migrations and seed demo data

For full architecture documentation, see the system design document in the main platform repository.

---

## 1. Project Structure

```text
backend/
├── src/
│   ├── controllers/      # Express route handlers
│   ├── routes/           # API route definitions
│   ├── services/         # Core business logic (auth, rooms, bookings)
│   ├── middleware/       # Auth, validation, logging
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Shared helpers (e.g. date overlap calculation)
│   ├── lib/
│   │   └── prisma.ts     # Prisma client initialization
│   ├── scripts/
│   │   └── seed.ts       # DB seed script for demo data
│   └── index.ts          # Express app entry point
├── prisma/
│   ├── schema.prisma     # DB models (User, Room, Booking)
│   └── migrations/       # Auto-generated Prisma migrations
├── Dockerfile            # Backend container definition
├── package.json
└── .env                  # Backend environment variables (local)
```

---

## 2. Requirements

- Node.js (LTS)
- Docker + Docker Compose
- npm

---

## 3. Environment Variables

Create **backend/.env**:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/room_booking?schema=public"
PORT=4000
JWT_SECRET="dev-secret-change-in-prod"
BCRYPT_SALT_ROUNDS=10
```

When running inside Docker, the `DATABASE_URL` will typically point to the Docker service name instead of `localhost`. For example:

```env
DATABASE_URL="postgresql://postgres:postgres@room-booking-postgres:5432/room_booking?schema=public"
```

---

## 4. Start PostgreSQL with Docker

From the main platform repository (where `docker-compose.yml` lives):

```bash
docker compose up -d
```

This will start:

- **Postgres** on `localhost:5432`
- **Adminer** (DB UI) at `http://localhost:8080`

Credentials and DB name are defined in the `docker-compose.yml` and aligned with the `DATABASE_URL` in `.env`.

---

## 5. Install Dependencies

```bash
cd backend
npm install
```

---

## 6. Run Migrations

Apply Prisma migrations to create the schema:

```bash
npx prisma migrate dev
```

This creates the tables:

- `User`
- `Room`
- `Booking`

You can inspect them via Adminer if desired.

---

## 7. Seed Demo Data (Recommended)

```bash
npm run seed
```

The seed script will:

- Clear existing `User`, `Room`, and `Booking` rows
- Create a demo user:

  - email: `demo@example.com`  
  - password: `demo1234`

- Insert 3 sample rooms (Tel Aviv & Jerusalem)
- Create a confirmed booking for one of the rooms

This allows you to log in and see bookings immediately.

---

## 8. Start the Backend Server (Local Dev)

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

## 9. API Overview

### Auth

- `POST /api/auth/register`  
  - body: `{ "email": string, "password": string, "fullName": string }`
- `POST /api/auth/login`  
  - body: `{ "email": string, "password": string }`  
  - returns: JWT and user profile

### Rooms

- `GET /api/rooms?location=tel-aviv&capacity=2&checkIn=2025-12-10&checkOut=2025-12-15`

Query parameters:

- `location` – filter by city
- `capacity` – minimum capacity
- `checkIn`, `checkOut` – date range (ISO `YYYY-MM-DD`)

The API returns only rooms that are not already booked in the requested date range.

### Bookings

- `GET /api/bookings/me`  
  - Requires `Authorization: Bearer <token>` header
  - Returns bookings for the authenticated user

- `POST /api/bookings`  
  - Requires `Authorization: Bearer <token>`
  - body:
    ```json
    {
      "roomId": "uuid",
      "checkIn": "2025-12-10",
      "checkOut": "2025-12-15",
      "guests": 2
    }
    ```

Booking creation includes:

- Checking for overlapping bookings for the same room
- Returning a clear error when the room is already booked

---

## 10. Docker (Backend Service Only)

Build:

```bash
docker build -t room-booking-backend .
```

Run:

```bash
docker run --env-file .env -p 4000:4000 room-booking-backend
```

Ensure `DATABASE_URL` points to a reachable Postgres instance (Docker network or localhost).

---

The backend is stateless, production-oriented and ready to run as an independent microservice.
