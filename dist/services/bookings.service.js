"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = createBooking;
exports.getBookings = getBookings;
const prisma_1 = require("../lib/prisma");
const data_utils_1 = require("../utils/data.utils");
async function createBooking(input, userId) {
    const { roomId, checkIn, checkOut, guests } = input;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
        const error = new Error('Invalid date range');
        error.code = 'INVALID_DATES';
        throw error;
    }
    const room = await prisma_1.prisma.room.findUnique({
        where: { id: roomId },
    });
    if (!room) {
        const error = new Error('Room not found');
        error.code = 'ROOM_NOT_FOUND';
        throw error;
    }
    const existing = await prisma_1.prisma.booking.findMany({
        where: {
            roomId,
            status: 'CONFIRMED',
        },
    });
    const overlapping = existing.some((b) => (0, data_utils_1.isOverlapping)(b.checkIn, b.checkOut, start, end));
    if (overlapping) {
        const error = new Error('Room not available for selected dates');
        error.code = 'ROOM_NOT_AVAILABLE';
        throw error;
    }
    const booking = await prisma_1.prisma.booking.create({
        data: {
            roomId,
            userId,
            checkIn: start,
            checkOut: end,
            guests,
            status: 'CONFIRMED',
        },
    });
    return booking;
}
async function getBookings(filter = {}) {
    const { userId, roomId, status } = filter;
    return prisma_1.prisma.booking.findMany({
        where: {
            userId: userId || undefined,
            roomId: roomId || undefined,
            status: status || undefined,
        },
        orderBy: {
            checkIn: 'desc',
        },
    });
}
