const express = require('express');
const ContactMessage = require('../models/ContactMessage.js');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requestMap = new Map();

module.exports = (io) => {
  const router = express.Router();

  // POST contact form
  router.post('/', async (req, res) => {
    try {
      const {
        name,
        email,
        subject = '',
        service = '',
        budget = '',
        timeline = '',
        message,
        website = '', // honeypot field; should stay empty for humans
      } = req.body;

      if (website) {
        return res.status(400).json({ success: false, message: 'Invalid submission' });
      }

      const clientIp = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
      const now = Date.now();
      const lastRequestAt = requestMap.get(clientIp) || 0;
      if (now - lastRequestAt < 60000) {
        return res.status(429).json({ success: false, message: 'Please wait a minute before sending another message.' });
      }
      requestMap.set(clientIp, now);

      if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
      }

      if (String(message).trim().length < 15) {
        return res.status(400).json({ success: false, message: 'Message must be at least 15 characters' });
      }

      const newMessage = new ContactMessage({
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        subject: String(subject || '').trim(),
        service: String(service || '').trim(),
        budget: String(budget || '').trim(),
        timeline: String(timeline || '').trim(),
        message: String(message).trim(),
      });
      await newMessage.save();

      // Emit the new message to admin clients
      io.emit('newMessage', newMessage);

      res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  });

  return router;
};
