
import { prisma } from '../lib/prisma';
import type { BookingStatus } from '../generated/prisma';
import { CreateBookingInput, BookingFilter, Booking } from '../types/booking.types';
import { isOverlapping } from '../utils/data.utils'


export async function createBooking(
  input: CreateBookingInput,
  userId: string
): Promise<Booking> {
  const { roomId, checkIn, checkOut, guests } = input;

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    const error: any = new Error('Invalid date range');
    error.code = 'INVALID_DATES';
    throw error;
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    const error: any = new Error('Room not found');
    error.code = 'ROOM_NOT_FOUND';
    throw error;
  }

  const existing = await prisma.booking.findMany({
    where: {
      roomId,
      status: 'CONFIRMED' as BookingStatus,
    },
  });

  const overlapping = existing.some((b) =>
    isOverlapping(b.checkIn, b.checkOut, start, end)
  );

  if (overlapping) {
    const error: any = new Error('Room not available for selected dates');
    error.code = 'ROOM_NOT_AVAILABLE';
    throw error;
  }

  const booking = await prisma.booking.create({
    data: {
      roomId,
      userId,
      checkIn: start,
      checkOut: end,
      guests,
      status: 'CONFIRMED' as BookingStatus,
    },
  });

  return booking;
}

export async function getBookings(filter: BookingFilter = {}): Promise<Booking[]> {
  const { userId, roomId, status } = filter;

  return prisma.booking.findMany({
    where: {
      userId: userId || undefined,
      roomId: roomId || undefined,
      status: status || undefined,
    },
    include: {
      room: true,
    },
    orderBy: {
      checkIn: 'desc',
    },
  });
}
