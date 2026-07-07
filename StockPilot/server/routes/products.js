const express  = require('express');
const Product  = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes below require JWT
router.use(protect);

// ── GET /api/products/low-stock ───────────────────────────────────────────────
// Must be before /:id to avoid "low-stock" being treated as an ID
router.get('/low-stock', async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$quantity', '$reorderThreshold'] },
    }).populate('supplier', 'name contactEmail');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/products ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 50 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { SKU:  { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = { $regex: category, $options: 'i' };

    const products = await Product.find(query)
      .populate('supplier', 'name contactEmail')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/products ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'SKU already exists' });
    res.status(400).json({ message: err.message });
  }
});

// ── GET /api/products/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplier', 'name contactEmail');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/products/:id ─────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('supplier', 'name contactEmail');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE /api/products/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
