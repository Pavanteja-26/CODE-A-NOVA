const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:             { type: String, required: true, trim: true },
    SKU:              { type: String, required: true, unique: true, uppercase: true, trim: true },
    category:         { type: String, required: true, trim: true },
    description:      { type: String, default: '' },
    quantity:         { type: Number, required: true, min: 0, default: 0 },
    unitPrice:        { type: Number, required: true, min: 0 },
    reorderThreshold: { type: Number, required: true, min: 0, default: 10 },
    supplier:         { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
  },
  { timestamps: true }
);

// Virtual: total stock value for this product
productSchema.virtual('stockValue').get(function () {
  return this.quantity * this.unitPrice;
});

module.exports = mongoose.model('Product', productSchema);
