const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Property = require('../models/Property');
require('dotenv').config();

const importData = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('MONGODB_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Clear existing properties
        await Property.deleteMany({});
        console.log('Cleared existing properties');

        const results = [];
        const filePath = path.join(__dirname, '../data/listings.csv');

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                // Map CSV fields to Property schema
                // According to the image, the fields are: id, name, host_id, host_name, neighbourhood, latitude, longitude, room_type, price
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
                        description: `A ${data.room_type} managed by ${data.host_name}.`,
                        amenities: []
                    });
                }
            })
            .on('end', async () => {
                console.log(`Parsed ${results.length} records. Inserting into database...`);
                
                // Insert in batches of 1000 to avoid memory issues
                const batchSize = 1000;
                for (let i = 0; i < results.length; i += batchSize) {
                    const batch = results.slice(i, i + batchSize);
                    await Property.insertMany(batch);
                    console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(results.length / batchSize)}`);
                }

                console.log('Data import complete!');
                mongoose.connection.close();
                process.exit(0);
            });
    } catch (err) {
        console.error('Error importing data:', err);
        process.exit(1);
    }
};

importData();
