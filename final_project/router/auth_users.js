const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];  // Registered users stored here

// Check if username is already registered (returns boolean)
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Check if username and password match a registered user (returns boolean)
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Task 7: Login registered user, generate JWT, store in session
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, 'access', { expiresIn: '1h' });

  // Store JWT in session (assuming express-session middleware is configured)
  req.session.authorization = {
    accessToken: token,
    username: username
  };

  return res.status(200).json({ message: "User logged in successfully.", token });
});

// Task 8: Add or modify a book review by logged-in user
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization?.username;
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!username) {
    return res.status(401).json({ message: "User not logged in." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required as a query parameter." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: `Review for book ISBN ${isbn} by user ${username} added/updated successfully.` });
});
// Task 9: Delete a book review by the logged-in user
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization?.username;
    const isbn = req.params.isbn;
  
    if (!username) {
      return res.status(401).json({ message: "User not logged in." });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No review found by this user for the given ISBN." });
    }
  
    // Delete the review for this user
    delete books[isbn].reviews[username];
  
    return res.status(200).json({ message: `Review by user ${username} for book ISBN ${isbn} deleted successfully.` });
  });
  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
