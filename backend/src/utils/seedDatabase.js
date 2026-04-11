const bcrypt = require('bcryptjs');
const { getDb } = require('../config/db');
const { userSeed } = require('./sampleData');

async function seedDatabase() {
  const db = getDb();
  

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
