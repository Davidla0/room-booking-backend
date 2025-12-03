"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomsController = getRoomsController;
const rooms_service_1 = require("../services/rooms.service");
async function getRoomsController(req, res) {
    try {
        const { location, capacity, name, checkIn, checkOut, page = '1', pageSize = '20' } = req.query;
        const result = await (0, rooms_service_1.searchRooms)({
            location: typeof location === 'string' ? location : undefined,
            capacity: typeof capacity === 'string' ? Number(capacity) : undefined,
            name: typeof name === 'string' ? name : undefined,
            checkIn: typeof checkIn === 'string' ? checkIn : undefined,
            checkOut: typeof checkOut === 'string' ? checkOut : undefined,
            page: Number(page),
            pageSize: Number(pageSize)
        });
        return res.status(200).json(result);
    }
    catch (err) {
        console.error('getRoomsController error:', err);
        return res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong'
        });
    }
}
