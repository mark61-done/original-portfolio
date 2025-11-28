// middleware/auth.js - MINIMAL VERSION
const jwt = require('jsonwebtoken');
const User = require('../models/User');

console.log('🔄 LOADED: auth.js middleware file');

const auth = async (req, res, next) => {
  console.log('🔄 Auth middleware executing for:', req.url);
  
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ No token found');
      return res.status(401).json({ message: 'No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ message: 'Invalid user' });
    }

    req.user = user;
    console.log('✅ Auth success for user:', user.username);
    next();
  } catch (error) {
    console.log('❌ Auth error:', error.message);
    return res.status(401).json({ message: 'Auth failed' });
  }
};

const adminAuth = (req, res, next) => {
  console.log('🔄 AdminAuth middleware executing');
  
  if (!req.user) {
    console.log('❌ No user in adminAuth');
    return res.status(401).json({ message: 'No user' });
  }

  if (req.user.role !== 'admin') {
    console.log('❌ User not admin:', req.user.role);
    return res.status(403).json({ message: 'Not admin' });
  }

  console.log('✅ AdminAuth success');
  next();
};

module.exports = { auth, adminAuth };