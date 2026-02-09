const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');




// Middleware for filter and search
const { validateBook } = require('../middleware/validateBook');

router.post('/', validateBook, bookController.createBook);
router.put('/:id', validateBook, bookController.updateBook);





//create a book
router.post ('/', bookController.createBook);

//get all books
router.get('/', bookController.getAllBooks);


// get Book With Notes
//join is used here
router.get('/:id/details', bookController.getBookWithNotes);




//search and filter
router.get('/search', bookController.searchAndFilterBooks);




//get book by id
router.get('/:id', bookController.getBookById);

//update book
router.put('/:id', bookController.updateBook);

//Delete book
router.delete('/:id', bookController.deleteBook);

module.exports = router;