const express = require('express');
const Sale    = require('../models/Sale');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// ── GET /api/sales/summary ────────────────────────────────────────────────────
// Must be before /:id
router.get('/summary', async (req, res) => {
  try {
    const now   = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo  = new Date(today); weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date(today); monthAgo.setDate(today.getDate() - 30);

    const aggregate = async (from) =>
      Sale.aggregate([
        { $match: { saleDate: { $gte: from } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      ]);

    const [daily, weekly, monthly] = await Promise.all([
      aggregate(today),
      aggregate(weekAgo),
      aggregate(monthAgo),
    ]);

    // Last 30 days day-by-day for the chart
    const chartData = await Sale.aggregate([
      { $match: { saleDate: { $gte: monthAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$saleDate' } },
          revenue: { $sum: '$totalAmount' },
          orders:  { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      daily:   daily[0]   || { total: 0, count: 0 },
      weekly:  weekly[0]  || { total: 0, count: 0 },
      monthly: monthly[0] || { total: 0, count: 0 },
      chartData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/sales ────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('product', 'name SKU unitPrice')
      .sort({ saleDate: -1 })
      .limit(200);
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/sales ───────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { product: productId, quantitySold, customerName } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.quantity < quantitySold) {
      return res.status(400).json({ message: `Insufficient stock. Available: ${product.quantity}` });
    }

    const totalAmount = product.unitPrice * quantitySold;

    const sale = await Sale.create({
      product: productId,
      quantitySold,
      totalAmount,
      customerName,
      saleDate: req.body.saleDate || Date.now(),
    });

    // Decrement product stock
    product.quantity -= quantitySold;
    await product.save();

    await sale.populate('product', 'name SKU unitPrice');
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
