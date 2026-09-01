const express = require('express');
const router = express.Router();
const { getDB, saveDB } = require('../utils/db');
const { authenticateToken, requireAuth } = require('../middleware/auth');

// Create Order (Requires Logged in Customer)
router.post('/', authenticateToken, requireAuth, (req, res) => {
  const { items, deliveryAddress, customerPhone, paymentMethod } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart items are required to place an order.' });
  }

  const db = getDB();
  const user = db.users.find(u => u.id === req.user.id) || req.user;

  let subtotal = 0;
  const processedItems = items.map(item => {
    const product = db.products.find(p => p.id === item.productId || p.id === item.id);
    const price = product ? product.price : (item.price || 100);
    const quantity = item.quantity || 1;
    subtotal += price * quantity;

    // Deduct stock if available
    if (product && product.stock >= quantity) {
      product.stock -= quantity;
    }

    return {
      productId: product ? product.id : item.id,
      title: product ? product.title : item.title,
      price: price,
      quantity: quantity,
      potterId: product ? product.potterId : (item.potterId || "usr_potter_1"),
      image: product ? product.image : (item.image || "")
    };
  });

  const shippingFee = subtotal > 1000 ? 0 : 50;
  const totalAmount = subtotal + shippingFee;

  const newOrder = {
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    customerId: req.user.id,
    customerName: user.name,
    customerEmail: user.email,
    customerPhone: customerPhone || user.phone || "+91 9876543210",
    deliveryAddress: deliveryAddress || user.address || "Standard Address",
    items: processedItems,
    subtotal,
    shipping: shippingFee,
    totalAmount,
    status: "Processing", // Pending, Processing, Shipped, Delivered, Cancelled
    paymentMethod: paymentMethod || "UPI / Online Payment",
    paymentStatus: "Paid",
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  saveDB(db);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    order: newOrder
  });
});

// Get Orders (Role filtered)
router.get('/', authenticateToken, requireAuth, (req, res) => {
  const db = getDB();
  let orders = db.orders || [];

  if (req.user.role === 'admin') {
    // Admin sees all orders
    return res.json({ success: true, count: orders.length, orders });
  }

  if (req.user.role === 'potter') {
    // Potter sees orders containing items from their workshop
    const potterOrders = orders.filter(order => 
      order.items.some(item => item.potterId === req.user.id)
    );
    return res.json({ success: true, count: potterOrders.length, orders: potterOrders });
  }

  // Customer sees their own orders
  const userOrders = orders.filter(order => order.customerId === req.user.id);
  res.json({ success: true, count: userOrders.length, orders: userOrders });
});

// Get Single Order
router.get('/:id', authenticateToken, requireAuth, (req, res) => {
  const db = getDB();
  const order = (db.orders || []).find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  res.json({ success: true, order });
});

// Update Order Status (Potter or Admin)
router.patch('/:id/status', authenticateToken, requireAuth, (req, res) => {
  if (req.user.role !== 'potter' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only potters and admins can update order status.' });
  }

  const { status, deliveryAddress } = req.body;
  const db = getDB();
  const orderIndex = db.orders.findIndex(o => o.id === req.params.id);

  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const order = db.orders[orderIndex];

  if (status) {
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
    order.status = status;
  }

  if (deliveryAddress && req.user.role === 'admin') {
    order.deliveryAddress = deliveryAddress;
  }

  order.updatedAt = new Date().toISOString();
  db.orders[orderIndex] = order;
  saveDB(db);

  res.json({
    success: true,
    message: `Order ${order.id} status updated to '${order.status}'!`,
    order
  });
});

module.exports = router;
