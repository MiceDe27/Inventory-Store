const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  contact: {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  }
}, { 
  timestamps: true 
});

// Index for better query performance
supplierSchema.index({ name: 1 });
supplierSchema.index({ 'contact.email': 1 });

module.exports = mongoose.model('Supplier', supplierSchema);
