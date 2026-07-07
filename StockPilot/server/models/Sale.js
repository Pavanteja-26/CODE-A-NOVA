const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    product:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantitySold: { type: Number, required: true, min: 1 },
    saleDate:     { type: Date, default: Date.now },
    totalAmount:  { type: Number, required: true, min: 0 },
    customerName: { type: String, default: 'Walk-in Customer', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
