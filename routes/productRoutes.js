const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Product routes
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProduct);
router.get('/products/sku/:sku', productController.getProductBySku);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.patch('/products/:id/stock', productController.updateStock);

module.exports = router;
