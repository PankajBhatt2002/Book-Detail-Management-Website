const validateBook = (req, res, next) => {
    const { title, author } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Book title is required' });
    }

    if (!author || author.trim() === '') {
        return res.status(400).json({ message: 'Author name is required' });
    }

    next();
};

module.exports = { validateBook };
