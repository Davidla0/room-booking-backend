import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { json } from 'express';
import authRoutes from './routes/auth.routes';
import roomsRoutes from './routes/rooms.routes';
import bookingsRoutes from './routes/bookings.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/bookings', bookingsRoutes);

app.listen(PORT, () => {
  console.log(`Booking API listening on port ${PORT}`);
});
