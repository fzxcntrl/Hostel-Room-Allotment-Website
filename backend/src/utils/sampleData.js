const roomSeed = [
  {
    name: 'Aurora 101',
    type: 'Single',
    capacity: 1,
    pricePerNight: 40,
    status: 'Available',
    amenities: ['AC', 'WiFi', 'Study Desk'],
    photoUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
    description: 'Calm single room with natural light and minimalist decor.',
    floor: 1,
    wing: 'North',
    rating: 4.8,
  },
  {
    name: 'Lumen 202',
    type: 'Double',
    capacity: 2,
    pricePerNight: 65,
    status: 'Available',
    amenities: ['WiFi', 'Balcony', 'Wardrobe'],
    photoUrl: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353',
    description: 'Spacious double room ideal for roommates who value comfort.',
    floor: 2,
    wing: 'East',
    rating: 4.6,
  },
  {
    name: 'Velvet 303',
    type: 'Suite',
    capacity: 3,
    pricePerNight: 95,
    status: 'Available',
    amenities: ['AC', 'WiFi', 'Mini Fridge', 'Private Bath'],
    photoUrl: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353',
    description: 'Suite with lounge area and warm earthy palette for long stays.',
    floor: 3,
    wing: 'South',
    rating: 4.9,
  },
];

const userSeed = [
  {
    fullName: 'Admin User',
    email: 'admin@hostelify.com',
    password: 'Admin@123',
    role: 'admin',
  },
];

module.exports = { roomSeed, userSeed };
