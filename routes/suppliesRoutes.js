const express = require('express');
const router = express.Router();
const suppliesController = require('../controllers/suppliesController');

router.get('/supplies', suppliesController.getAllSupplies);
router.post('/supplies', suppliesController.createSupply);
router.put('/supplies/:id', suppliesController.updateSupply);
router.delete('/supplies/:id', suppliesController.deleteSupply);

module.exports = router;
