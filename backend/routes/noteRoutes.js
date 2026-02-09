const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');




// Middleware for filter and search
const { validateNote } = require('../middleware/validateNote');

router.post('/books/:bookId/notes', validateNote, noteController.addNote);
router.put('/notes/:noteId', validateNote, noteController.updateNote);







//Add note to a book
router.post('/books/:bookId/notes', noteController.addNote);


//get all notes of a book
router.get('/books/:bookId/notes', noteController.getNotesByBook);

//update a not 
router.put('/notes/:noteId', noteController.updateNote);

// Delete a note
router.delete('/notes/:noteId', noteController.deleteNote);

module.exports = router;