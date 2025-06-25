const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// Simulate async data retrieval by wrapping in Promise
const getBooksAsync = () => {
  return new Promise((resolve, reject) => {
    // Simulate delay with setTimeout
    setTimeout(() => {
      resolve(books);
    }, 100);
  });
};

const getBookByISBNAsync = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    }, 100);
  });
};

const getBooksByAuthorAsync = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filtered = Object.values(books).filter(book => book.author === author);
      if (filtered.length > 0) resolve(filtered);
      else reject("No books found by the given author");
    }, 100);
  });
};

const getBooksByTitleAsync = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filtered = Object.values(books).filter(book => book.title === title);
      if (filtered.length > 0) resolve(filtered);
      else reject("No books found with the given title");
    }, 100);
  });
};

// Task 10: Get all books asynchronously
public_users.get('/', async (req, res) => {
  try {
    const allBooks = await getBooksAsync();
    res.status(200).json(allBooks);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Task 11: Get book details by ISBN asynchronously
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const book = await getBookByISBNAsync(req.params.isbn);
    res.status(200).json(book);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// Task 12: Get books by author asynchronously
public_users.get('/author/:author', async (req, res) => {
  try {
    const booksByAuthor = await getBooksByAuthorAsync(req.params.author);
    res.status(200).json(booksByAuthor);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// Task 13: Get books by title asynchronously
public_users.get('/title/:title', async (req, res) => {
  try {
    const booksByTitle = await getBooksByTitleAsync(req.params.title);
    res.status(200).json(booksByTitle);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

module.exports.general = public_users;
