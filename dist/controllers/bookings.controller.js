"use strict";
// src/controllers/bookings.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingController = createBookingController;
exports.getMyBookingsController = getMyBookingsController;
const bookings_service_1 = require("../services/bookings.service");
async function createBookingController(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: 'UNAUTHORIZED',
                message: 'Authentication required'
            });
        }
        const { roomId, checkIn, checkOut, guests } = req.body;
        if (!roomId || !checkIn || !checkOut || !guests) {
            return res.status(400).json({
                error: 'VALIDATION_ERROR',
                message: 'roomId, checkIn, checkOut and guests are required'
            });
        }
        const booking = await (0, bookings_service_1.createBooking)({
            roomId,
            checkIn,
            checkOut,
            guests: Number(guests)
        }, req.user.id);
        return res.status(201).json(booking);
    }
    catch (err) {
        if (err.code === 'INVALID_DATES') {
            return res.status(400).json({
                error: 'INVALID_DATES',
                message: err.message
            });
        }
        if (err.code === 'ROOM_NOT_AVAILABLE') {
            return res.status(409).json({
                error: 'ROOM_NOT_AVAILABLE',
                message: 'Room is not available for the selected dates'
            });
        }
        console.error('createBookingController error:', err);
        return res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong'
        });
    }
}
async function getMyBookingsController(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: 'UNAUTHORIZED',
                message: 'Authentication required'
            });
        }
        const userId = req.user.id;
        const bookings = await (0, bookings_service_1.getBookings)({ userId });
        return res.status(200).json({
            items: bookings,
            total: bookings.length
        });
    }
    catch (err) {
        console.error('getMyBookingsController error:', err);
        return res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong'
        });
    }
}
