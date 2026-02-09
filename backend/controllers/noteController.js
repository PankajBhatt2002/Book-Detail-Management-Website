const db = require('../config/db');

// Add note
exports.addNote = (req, res) => {
    const { bookId } = req.params;
    const { note_text } = req.body;

    if (!note_text) {
        return res.status(400).json({ message: 'Note text is required' });
    }

    const sql = `
        INSERT INTO notes (book_id, note_text)
        VALUES (?, ?)
    `;

    db.query(sql, [bookId, note_text], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Note added successfully' });
    });
};

// Get notes by book
exports.getNotesByBook = (req, res) => {
    const { bookId } = req.params;

    const sql = `
        SELECT * FROM notes
        WHERE book_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [bookId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// Update note
exports.updateNote = (req, res) => {
    const { noteId } = req.params;
    const { note_text } = req.body;

    const sql = `
        UPDATE notes
        SET note_text = ?
        WHERE note_id = ?
    `;

    db.query(sql, [note_text, noteId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Note updated successfully' });
    });
};

// Delete note
exports.deleteNote = (req, res) => {
    const { noteId } = req.params;

    const sql = `
        DELETE FROM notes
        WHERE note_id = ?
    `;

    db.query(sql, [noteId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Note deleted successfully' });
    });
};
