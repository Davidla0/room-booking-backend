
import { Request, Response } from 'express';
import { searchRooms } from '../services/rooms.service';

export async function getRoomsController(req: Request, res: Response) {
  try {
    const {
      location,
      capacity,
      name,
      checkIn,
      checkOut,
      page = '1',
      pageSize = '20'
    } = req.query;

    const result = await searchRooms({
      location: typeof location === 'string' ? location : undefined,
      capacity: typeof capacity === 'string' ? Number(capacity) : undefined,
      name: typeof name === 'string' ? name : undefined,
      checkIn: typeof checkIn === 'string' ? checkIn : undefined,
      checkOut: typeof checkOut === 'string' ? checkOut : undefined,
      page: Number(page),
      pageSize: Number(pageSize)
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('getRoomsController error:', err);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong'
    });
  }
}
