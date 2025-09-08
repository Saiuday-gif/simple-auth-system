const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// Registration Route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function (err) {
            if (err) {
                // Check if the error is due to a unique constraint violation (email already exists)
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ success: false, message: 'Email already exists' });
                }
                console.error(err.message);
                return res.status(500).json({ success: false, message: 'Server error during registration' });
            }
            res.status(201).json({ success: true, message: 'Registration successful!' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Server error during login' });
        }
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.userId = user.id; // Store user ID in session
            return res.json({ success: true, message: 'Login successful' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
    });
});

// Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Could not log out' });
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.status(200).json({ success: true, message: 'Logout successful' });
    });
});

module.exports = router;
