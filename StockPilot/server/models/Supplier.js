const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    name:             { type: String, required: true, trim: true },
    contactEmail:     { type: String, required: true, lowercase: true, trim: true },
    contactPhone:     { type: String, default: '' },
    address:          { type: String, default: '' },
    productsSupplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Supplier', supplierSchema);
