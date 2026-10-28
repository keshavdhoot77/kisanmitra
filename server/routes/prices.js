const express = require('express');
const router = express.Router();
const { getReferencePrice, getDashboardPrices } = require('../controllers/priceController');

router.get('/reference', getReferencePrice);
router.get('/dashboard', getDashboardPrices);

module.exports = router;
