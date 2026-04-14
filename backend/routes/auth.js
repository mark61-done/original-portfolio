const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

const buildAuthResponse = (user) => {
  const token = jwt.sign(
    { userId: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      role: user.role
    }
  };
};

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access only' });
    }

    res.json({ ...buildAuthResponse(user), message: 'Login successful' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, password, confirmPassword, setupKey } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const existingAdminCount = await User.countDocuments({ role: 'admin' });
    const hasSetupKey = Boolean(process.env.ADMIN_SETUP_KEY);
    const isAuthorizedBySetupKey = hasSetupKey && setupKey === process.env.ADMIN_SETUP_KEY;

    // Lock registration to owner: only the first admin is open by default.
    // Any additional admin creation requires ADMIN_SETUP_KEY.
    if (existingAdminCount > 0 && hasSetupKey && !isAuthorizedBySetupKey) {
      return res.status(403).json({
        success: false,
        message: 'Admin registration is locked. Provide a valid setup key.'
      });
    }

    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Username already exists' });
    }

    const user = await User.create({
      username: username.trim(),
      password,
      role: 'admin'
    });

    res.status(201).json({ ...buildAuthResponse(user), message: 'Admin account created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

router.get('/profile', auth, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

module.exports = router;
