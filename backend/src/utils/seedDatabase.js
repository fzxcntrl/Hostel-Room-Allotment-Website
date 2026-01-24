const bcrypt = require('bcryptjs');
const { getDb } = require('../config/db');
const { roomSeed, userSeed } = require('./sampleData');

async function seedDatabase() {
  const db = getDb();
  
  const roomCount = await db.collection('rooms').countDocuments();
  if (roomCount === 0) {
    await db.collection('rooms').insertMany(roomSeed);
    console.log('Seed: Rooms inserted');
  }

  const userCount = await db.collection('users').countDocuments();
  if (userCount === 0) {
    const payload = await Promise.all(
      userSeed.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );
    await db.collection('users').insertMany(payload);
    console.log('Seed: Users inserted');
  }
}

module.exports = seedDatabase;
