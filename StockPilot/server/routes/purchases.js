const express  = require('express');
const Purchase = require('../models/Purchase');
const Product  = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// ── GET /api/purchases ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('product',  'name SKU')
      .populate('supplier', 'name contactEmail')
      .sort({ purchaseDate: -1 })
      .limit(200);
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/purchases ───────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { product: productId, supplier, quantityPurchased, totalCost, purchaseDate } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const purchase = await Purchase.create({
      product: productId,
      supplier,
      quantityPurchased,
      totalCost,
      purchaseDate: purchaseDate || Date.now(),
    });

    // Increment product stock
    product.quantity += quantityPurchased;
    await product.save();

    await purchase.populate([
      { path: 'product',  select: 'name SKU' },
      { path: 'supplier', select: 'name contactEmail' },
    ]);

    res.status(201).json(purchase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
