const express = require('express');
const Property = require('../models/Property');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Simple cache with TTL and periodic cleanup to prevent memory leaks
let cache = new Map();
const CACHE_DURATION = 60 * 1000; // 1 minute

const cleanupCache = () => {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
            cache.delete(key);
        }
    }
};

// Cleanup every 5 minutes
setInterval(cleanupCache, 5 * 60 * 1000);

const getCachedData = (key) => {
    const cached = cache.get(key);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        return cached.data;
    }
    if (cached) cache.delete(key); // Cleanup expired on access
    return null;
};

const setCachedData = (key, data) => {
    cache.set(key, { data, timestamp: Date.now() });
};

const buildQuery = (query) => {
    const filter = {};
    if (query.region) filter.region = query.region;
    if (query.type) filter.type = query.type;
    if (query.minPrice || query.maxPrice) {
        filter.price = {};
        if (query.minPrice) filter.price.$gte = Number(query.minPrice);
        if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }
    return filter;
};

router.get('/price-trends', auth, async (req, res) => {
    const filter = buildQuery(req.query);
    const cacheKey = `price-trends-${JSON.stringify(filter)}`;
    const cached = getCachedData(cacheKey);
    if (cached) return res.json(cached);

    try {
        const trends = await Property.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$listingDate" } },
                    avgPrice: { $avg: "$price" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
        setCachedData(cacheKey, trends);
        res.json(trends);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/region-distribution', auth, async (req, res) => {
    const filter = buildQuery(req.query);
    const cacheKey = `region-distribution-${JSON.stringify(filter)}`;
    const cached = getCachedData(cacheKey);
    if (cached) return res.json(cached);

    try {
        const distribution = await Property.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$region",
                    count: { $sum: 1 },
                    avgPrice: { $avg: "$price" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
        setCachedData(cacheKey, distribution);
        res.json(distribution);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/admin-stats', auth, authorize('Admin'), async (req, res) => {
    const filter = buildQuery(req.query);
    const cacheKey = `admin-stats-${JSON.stringify(filter)}`;
    const cached = getCachedData(cacheKey);
    if (cached) return res.json(cached);

    try {
        const stats = await Property.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$region",
                    count: { $sum: 1 },
                    avgPrice: { $avg: "$price" },
                    totalVolume: { $sum: "$price" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
        setCachedData(cacheKey, stats);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/property-type-distribution', auth, async (req, res) => {
    const filter = buildQuery(req.query);
    try {
        const distribution = await Property.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(distribution);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
