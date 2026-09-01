const express = require('express');
const router = express.Router();
const { getDB, saveDB } = require('../utils/db');
const { authenticateToken, requireAuth, requireRole } = require('../middleware/auth');

// Submit Potter Application (Public form on main website)
router.post('/', (req, res) => {
  const { name, email, phone, workshopName, location, speciality, experience, bio } = req.body;

  if (!name || !email || !phone || !workshopName) {
    return res.status(400).json({ success: false, message: 'Name, email, phone, and workshop name are required.' });
  }

  const db = getDB();

  const newApp = {
    id: `APP-${Math.floor(100 + Math.random() * 900)}`,
    name,
    email: email.toLowerCase(),
    phone,
    workshopName,
    location: location || 'India',
    speciality: speciality || 'Traditional Pottery',
    experience: experience || '1+ Year',
    bio: bio || 'Crafting handmade traditional clay products.',
    status: 'Pending', // Pending, Approved, Rejected
    submittedAt: new Date().toISOString()
  };

  db.potterApplications.unshift(newApp);
  saveDB(db);

  res.status(201).json({
    success: true,
    message: 'Your Potter Application has been submitted! Our Admin team will review and contact you shortly.',
    application: newApp
  });
});

// Get Applications (Admin only)
router.get('/', authenticateToken, requireAuth, requireRole('admin'), (req, res) => {
  const db = getDB();
  res.json({
    success: true,
    count: (db.potterApplications || []).length,
    applications: db.potterApplications || []
  });
});

// Approve / Reject Application (Admin only)
router.patch('/:id/status', authenticateToken, requireAuth, requireRole('admin'), (req, res) => {
  const { status } = req.body;
  if (!status || !['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status must be Approved or Rejected.' });
  }

  const db = getDB();
  const appIndex = db.potterApplications.findIndex(a => a.id === req.params.id);

  if (appIndex === -1) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  const app = db.potterApplications[appIndex];
  app.status = status;
  app.reviewedAt = new Date().toISOString();

  // If approved, create or promote a Potter User account automatically!
  if (status === 'Approved') {
    let existingUser = db.users.find(u => u.email.toLowerCase() === app.email.toLowerCase());
    if (existingUser) {
      existingUser.role = 'potter';
      existingUser.workshopName = app.workshopName;
      existingUser.location = app.location;
      existingUser.speciality = app.speciality;
      existingUser.isApproved = true;
    } else {
      const newPotterUser = {
        id: `usr_potter_${Date.now()}`,
        name: app.name,
        email: app.email.toLowerCase(),
        password: "potter123", // Default initial password
        role: "potter",
        workshopName: app.workshopName,
        location: app.location,
        phone: app.phone,
        speciality: app.speciality,
        bio: app.bio,
        isApproved: true,
        createdAt: new Date().toISOString()
      };
      db.users.push(newPotterUser);
    }
  }

  db.potterApplications[appIndex] = app;
  saveDB(db);

  res.json({
    success: true,
    message: `Application ${app.id} marked as ${status}. ${status === 'Approved' ? 'Potter seller account created (Login password: potter123).' : ''}`,
    application: app
  });
});

module.exports = router;
