import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookById, updateBook } from '../services/api';

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    description: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch book by ID
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await getBookById(id);
        setFormData({
          title: response.data.title || '',
          author: response.data.author || '',
          category: response.data.category || '',
          description: response.data.description || ''
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load book data');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.author) {
      setError('Title and Author are required');
      return;
    }

    try {
      await updateBook(id, formData);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to update book');
    }
  };

  if (loading) {
    return <p>Loading book data...</p>;
  }

  return (
    <div className="card p-4">
      <h2 className="mb-3">Edit Book</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title *</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Author *</label>
          <input
            type="text"
            name="author"
            className="form-control"
            value={formData.author}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">
          Update Book
        </button>
      </form>
    </div>
  );
}

export default EditBook;
