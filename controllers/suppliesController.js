const Supply = require('../models/supply');

exports.getAllSupplies = async (req, res) => {
  try {
    const supplies = await Supply.find();
    res.json(supplies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSupply = async (req, res) => {
  const supply = new Supply(req.body);
  try {
    const saved = await supply.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSupply = async (req, res) => {
  try {
    const updated = await Supply.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSupply = async (req, res) => {
  try {
    await Supply.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supply deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
