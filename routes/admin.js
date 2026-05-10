const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden. Admin access required.' });
    }
    try {
        const [[{ totalUsers }]] = await db.execute('SELECT COUNT(*) as totalUsers FROM users');
        const [[{ totalTrips }]] = await db.execute('SELECT COUNT(*) as totalTrips FROM trips');
        const [popularCities] = await db.execute(`
            SELECT city_name, COUNT(*) as visits 
            FROM stops 
            GROUP BY city_name 
            ORDER BY visits DESC 
            LIMIT 5
        `);
        res.json({ users: totalUsers, trips: totalTrips, popularCities });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;