import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getBookWithNotes,
  addNote,
  deleteNote
} from '../services/api';

function BookDetails() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBookDetails = async () => {
    try {
      const response = await getBookWithNotes(id);
      setBook(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!noteText.trim()) {
      setError('Note cannot be empty');
      return;
    }

    try {
      await addNote(id, { note_text: noteText });
      setNoteText('');
      fetchBookDetails();
    } catch (err) {
      console.error(err);
      setError('Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;

    try {
      await deleteNote(noteId);
      fetchBookDetails();
    } catch (err) {
      console.error(err);
      setError('Failed to delete note');
    }
  };

  if (loading) {
    return <p>Loading book details...</p>;
  }

  if (!book) {
    return <p>Book not found.</p>;
  }

  return (
    <div>
      {/* Book Info */}
      <div className="card mb-4 p-4">
        <h2>{book.title}</h2>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Category:</strong> {book.category}</p>
        <p><strong>Description:</strong> {book.description}</p>
      </div>

      {/* Notes Section */}
      <div className="card p-4">
        <h4>Notes / Highlights</h4>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleAddNote} className="mb-3">
          <textarea
            className="form-control mb-2"
            rows="3"
            placeholder="Write an important note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          ></textarea>

          <button type="submit" className="btn btn-success">
            Add Note
          </button>
        </form>

        {book.notes.length === 0 ? (
          <p>No notes added yet.</p>
        ) : (
          <ul className="list-group">
            {book.notes.map((note) => (
              <li
                key={note.note_id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {note.note_text}
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteNote(note.note_id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BookDetails;
