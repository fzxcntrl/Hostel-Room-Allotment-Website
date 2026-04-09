const { MongoClient } = require('mongodb');

let dbConnection = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB via Native Driver');
    
    dbConnection = client.db('hostelbloom');
    return dbConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const getDb = () => {
  if (!dbConnection) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return dbConnection;
};

module.exports = { connectDB, getDb };
