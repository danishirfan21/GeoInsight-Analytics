const express = require('express');
const Property = require('../models/Property');
const { auth } = require('../middleware/auth');
const { Transform } = require('json2csv');
const router = express.Router();

const buildQuery = (queryParams) => {
    const { region, type, minPrice, maxPrice } = queryParams;
    let query = {};
    if (region) query.region = region;
    if (type) query.type = type;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    return query;
};

router.get('/', auth, async (req, res) => {
    try {
        const query = buildQuery(req.query);
        const properties = await Property.find(query).limit(2000);
        res.json(properties);
    } catch (err) {
        console.error('Fetch properties error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/export', auth, async (req, res) => {
    try {
        const query = buildQuery(req.query);

        // Use a cursor to stream from MongoDB, limit to 5,000 as requested
        const cursor = Property.find(query).limit(5000).cursor();

        const fields = ['_id', 'title', 'type', 'price', 'region', 'coordinates.lat', 'coordinates.lng', 'listingDate'];
        const json2csv = new Transform({ fields }, { objectMode: true });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=geoinsight_export.csv');

        cursor.on('error', (err) => {
            console.error('Cursor error:', err);
            res.status(500).end();
        });

        json2csv.on('error', (err) => {
            console.error('json2csv error:', err);
            res.status(500).end();
        });

        cursor.pipe(json2csv).pipe(res);
    } catch (err) {
        console.error('Export properties error:', err);
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
