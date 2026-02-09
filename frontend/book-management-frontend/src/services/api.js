import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// BOOK APIs
export const getBooks = () => API.get('/books');
export const getBookById = (id) => API.get(`/books/${id}`);
export const createBook = (data) => API.post('/books', data);
export const updateBook = (id, data) => API.put(`/books/${id}`, data);
export const deleteBook = (id) => API.delete(`/books/${id}`);

// BOOK + NOTES (JOIN)
export const getBookWithNotes = (id) =>
  API.get(`/books/${id}/details`);

// SEARCH & FILTER
export const searchBooks = (q, category) =>
  API.get(`/books/search?q=${q}&category=${category}`);

// NOTES
export const addNote = (bookId, data) =>
  API.post(`/books/${bookId}/notes`, data);

export const deleteNote = (noteId) =>
  API.delete(`/notes/${noteId}`);

export default API;
