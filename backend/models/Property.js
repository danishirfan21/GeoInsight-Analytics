const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['Apartment', 'House', 'Condo', 'Townhouse'], required: true },
    price: { type: Number, required: true },
    region: { type: String, required: true },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    listingDate: { type: Date, default: Date.now },
    description: String,
    amenities: [String]
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);
