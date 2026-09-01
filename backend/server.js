const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const potterAppRoutes = require('./routes/potterApplications');
const complaintRoutes = require('./routes/complaints');
const statsRoutes = require('./routes/stats');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Static fallback assets mapping
app.use('/src/assets/images', express.static(path.join(__dirname, '../frontend/images')));
app.use('/src/assets', express.static(path.join(__dirname, '../src/assets')));
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/potter-applications', potterAppRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/stats', statsRoutes);

// Legacy contact route fallback
app.use('/api/contact', complaintRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Kumbhar Bazar REST API Backend',
    timestamp: new Date().toISOString()
  });
});

// Single Page Application static fallback routing
app.get('/potter', (req, res) => {
  res.sendFile(path.join(frontendPath, 'potter.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(frontendPath, 'admin.html'));
});

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  } else {
    res.status(404).json({ success: false, message: 'API Endpoint not found' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🔥 KUMBHAR BAZAR BACKEND SERVER RUNNING AT: http://localhost:${PORT}`);
  console.log(`🛒 Main Web Marketplace:  http://localhost:${PORT}/index.html`);
  console.log(`🏺 Potter Seller Portal:  http://localhost:${PORT}/potter.html`);
  console.log(`👑 Admin Control Panel:   http://localhost:${PORT}/admin.html`);
  console.log(`=======================================================`);
});
