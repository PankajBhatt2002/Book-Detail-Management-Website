import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getBooks,
  deleteBook,
  searchBooks
} from '../services/api';

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('');

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Search & filter
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await searchBooks(searchText, category);
      setBooks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const handleReset = () => {
    setSearchText('');
    setCategory('');
    fetchBooks();
  };

  // Delete book
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await deleteBook(id);
      fetchBooks();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading books...</p>;
  }

  return (
    <div>
      <h2 className="mb-3">Book List</h2>

      {/* 🔍 Search & Filter UI */}
      <div className="card p-3 mb-4">
        <div className="row g-2">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title or author"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="col-md-5">
            <button
              className="btn btn-primary me-2"
              onClick={handleSearch}
            >
              Search
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* 📋 Book Table */}
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th style={{ width: '220px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.book_id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>
                  <Link
                    to={`/books/${book.book_id}`}
                    className="btn btn-sm btn-primary me-2"
                  >
                    View
                  </Link>

                  <Link
                    to={`/edit/${book.book_id}`}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Edit
                  </Link>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(book.book_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Home;
