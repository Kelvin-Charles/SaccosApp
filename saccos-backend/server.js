const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // your MySQL username
  password: '', // your MySQL password
  database: 'saccos'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// JWT Secret
const JWT_SECRET = 'your_jwt_secret';

// User Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) return res.status(500).send('Server error');
    if (result.length === 0) return res.status(400).send('User not found');

    const user = result[0];

    // Check password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) return res.status(400).send('Invalid password');

      // Generate JWT
      const token = jwt.sign({ id: user.id, role: user.role_id }, JWT_SECRET);
      res.json({ token });
    });
  });
});

// Protected Route Example (only for admins)
app.get('/admin', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).send('Token missing');

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token');
    
    if (decoded.role !== 'admin') return res.status(403).send('Access denied');

    res.send('Welcome Admin!');
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
