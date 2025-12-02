const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');
const { roomSeed, userSeed } = require('./sampleData');

async function seedDatabase() {
  const roomCount = await prisma.room.count();
  if (roomCount === 0) {
    await prisma.room.createMany({ data: roomSeed });
  }

  const userCount = await prisma.user.count();
  if (userCount === 0) {
    const payload = await Promise.all(
      userSeed.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );
    await prisma.user.createMany({ data: payload });
  }
}

module.exports = seedDatabase;
