const Supplier = require('../models/supplierModel');

// Get all suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'asc' } = req.query;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { 'contact.email': { $regex: search, $options: 'i' } }
        ]
      };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const suppliers = await Supplier.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Supplier.countDocuments(query);

    res.json({
      suppliers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get supplier by ID
exports.getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create supplier
exports.createSupplier = async (req, res) => {
  try {
    const { name, contact } = req.body;
    
    // Validate required fields
    if (!name || !contact || !contact.email) {
      return res.status(400).json({ error: 'Name and contact email are required' });
    }

    // Check if email already exists
    const existingSupplier = await Supplier.findOne({ 'contact.email': contact.email.toLowerCase() });
    if (existingSupplier) {
      return res.status(400).json({ error: 'Supplier with this email already exists' });
    }

    const supplierData = {
      name: name.trim(),
      contact: {
        email: contact.email.toLowerCase().trim(),
        phone: contact.phone ? contact.phone.trim() : '',
        address: contact.address ? contact.address.trim() : ''
      }
    };

    const newSupplier = await Supplier.create(supplierData);
    res.status(201).json(newSupplier);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Supplier with this email already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
  try {
    const { name, contact } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (contact) {
      updateData.contact = {};
      if (contact.email) updateData.contact.email = contact.email.toLowerCase().trim();
      if (contact.phone !== undefined) updateData.contact.phone = contact.phone.trim();
      if (contact.address !== undefined) updateData.contact.address = contact.address.trim();
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json(updatedSupplier);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Supplier with this email already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
