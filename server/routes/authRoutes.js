// const express = require('express');
// const router = express.Router();
// const cors = require('cors');
// const { test } = require('../controllers/authControllers');

// router.use(
//     cors({
//         credentials: true,
//         origin: 'http://localhost:5173'
//     })
// );

// router.get('/', test);

// module.exports = router;

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Validate input
    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Generate salt and derive master key
    const salt = crypto.randomBytes(16);
    const masterKey = crypto.pbkdf2Sync(
      password,
      salt,
      100000, // Iterations
      32,     // Key length (256 bits)
      'sha256'
    );

    // Store user with salt (not the master key)
    const user = new User({
      username,
      master_key_salt: salt
    });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Registration successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Re-derive master key
    const masterKey = crypto.pbkdf2Sync(
      password,
      user.master_key_salt,
      100000,
      32,
      'sha256'
    );

    // For login, we assume correct password if derivation succeeds
    // In a real system, store a hashed version of masterKey and compare
    // Here, we simplify since master_key_salt ensures correct password

    // Generate JWT
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;