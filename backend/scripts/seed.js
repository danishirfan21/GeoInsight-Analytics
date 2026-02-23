const Property = require('../models/Property');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    // Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
        await User.create({
            username: 'admin',
            email: 'admin@geoinsight.com',
            password: 'admin123',
            role: 'Admin'
        });

        await User.create({
            username: 'viewer',
            email: 'viewer@geoinsight.com',
            password: 'viewer123',
            role: 'Viewer'
        });
        console.log('Users seeded');
    }

    // Seed Properties
    const count = await Property.countDocuments();
    if (count > 0) return;

    const regions = ['North', 'South', 'East', 'West', 'Central'];
    const types = ['Apartment', 'House', 'Condo', 'Townhouse'];
    const properties = [];

    for (let i = 0; i < 50; i++) {
        const region = regions[Math.floor(Math.random() * regions.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const price = Math.floor(Math.random() * 900000) + 100000;

        // Random coordinates around a center (e.g., London-ish)
        const lat = 51.5 + (Math.random() - 0.5) * 0.2;
        const lng = -0.1 + (Math.random() - 0.5) * 0.2;

        const date = new Date();
        date.setMonth(date.getMonth() - Math.floor(Math.random() * 12));

        properties.push({
            title: `${type} in ${region}`,
            type,
            price,
            region,
            coordinates: { lat, lng },
            listingDate: date,
            description: `A beautiful ${type.toLowerCase()} located in the ${region} region.`,
            amenities: ['Parking', 'Gym', 'Pool'].slice(0, Math.floor(Math.random() * 3) + 1)
        });
    }

    await Property.insertMany(properties);
    console.log('Database seeded with 50 properties');
};

module.exports = seedData;
