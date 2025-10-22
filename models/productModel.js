const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    uppercase: true
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  stock: { 
    type: Number, 
    required: true,
    min: 0,
    default: 0
  }
}, { 
  timestamps: true 
});

// Index for better query performance
productSchema.index({ name: 1 });

module.exports = mongoose.model('Product', productSchema);
