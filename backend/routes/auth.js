const express = require('express');
const router = express.Router();
const { getDB, saveDB } = require('../utils/db');
const { authenticateToken, requireAuth } = require('../middleware/auth');

// Register User
router.post('/register', (req, res) => {
  const { name, email, password, phone, role, address, workshopName, speciality, bio } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const db = getDB();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User with this email already exists.' });
  }

  const userRole = role === 'potter' ? 'potter' : 'customer';
  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password, // Demo auth
    role: userRole,
    phone: phone || '',
    address: address || '',
    workshopName: workshopName || (userRole === 'potter' ? `${name}'s Pottery` : undefined),
    speciality: speciality || '',
    bio: bio || '',
    isApproved: userRole === 'potter' ? false : true, // Potter accounts require admin approval unless pre-approved
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDB(db);

  const token = `${newUser.id}:${newUser.role}`;

  res.status(201).json({
    success: true,
    message: userRole === 'potter' 
      ? 'Potter account registered! Pending admin verification.' 
      : 'Account created successfully!',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      address: newUser.address,
      workshopName: newUser.workshopName,
      isApproved: newUser.isApproved
    }
  });
});

// Login User
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const db = getDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = `${user.id}:${user.role}`;

  res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      workshopName: user.workshopName || '',
      isApproved: user.isApproved
    }
  });
});

// Get Current User Profile
router.get('/me', authenticateToken, requireAuth, (req, res) => {
  const db = getDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      workshopName: user.workshopName || '',
      speciality: user.speciality || '',
      bio: user.bio || '',
      isApproved: user.isApproved
    }
  });
});

module.exports = router;
