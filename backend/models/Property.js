const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    region: { type: String, required: true, index: true },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    listingDate: { type: Date, default: Date.now },
    description: String,
    amenities: [String]
}, { timestamps: true });

PropertySchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });

module.exports = mongoose.model('Property', PropertySchema);
