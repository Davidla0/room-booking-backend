"use strict";
// src/routes/bookings.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookings_controller_1 = require("../controllers/bookings.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authMiddleware, bookings_controller_1.createBookingController);
router.get('/my', auth_middleware_1.authMiddleware, bookings_controller_1.getMyBookingsController);
exports.default = router;
