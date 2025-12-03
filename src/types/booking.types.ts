import type { Booking as DbBooking, BookingStatus, Room } from '../generated/prisma';

export type Booking = DbBooking & { room?: Room };

export interface CreateBookingInput {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface BookingFilter {
  userId?: string;
  roomId?: string;
  status?: BookingStatus;
}
