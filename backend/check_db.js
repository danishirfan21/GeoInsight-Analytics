const mongoose = require('mongoose');
const Property = require('./models/Property');
require('dotenv').config();

async function check() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geoinsight');
    const count = await Property.countDocuments();
    console.log(`Current property count: ${count}`);
    const sample = await Property.findOne();
    console.log('Sample property:', JSON.stringify(sample, null, 2));
    process.exit(0);
}
check();
