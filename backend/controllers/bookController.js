const db = require('../config/db');

//Create book
exports.createBook = (req, res) => {
    const { title, author, category, description } = req.body;

    if ( !title || !author){
        return res.status(400).json({message: 'Tilteand author are required'})
    }

    const sql = `
        INSERT INTO books (title, author, category, description)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [title, author, category, description], (err, result) => {
        if (err) {
            return res.status(500).json({error:err.message});
        }
        res.status(201).json({
            message: 'Book created successfully',
            bookId: result.insertId
        });
    });

};




//get all books
exports.getAllBooks = (req, res) => {
    const sql = 'SELECT * FROM books ORDER BY created_at DESC';

    db.query(sql, (err, results) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};



//get book by id
exports.getBookById = (req, res) => {

    const { id } = req.params;

    const sql = 'SELECT * FROM books where id = ?';

    db.query(sql, [id], (err, results) => {
        if(err) {
            return res.status(500).json({ error: err.message });

        }
        if (results.length == 0) {
            return res.status(404).json({ message: 'Book not found'});

        }
        res.json(results[0]);
    });
};


//update book
exports.updateBook = (req, res) => {
    const { id } = req.params;
    const { title, author, category, description } = req.body;

    const sql = ` 
        UPDATE books
        SET title = ?, author = ?, category = ?, description = ?
        WHERE book_id = ?
    `;

    db.query(sql, [title, author, category, description, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });

        }
        res.json({ message: 'Book updated successfully' });
    });
};


//delete book
exports.deleteBook = (req, res) => {
    const { id } = req.params

    const sql = `DELETE FROM books WHERE book_id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });

        }
        res.json({ message: 'Book deleted successfully' });
    });
};






//to fetch book with notes
exports.getBookWithNotes = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT 
            b.book_id,
            b.title,
            b.author,
            b.category,
            b.description,
            b.created_at,
            n.note_id,
            n.note_text,
            n.created_at AS note_created_at
        FROM books b
        LEFT JOIN notes n
        ON b.book_id = n.book_id
        WHERE b.book_id = ?;
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Format response
        const book = {
            book_id: results[0].book_id,
            title: results[0].title,
            author: results[0].author,
            category: results[0].category,
            description: results[0].description,
            created_at: results[0].created_at,
            notes: []
        };

        results.forEach(row => {
            if (row.note_id) {
                book.notes.push({
                    note_id: row.note_id,
                    note_text: row.note_text,
                    created_at: row.note_created_at
                });
            }
        });

        res.json(book);
    });
};



//Seaarch and filter
exports.searchAndFilterBooks = (req, res) => {
    const { q, category } = req.query;

    let sql = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    // Search by title or author
    if (q) {
        sql += ' AND (title LIKE ? OR author LIKE ?)';
        params.push(`%${q}%`, `%${q}%`);
    }

    // Filter by category
    if (category) {
        sql += ' AND category = ?';
        params.push(category);
    }

    sql += ' ORDER BY created_at DESC';

    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};
