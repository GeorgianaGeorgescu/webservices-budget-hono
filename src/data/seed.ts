import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../core/password';
import Role from '../core/roles';

const prisma = new PrismaClient();

async function main() {
  // Seed users
  // ==========
  const passwordHash = await hashPassword('12345678');

  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: 'Thomas Aelbrecht',
        email: 'thomas.aelbrecht@hogent.be',
        password_hash: passwordHash,
        roles: JSON.stringify([Role.ADMIN, Role.USER]),
      },
      {
        id: 2,
        name: 'Pieter Van Der Helst',
        email: 'pieter.vanderhelst@hogent.be',
        password_hash: passwordHash,
        roles: JSON.stringify([Role.USER]),
      },
      {
        id: 3,
        name: 'Karine Samyn',
        email: 'karine.samyn@hogent.be',
        password_hash: passwordHash,
        roles: JSON.stringify([Role.USER]),
      },
    ],
  });

  // Seed places
  // ===========
  await prisma.place.createMany({
    data: [
      {
        id: 1,
        name: 'Loon',
        rating: 5,
      },
      {
        id: 2,
        name: 'Dranken Geers',
        rating: 3,
      },
      {
        id: 3,
        name: 'Irish Pub',
        rating: 4,
      },
    ],
  });

  // Seed transactions
  // =================
  await prisma.transaction.createMany({
    data: [
      // User Thomas
      // ===========
      {
        id: 1,
        user_id: 1,
        place_id: 1,
        amount: 3500,
        date: new Date(2021, 4, 25, 19, 40),
      },
      {
        id: 2,
        user_id: 1,
        place_id: 2,
        amount: -220,
        date: new Date(2021, 4, 8, 20, 0),
      },
      {
        id: 3,
        user_id: 1,
        place_id: 3,
        amount: -74,
        date: new Date(2021, 4, 21, 14, 30),
      },
      // User Pieter
      // ===========
      {
        id: 4,
        user_id: 2,
        place_id: 1,
        amount: 4000,
        date: new Date(2021, 4, 25, 19, 40),
      },
      {
        id: 5,
        user_id: 2,
        place_id: 2,
        amount: -220,
        date: new Date(2021, 4, 9, 23, 0),
      },
      {
        id: 6,
        user_id: 2,
        place_id: 3,
        amount: -74,
        date: new Date(2021, 4, 22, 12, 0),
      },
      // User Karine
      // ===========
      {
        id: 7,
        user_id: 3,
        place_id: 1,
        amount: 4000,
        date: new Date(2021, 4, 25, 19, 40),
      },
      {
        id: 8,
        user_id: 3,
        place_id: 2,
        amount: -220,
        date: new Date(2021, 4, 10, 10, 0),
      },
      {
        id: 9,
        user_id: 3,
        place_id: 3,
        amount: -74,
        date: new Date(2021, 4, 19, 11, 30),
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
