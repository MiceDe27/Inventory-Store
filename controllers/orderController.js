const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Supplier = require('../models/supplierModel');

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, supplierId, sortBy = 'orderDate', sortOrder = 'desc' } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (supplierId) query.supplierId = supplierId;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(query)
      .populate('supplierId', 'name contact.email')
      .populate('items.productId', 'sku name price')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get order by ID
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('supplierId', 'name contact.email contact.phone contact.address')
      .populate('items.productId', 'sku name price stock');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { items, supplierId } = req.body;
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }
    
    if (!supplierId) {
      return res.status(400).json({ error: 'Supplier ID is required' });
    }

    // Validate supplier exists
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(400).json({ error: 'Supplier not found' });
    }

    // Validate items and get current product prices
    const validatedItems = [];
    for (const item of items) {
      if (!item.productId || !item.qty || item.price === undefined) {
        return res.status(400).json({ error: 'Each item must have productId, qty, and price' });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product with ID ${item.productId} not found` });
      }

      validatedItems.push({
        productId: item.productId,
        qty: parseInt(item.qty),
        price: parseFloat(item.price)
      });
    }

    const orderData = {
      items: validatedItems,
      supplierId,
      status: 'pending'
    };

    const newOrder = await Order.create(orderData);
    const populatedOrder = await Order.findById(newOrder._id)
      .populate('supplierId', 'name contact.email')
      .populate('items.productId', 'sku name price');

    res.status(201).json(populatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { items, supplierId, status } = req.body;
    
    const updateData = {};
    
    if (items) {
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
      }

      // Validate items
      const validatedItems = [];
      for (const item of items) {
        if (!item.productId || !item.qty || item.price === undefined) {
          return res.status(400).json({ error: 'Each item must have productId, qty, and price' });
        }

        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(400).json({ error: `Product with ID ${item.productId} not found` });
        }

        validatedItems.push({
          productId: item.productId,
          qty: parseInt(item.qty),
          price: parseFloat(item.price)
        });
      }
      updateData.items = validatedItems;
    }

    if (supplierId) {
      const supplier = await Supplier.findById(supplierId);
      if (!supplier) {
        return res.status(400).json({ error: 'Supplier not found' });
      }
      updateData.supplierId = supplierId;
    }

    if (status) {
      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
      }
      updateData.status = status;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('supplierId', 'name contact.email')
      .populate('items.productId', 'sku name price');

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('supplierId', 'name contact.email')
      .populate('items.productId', 'sku name price');

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Process order (update stock when order is delivered)
exports.processOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'sku name price stock');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ error: 'Order must be delivered to process stock update' });
    }

    // Update stock for each product
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId._id,
        { $inc: { stock: item.qty } }
      );
    }

    res.json({ message: 'Order processed successfully. Stock updated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
