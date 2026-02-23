const express = require('express');
const Property = require('../models/Property');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const { region, type, minPrice, maxPrice } = req.query;
        let query = {};
        if (region) query.region = region;
        if (type) query.type = type;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const properties = await Property.find(query);
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });
        res.json(property);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
