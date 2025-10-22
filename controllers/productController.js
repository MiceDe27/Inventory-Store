const Product = require('../models/productModel');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'asc' } = req.query;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product by ID
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product by SKU
exports.getProductBySku = async (req, res) => {
  try {
    const product = await Product.findOne({ sku: req.params.sku.toUpperCase() });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { sku, name, price, stock } = req.body;
    
    // Validate required fields
    if (!sku || !name || price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'SKU, name, price, and stock are required' });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product with this SKU already exists' });
    }

    const productData = {
      sku: sku.toUpperCase(),
      name: name.trim(),
      price: parseFloat(price),
      stock: parseInt(stock)
    };

    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Product with this SKU already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { sku, name, price, stock } = req.body;
    
    const updateData = {};
    if (sku) updateData.sku = sku.toUpperCase();
    if (name) updateData.name = name.trim();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Product with this SKU already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product stock
exports.updateStock = async (req, res) => {
  try {
    const { operation, quantity } = req.body;
    
    if (!operation || !quantity) {
      return res.status(400).json({ error: 'Operation and quantity are required' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let newStock;
    switch (operation.toLowerCase()) {
      case 'add':
        newStock = product.stock + parseInt(quantity);
        break;
      case 'subtract':
        newStock = product.stock - parseInt(quantity);
        if (newStock < 0) {
          return res.status(400).json({ error: 'Insufficient stock' });
        }
        break;
      case 'set':
        newStock = parseInt(quantity);
        break;
      default:
        return res.status(400).json({ error: 'Invalid operation. Use add, subtract, or set' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: newStock },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
