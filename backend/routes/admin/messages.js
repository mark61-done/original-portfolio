const express = require('express');
const router = express.Router();
const ContactMessage = require('../../models/ContactMessage');

// GET unread count (keep before /:id route)
router.get('/unread/count', async (req, res) => {
  try {
    const unreadCount = await ContactMessage.countDocuments({ read: false });
    res.json({ success: true, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch unread messages count' });
  }
});

// GET all messages
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// GET single message
router.get('/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message)
      return res.status(404).json({ success: false, message: 'Message not found' });

    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// MARK message as read
router.put('/:id/read', async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

    message.read = true;
    await message.save();

    res.json({ success: true, message: 'Message marked as read', data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
});

// DELETE message
router.delete('/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message)
      return res.status(404).json({ success: false, message: 'Message not found' });

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Deletion failed', error: error.message });
  }
});

module.exports = router;
