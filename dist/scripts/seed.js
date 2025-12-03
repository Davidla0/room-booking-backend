"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../../.env'),
});
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../lib/prisma");
async function main() {
    console.log('🌱 Seeding database...');
    await prisma_1.prisma.booking.deleteMany();
    await prisma_1.prisma.room.deleteMany();
    await prisma_1.prisma.user.deleteMany();
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const passwordHash = await bcrypt_1.default.hash('demo1234', saltRounds);
    const demoUser = await prisma_1.prisma.user.create({
        data: {
            email: 'demo@example.com',
            fullName: 'Demo User',
            passwordHash,
        },
    });
    console.log(`✅ Created demo user: ${demoUser.email} (password: demo1234)`);
    const room1 = await prisma_1.prisma.room.create({
        data: {
            name: 'Deluxe Sea View',
            location: 'tel-aviv',
            capacity: 4,
            pricePerNight: 120,
            currency: 'USD',
            amenities: ['wifi', 'air_conditioning', 'tv'],
        },
    });
    const room2 = await prisma_1.prisma.room.create({
        data: {
            name: 'Business Suite',
            location: 'jerusalem',
            capacity: 2,
            pricePerNight: 90,
            currency: 'USD',
            amenities: ['wifi', 'desk'],
        },
    });
    const room3 = await prisma_1.prisma.room.create({
        data: {
            name: 'Family Room',
            location: 'tel-aviv',
            capacity: 5,
            pricePerNight: 150,
            currency: 'USD',
            amenities: ['wifi', 'air_conditioning'],
        },
    });
    console.log('✅ Created 3 rooms');
    await prisma_1.prisma.booking.create({
        data: {
            userId: demoUser.id,
            roomId: room1.id,
            checkIn: new Date('2025-12-10'),
            checkOut: new Date('2025-12-15'),
            guests: 2,
            status: 'CONFIRMED',
        },
    });
    console.log('✅ Created sample booking for room1 (Deluxe Sea View)');
    console.log('🌱 Seeding finished successfully');
}
main()
    .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
