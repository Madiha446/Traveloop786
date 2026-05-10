const express = require('express');
const db = require('../db');
const router = express.Router();

// Get activities (optionally filter by city)
router.get('/', async (req, res) => {
    const { city } = req.query;
    let query = 'SELECT * FROM activities_master';
    const params = [];
    if (city) {
        query += ' WHERE city_name = ?';
        params.push(city);
    }
    try {
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;