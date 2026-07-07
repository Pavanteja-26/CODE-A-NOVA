const express  = require('express');
const Supplier = require('../models/Supplier');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// ── GET /api/suppliers ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate('productsSupplied', 'name SKU')
      .sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/suppliers ───────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── GET /api/suppliers/:id ────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).populate('productsSupplied', 'name SKU unitPrice');
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/suppliers/:id ────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE /api/suppliers/:id ─────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
