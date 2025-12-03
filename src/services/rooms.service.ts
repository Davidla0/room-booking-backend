
import { prisma } from '../lib/prisma';
import { RoomSearchParams, PaginatedRoomsResult } from '../types/room.types';

export async function searchRooms(params: RoomSearchParams): Promise<PaginatedRoomsResult> {
  const {
    location,
    capacity,
    name,
    checkIn,
    checkOut,
    page = 1,
    pageSize = 20,
  } = params;

  if (!checkIn || !checkOut) {
    throw new Error('checkIn and checkOut are required'); 
  }

  const requestedStart = new Date(checkIn);
  const requestedEnd = new Date(checkOut);

  const baseWhere: any = {};

  if (location) {
    baseWhere.location = {
      equals: location,
      mode: 'insensitive',
    };
  }

  if (capacity) {
    baseWhere.capacity = {
      gte: capacity,
    };
  }

  if (name) {
    baseWhere.name = {
      contains: name,
      mode: 'insensitive',
    };
  }

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const availabilityWhere = {
    bookings: {
      none: {
        status: 'CONFIRMED',
        checkIn: { lt: requestedEnd },
        checkOut: { gt: requestedStart },
      },
    },
  };

  const where = {
    ...baseWhere,
    ...availabilityWhere,
  };

  const [rooms, total] = await Promise.all([
    prisma.room.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.room.count({ where }),
  ]);

  return {
    items: rooms,
    page,
    pageSize,
    total,
  };
}
