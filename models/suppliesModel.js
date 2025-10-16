const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String } // email or phone
});

module.exports = mongoose.model('Supply', supplySchema);
