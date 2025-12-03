import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
    path: path.resolve(__dirname, '../../.env'),
  });
  
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const passwordHash = await bcrypt.hash('demo1234', saltRounds);

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      fullName: 'Demo User',
      passwordHash,
    },
  });

  console.log(`✅ Created demo user: ${demoUser.email} (password: demo1234)`);
  
  for (let index = 0; index < 10; index++) {

    await prisma.room.create({
      data: {
        name: 'Deluxe Sea View',
        location: 'haifa',
        capacity: 4,
        pricePerNight: 120,
        currency: 'USD',
        amenities: ['wifi', 'air_conditioning', 'tv'],
        imageUrl: "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=1200"
      },
    });

    await prisma.room.create({
      data: {
        name: 'Business Suite',
        location: 'jerusalem',
        capacity: 2,
        pricePerNight: 90,
        currency: 'USD',
        amenities: ['wifi', 'desk'],
        imageUrl: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1200"
      },
    });

    await prisma.room.create({
      data: {
        name: 'Family Room',
        location: 'tel-aviv',
        capacity: 5,
        pricePerNight: 150,
        currency: 'USD',
        amenities: ['wifi', 'air_conditioning'],
        imageUrl: "https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=1200"
      },
    });

    console.log('✅ Created 3 rooms');
  } 

  console.log('✅ Created sample booking for room1 (Deluxe Sea View)');
  console.log('🌱 Seeding finished successfully');
}

main()
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
