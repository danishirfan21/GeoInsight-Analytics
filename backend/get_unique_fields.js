const mongoose = require('mongoose');
const Property = require('./models/Property');
require('dotenv').config();

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const regions = await Property.distinct('region');
    const types = await Property.distinct('type');
    const total = await Property.countDocuments();
    console.log('Total Count:', total);
    console.log('Unique Regions:', regions.slice(0, 10), '... total:', regions.length);
    console.log('Unique Types:', types);
    process.exit(0);
}
check();
