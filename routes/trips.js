const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all trips for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const [trips] = await db.execute('SELECT * FROM trips WHERE user_id = ? ORDER BY start_date DESC', [req.user.id]);
        for (let trip of trips) {
            const [stops] = await db.execute('SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index', [trip.id]);
            for (let stop of stops) {
                const [activities] = await db.execute(`
                    SELECT a.* FROM stop_activities sa
                    JOIN activities_master a ON sa.activity_id = a.id
                    WHERE sa.stop_id = ?
                `, [stop.id]);
                stop.activities = activities;
            }
            trip.stops = stops;
            const [checklist] = await db.execute('SELECT * FROM checklist_items WHERE trip_id = ?', [trip.id]);
            trip.checklist = checklist;
            const [notes] = await db.execute('SELECT * FROM trip_notes WHERE trip_id = ? ORDER BY created_at DESC', [trip.id]);
            trip.notes = notes;
        }
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new trip
router.post('/', auth, async (req, res) => {
    const { name, start_date, end_date, description, cover_photo } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO trips (user_id, name, start_date, end_date, description, cover_photo) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, name, start_date, end_date, description, cover_photo || '🏝️']
        );
        res.status(201).json({ id: result.insertId, message: 'Trip created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update trip
router.put('/:id', auth, async (req, res) => {
    const { name, start_date, end_date, description } = req.body;
    try {
        await db.execute('UPDATE trips SET name=?, start_date=?, end_date=?, description=? WHERE id=? AND user_id=?',
            [name, start_date, end_date, description, req.params.id, req.user.id]);
        res.json({ message: 'Trip updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete trip
router.delete('/:id', auth, async (req, res) => {
    try {
        await db.execute('DELETE FROM trips WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
        res.json({ message: 'Trip deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add stop to trip
router.post('/:tripId/stops', auth, async (req, res) => {
    const { city_name, country, cost_index, start_date, end_date, order_index } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO stops (trip_id, city_name, country, cost_index, start_date, end_date, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.params.tripId, city_name, country, cost_index, start_date, end_date, order_index || 0]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add activity to stop
router.post('/stops/:stopId/activities', auth, async (req, res) => {
    const { activity_id } = req.body;
    try {
        await db.execute('INSERT INTO stop_activities (stop_id, activity_id) VALUES (?, ?)', [req.params.stopId, activity_id]);
        res.status(201).json({ message: 'Activity added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove activity from stop
router.delete('/stops/:stopId/activities/:activityId', auth, async (req, res) => {
    try {
        await db.execute('DELETE FROM stop_activities WHERE stop_id=? AND activity_id=?', [req.params.stopId, req.params.activityId]);
        res.json({ message: 'Removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;