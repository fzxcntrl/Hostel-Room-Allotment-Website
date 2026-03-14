const { MongoClient } = require('mongodb');
require('dotenv').config();

const rooms = [
  {
    roomNumber: "101",
    name: "The Sunrise Single",
    type: "Single",
    capacity: 1,
    price: 45,
    isAvailable: true,
    description: "A cozy private room with an eastern-facing window letting in the morning light. Perfect for focused students who enjoy their own space.",
    amenities: ["WiFi", "Study Desk", "Single Bed", "Wardrobe", "Heater"],
    photoUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    createdAt: new Date(),
  },
  {
    roomNumber: "102",
    name: "The Wellness Twin",
    type: "Double",
    capacity: 2,
    price: 35,
    isAvailable: true,
    description: "Our signature twin layout featuring natural wood textures and aromatherapy diffusers for unwinding after a long day.",
    amenities: ["WiFi", "2 Twin Beds", "Aromatherapy Diffuser", "Balcony Access"],
    photoUrl: "https://images.unsplash.com/photo-1522771731535-610134f59fc6?auto=format&fit=crop&w=800&q=80",
    createdAt: new Date(),
  },
  {
    roomNumber: "103",
    name: "The Focus Double",
    type: "Double",
    capacity: 2,
    price: 38,
    isAvailable: true,
    description: "Designed heavily around academics, this double offers expansive ergonomic desks and superior acoustic insulation.",
    amenities: ["WiFi", "2 Twin Beds", "Acoustic Insulation", "Ergonomic Chairs", "Coffee Maker"],
    photoUrl: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80",
    createdAt: new Date(),
  },
  {
    roomNumber: "201",
    name: "The Vista Triple",
    type: "Triple",
    capacity: 3,
    price: 25,
    isAvailable: true,
    description: "A spacious triple dorm setup with a stunning campus view. Includes massive shared wardrobe space and separated study nooks.",
    amenities: ["WiFi", "3 Twin Beds", "Campus View", "Large Wardrobe", "Ensuite Bathroom"],
    photoUrl: "https://images.unsplash.com/photo-1560067174-c5a3a8f37060?auto=format&fit=crop&w=800&q=80",
    createdAt: new Date(),
  },
  {
    roomNumber: "202",
    name: "The Minimalist Single",
    type: "Single",
    capacity: 1,
    price: 42,
    isAvailable: true,
    description: "Stripped back and distraction-free. A calming zen-like single unit tailored for deep rest.",
    amenities: ["WiFi", "Single Bed", "Minimalist Desk", "Soundproof"],
    photoUrl: "https://images.unsplash.com/photo-1598928506311-c55dd12cb071?auto=format&fit=crop&w=800&q=80",
    createdAt: new Date(),
  },
  {
    roomNumber: "203",
    name: "The Horizon Suite",
    type: "Double",
    capacity: 2,
    price: 48,
    isAvailable: true,
    description: "A premium suite-style double featuring a mini lounge area within the room and panoramic corner windows.",
    amenities: ["WiFi", "2 Twin Beds", "Lounge Area", "Panoramic Windows", "Ensuite Bathroom"],
    photoUrl: "https://images.unsplash.com/photo-1574643034914-72212d2ad31a?auto=format&fit=crop&w=800&q=80",
    createdAt: new Date(),
  },
  {
    roomNumber: "301",
    name: "The Quiet Corner Triple",
    type: "Triple",
    capacity: 3,
    price: 26,
    isAvailable: true,
    description: "Tucked away from the main hallways, this triple is extremely quiet and features a large floor plan.",
    amenities: ["WiFi", "3 Twin Beds", "Quiet Zone", "Study Desks"],
    photoUrl: "https://images.unsplash.com/photo-1555636222-cae831e670b3?auto=format&fit=crop&w=800&q=80",
    createdAt: new Date(),
  },
  {
    roomNumber: "302",
    name: "The Creative Double",
    type: "Double",
    capacity: 2,
    price: 36,
    isAvailable: true,
    description: "Inspiring and well-lit. Features a creative chalkboard wall and plenty of modular physical storage.",
    amenities: ["WiFi", "2 Twin Beds", "Chalkboard Wall", "Modular Storage"],
    photoUrl: "https://images.unsplash.com/photo-1590490359854-df0aab82b1dd?auto=format&fit=crop&w=800&q=80",
    createdAt: new Date(),
  },
  {
    roomNumber: "303",
    name: "The Core Single",
    type: "Single",
    capacity: 1,
    price: 40,
    isAvailable: true,
    description: "Our reliably balanced single offering near the central courtyard. Perfect accessibility to all campus amenities.",
    amenities: ["WiFi", "Single Bed", "Courtyard View", "Easy Access"],
    photoUrl: "https://images.unsplash.com/photo-1536254425425-4c6e949ff4b5?auto=format&fit=crop&w=800&q=80",
    createdAt: new Date(),
  }
];

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
      console.error("No MONGO_URI found in .env");
      process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB.');
    const db = client.db('hostelbloom'); // Assume default DB, or it grabs from URI

    console.log('Clearing existing rooms...');
    await db.collection('rooms').deleteMany({});

    console.log(`Inserting exactly ${rooms.length} modern rooms...`);
    await db.collection('rooms').insertMany(rooms);

    console.log('Room seeding successful!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.close();
  }
}

seed();
