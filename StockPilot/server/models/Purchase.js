const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    product:           { type: mongoose.Schema.Types.ObjectId, ref: 'Product',  required: true },
    supplier:          { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    quantityPurchased: { type: Number, required: true, min: 1 },
    purchaseDate:      { type: Date, default: Date.now },
    totalCost:         { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Purchase', purchaseSchema);
