const express = require('express');
const router = express.Router();
const { getDB, saveDB } = require('../utils/db');
const { authenticateToken, requireAuth } = require('../middleware/auth');

// Get all products (with optional filtering)
router.get('/', (req, res) => {
  const { category, search, potterId, featured } = req.query;
  const db = getDB();
  let products = db.products || [];

  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }

  if (potterId) {
    products = products.filter(p => p.potterId === potterId);
  }

  if (featured === 'true') {
    products = products.filter(p => p.isFeatured);
  }

  if (search) {
    const query = search.toLowerCase();
    products = products.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.potterName.toLowerCase().includes(query)
    );
  }

  res.json({
    success: true,
    count: products.length,
    products
  });
});

// Get single product
router.get('/:id', (req, res) => {
  const db = getDB();
  const product = (db.products || []).find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  res.json({ success: true, product });
});

// Add new product (Potter or Admin)
router.post('/', authenticateToken, requireAuth, (req, res) => {
  if (req.user.role !== 'potter' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only registered potters and admins can add products.' });
  }

  const { title, category, price, originalPrice, stock, image, description, isFeatured } = req.body;

  if (!title || !price || !category) {
    return res.status(400).json({ success: false, message: 'Title, price, and category are required.' });
  }

  const db = getDB();
  const potterUser = db.users.find(u => u.id === req.user.id) || req.user;

  const newProduct = {
    id: `prod_${Date.now()}`,
    title,
    category: category.toLowerCase(),
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.25),
    stock: stock ? Number(stock) : 10,
    potterId: req.user.id,
    potterName: potterUser.name,
    workshopName: potterUser.workshopName || "Artisan Clay Workshop",
    image: image || "src/assets/images/claypots.webp",
    description: description || "Handcrafted traditional Indian pottery made with 100% natural clay.",
    rating: 5.0,
    reviewsCount: 1,
    isFeatured: Boolean(isFeatured),
    createdAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);
  saveDB(db);

  res.status(201).json({
    success: true,
    message: 'Product listed successfully!',
    product: newProduct
  });
});

// Update product (Potter owner or Admin)
router.put('/:id', authenticateToken, requireAuth, (req, res) => {
  const db = getDB();
  const index = db.products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const product = db.products[index];

  if (req.user.role !== 'admin' && product.potterId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Permission denied. You can only update your own products.' });
  }

  const { title, category, price, originalPrice, stock, image, description, isFeatured } = req.body;

  if (title) product.title = title;
  if (category) product.category = category.toLowerCase();
  if (price !== undefined) product.price = Number(price);
  if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
  if (stock !== undefined) product.stock = Number(stock);
  if (image) product.image = image;
  if (description) product.description = description;
  if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);

  db.products[index] = product;
  saveDB(db);

  res.json({
    success: true,
    message: 'Product updated successfully!',
    product
  });
});

// Delete product
router.delete('/:id', authenticateToken, requireAuth, (req, res) => {
  const db = getDB();
  const product = db.products.find(p => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  if (req.user.role !== 'admin' && product.potterId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Permission denied.' });
  }

  db.products = db.products.filter(p => p.id !== req.params.id);
  saveDB(db);

  res.json({
    success: true,
    message: 'Product deleted successfully.'
  });
});

module.exports = router;
