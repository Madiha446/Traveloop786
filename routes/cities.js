const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all distinct cities (from stops and activities_master)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT DISTINCT city_name, country, cost_index 
            FROM stops 
            UNION 
            SELECT DISTINCT city_name, 'Unknown' as country, 50 as cost_index 
            FROM activities_master 
            WHERE city_name IS NOT NULL
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;