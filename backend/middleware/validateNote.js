exports.validateNote = (req, res, next) => {
    const { note_text } = req.body;

    if (!note_text || note_text.trim() === '') {
        return res.status(400).json({
            message: 'Note text is required'
        });
    }

    next();
};
