"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_2 = require("express");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const rooms_routes_1 = __importDefault(require("./routes/rooms.routes"));
const bookings_routes_1 = __importDefault(require("./routes/bookings.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use((0, express_2.json)());
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/rooms', rooms_routes_1.default);
app.use('/api/bookings', bookings_routes_1.default);
app.listen(PORT, () => {
    console.log(`Booking API listening on port ${PORT}`);
});
