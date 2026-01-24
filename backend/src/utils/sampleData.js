const roomSeed = [
  {
    roomNumber: '101',
    name: 'Aurora 101',
    type: 'Single',
    capacity: 1,
    price: 40,
    isAvailable: true,
    amenities: ['AC', 'WiFi', 'Study Desk'],
    photoUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
    description: 'Calm single room with natural light and minimalist decor.',
    rating: 4.8,
  },
  {
    roomNumber: '202',
    name: 'Lumen 202',
    type: 'Double',
    capacity: 2,
    price: 65,
    isAvailable: true,
    amenities: ['WiFi', 'Balcony', 'Wardrobe'],
    photoUrl: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353',
    description: 'Spacious double room ideal for roommates who value comfort.',
    rating: 4.6,
  },
  {
    roomNumber: '303',
    name: 'Velvet 303',
    type: 'Suite',
    capacity: 3,
    price: 95,
    isAvailable: true,
    amenities: ['AC', 'WiFi', 'Mini Fridge', 'Private Bath'],
    photoUrl: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353',
    description: 'Suite with lounge area and warm earthy palette for long stays.',
    rating: 4.9,
  },
];

const userSeed = [
  {
    name: 'Admin User',
    email: 'admin@hostelbloom.com',
    password: 'Admin@123',
    role: 'admin',
  },
];

module.exports = { roomSeed, userSeed };
