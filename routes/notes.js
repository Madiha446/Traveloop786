const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all notes for a trip
router.get('/:tripId', auth, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM trip_notes WHERE trip_id = ? ORDER BY created_at DESC', [req.params.tripId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a note
router.post('/:tripId', auth, async (req, res) => {
    const { content } = req.body;
    try {
        const [result] = await db.execute('INSERT INTO trip_notes (trip_id, content) VALUES (?, ?)', [req.params.tripId, content]);
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a note
router.delete('/:noteId', auth, async (req, res) => {
    try {
        await db.execute('DELETE FROM trip_notes WHERE id = ?', [req.params.noteId]);
        res.json({ message: 'Note deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;