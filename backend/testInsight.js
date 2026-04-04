require('dotenv').config({ path: '/Users/farzainnaikwade.mac/Desktop/Sem3project/backend/.env' });
const { MongoClient } = require('mongodb');

async function test() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('hostelbloom');
  
  const allRooms = await db.collection('rooms').find().toArray();
  const roomsCount = allRooms.length;
  const availableRoomsCount = allRooms.filter(r => r.isAvailable).length;
  
  const totalBeds = allRooms.reduce((sum, r) => sum + (r.capacity || 1), 0);

  const bookings = await db.collection('bookings').countDocuments();
  const users = await db.collection('users').countDocuments();

  const occupancyRate = roomsCount === 0 ? 0 : Math.round(((roomsCount - availableRoomsCount) / roomsCount) * 100);

  console.log({ totals: { rooms: totalBeds, availableRooms: availableRoomsCount, bookings, users }, occupancyRate });
  process.exit();
}
test().catch(console.error);
