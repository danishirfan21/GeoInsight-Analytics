const Property = require('../models/Property');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const seedData = async () => {
    // Seed Users
    const adminUser = await User.findOne({ email: 'admin@geoinsight.com' });
    if (!adminUser) {
        await User.create({
            username: 'admin',
            email: 'admin@geoinsight.com',
            password: 'admin123',
            role: 'Admin'
        });
        console.log('Admin user seeded');
    }

    const viewerUser = await User.findOne({ email: 'viewer@geoinsight.com' });
    if (!viewerUser) {
        await User.create({
            username: 'viewer',
            email: 'viewer@geoinsight.com',
            password: 'viewer123',
            role: 'Viewer'
        });
        console.log('Viewer user seeded');
    }

    // Seed Properties
    const count = await Property.countDocuments();
    if (count > 0) {
        console.log(`Database already contains ${count} properties. Skipping seed.`);
        return;
    }

    const csvPath = path.join(__dirname, '../data/listings.csv');
    if (fs.existsSync(csvPath)) {
        console.log('Real listings data found. Importing...');
        const results = [];
        
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on('data', (data) => {
                    if (data.latitude && data.longitude && data.price && data.name) {
                        results.push({
                            title: data.name,
                            type: data.room_type || 'Property',
                            price: parseFloat(data.price.replace(/[$,]/g, '')) || 0,
                            region: data.neighbourhood || 'London',
                            coordinates: {
                                lat: parseFloat(data.latitude),
                                lng: parseFloat(data.longitude)
                            },
                            description: `A ${data.room_type} located in ${data.neighbourhood}. Host: ${data.host_name}.`,
                            amenities: ['Wifi', 'Kitchen', 'Heating'].slice(0, Math.floor(Math.random() * 3) + 1)
                        });
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });

        console.log(`Parsed ${results.length} properties. Inserting in batches...`);
        const batchSize = 1000;
        for (let i = 0; i < results.length; i += batchSize) {
            const batch = results.slice(i, i + batchSize);
            await Property.insertMany(batch);
        }
        console.log(`Database seeded with ${results.length} real properties from London`);
    } else {
        console.log('No CSV found. Seeding with sample data...');
        const regions = ['North', 'South', 'East', 'West', 'Central'];
        const types = ['Apartment', 'House', 'Condo', 'Townhouse'];
        const properties = [];

        for (let i = 0; i < 50; i++) {
            const region = regions[Math.floor(Math.random() * regions.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const price = Math.floor(Math.random() * 900000) + 100000;

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
        console.log('Database seeded with 50 sample properties');
    }
};

module.exports = seedData;
