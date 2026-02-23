const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedProperties = require('./scripts/seed');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => res.send('OK'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/analytics', require('./routes/analytics'));

let mongoServer;

const connectDB = async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('Connected to In-Memory MongoDB');
};

const startServer = async () => {
    await connectDB();
    await seedProperties();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

if (process.env.NODE_ENV !== 'test') {
    startServer().catch(err => console.error(err));
}

module.exports = { app, connectDB, mongoServer };
