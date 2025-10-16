const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);


productSchema.pre('save', async function(next) {
  if (!this.productId) {
    const last = await mongoose.model('Product').findOne().sort('-productId');
    this.productId = last ? last.productId + 1 : 1000;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);