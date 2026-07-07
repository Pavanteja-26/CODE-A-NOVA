const express  = require('express');
const Product  = require('../models/Product');
const Sale     = require('../models/Sale');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// ── GET /api/dashboard/stats ──────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const now   = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Run all queries in parallel
    const [
      products,
      lowStockCount,
      todaySalesAgg,
      monthSalesAgg,
      topSelling,
    ] = await Promise.all([
      Product.find({}, 'quantity unitPrice'),
      Product.countDocuments({ $expr: { $lte: ['$quantity', '$reorderThreshold'] } }),
      Sale.aggregate([
        { $match: { saleDate: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Sale.aggregate([
        { $match: { saleDate: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Sale.aggregate([
        { $group: { _id: '$product', totalSold: { $sum: '$quantitySold' }, revenue: { $sum: '$totalAmount' } } },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
        { $unwind: '$product' },
        { $project: { name: '$product.name', SKU: '$product.SKU', totalSold: 1, revenue: 1 } },
      ]),
    ]);

    const totalProducts  = products.length;
    const totalStockValue = products.reduce((acc, p) => acc + p.quantity * p.unitPrice, 0);
    const todaySales     = todaySalesAgg[0]?.total  || 0;
    const monthRevenue   = monthSalesAgg[0]?.total  || 0;

    res.json({
      totalProducts,
      totalStockValue: Number(totalStockValue.toFixed(2)),
      lowStockCount,
      todaySales:    Number(todaySales.toFixed(2)),
      monthRevenue:  Number(monthRevenue.toFixed(2)),
      topSelling,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
