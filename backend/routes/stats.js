const express = require('express');
const router = express.Router();
const { getDB } = require('../utils/db');
const { authenticateToken, requireAuth } = require('../middleware/auth');

// Potter Stats
router.get('/potter', authenticateToken, requireAuth, (req, res) => {
  if (req.user.role !== 'potter' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  const db = getDB();
  const potterId = req.user.id;

  const potterProducts = (db.products || []).filter(p => p.potterId === potterId);
  const potterOrders = (db.orders || []).filter(order => 
    order.items.some(item => item.potterId === potterId)
  );

  let totalSales = 0;
  let itemsSold = 0;

  potterOrders.forEach(order => {
    order.items.forEach(item => {
      if (item.potterId === potterId) {
        totalSales += item.price * item.quantity;
        itemsSold += item.quantity;
      }
    });
  });

  const lowStockCount = potterProducts.filter(p => p.stock <= 5).length;
  const pendingOrders = potterOrders.filter(o => o.status === 'Processing' || o.status === 'Pending').length;

  res.json({
    success: true,
    stats: {
      totalProducts: potterProducts.length,
      totalOrders: potterOrders.length,
      pendingOrders,
      totalSales,
      itemsSold,
      lowStockCount
    }
  });
});

// Admin Stats
router.get('/admin', authenticateToken, requireAuth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }

  const db = getDB();
  const totalPotters = (db.users || []).filter(u => u.role === 'potter').length;
  const totalCustomers = (db.users || []).filter(u => u.role === 'customer').length;
  const totalProducts = (db.products || []).length;
  const totalOrders = (db.orders || []).length;

  const totalRevenue = (db.orders || []).reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const pendingApplications = (db.potterApplications || []).filter(a => a.status === 'Pending').length;
  const openComplaints = (db.complaints || []).filter(c => c.status === 'Open').length;

  res.json({
    success: true,
    stats: {
      totalPotters,
      totalCustomers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingApplications,
      openComplaints
    }
  });
});

module.exports = router;
