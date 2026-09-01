const express = require('express');
const router = express.Router();
const { getDB, saveDB } = require('../utils/db');
const { authenticateToken, requireAuth, requireRole } = require('../middleware/auth');

// Submit Complaint / Contact Inquiry (Public)
router.post('/', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }

  const db = getDB();
  const newComplaint = {
    id: `CMP-${Math.floor(100 + Math.random() * 900)}`,
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    subject: subject || 'General Inquiry',
    message,
    status: 'Open', // Open, Resolved
    response: '',
    submittedAt: new Date().toISOString()
  };

  db.complaints.unshift(newComplaint);
  saveDB(db);

  res.status(201).json({
    success: true,
    message: 'Thank you! Your message has been submitted. Our support team will get back to you shortly.',
    complaint: newComplaint
  });
});

// Get Complaints (Admin only)
router.get('/', authenticateToken, requireAuth, requireRole('admin'), (req, res) => {
  const db = getDB();
  res.json({
    success: true,
    count: (db.complaints || []).length,
    complaints: db.complaints || []
  });
});

// Resolve Complaint (Admin only)
router.patch('/:id/resolve', authenticateToken, requireAuth, requireRole('admin'), (req, res) => {
  const { response } = req.body;
  const db = getDB();
  const index = db.complaints.findIndex(c => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Complaint not found.' });
  }

  const complaint = db.complaints[index];
  complaint.status = 'Resolved';
  complaint.response = response || 'Resolved by support team.';
  complaint.resolvedAt = new Date().toISOString();

  db.complaints[index] = complaint;
  saveDB(db);

  res.json({
    success: true,
    message: `Complaint ${complaint.id} resolved!`,
    complaint
  });
});

module.exports = router;
