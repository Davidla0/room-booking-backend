"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rooms_controller_1 = require("../controllers/rooms.controller");
const validateRoomSearch_middleware_1 = require("../middleware/validateRoomSearch.middleware");
const router = (0, express_1.Router)();
router.get('/', validateRoomSearch_middleware_1.validateRoomSearchDates, rooms_controller_1.getRoomsController);
exports.default = router;
