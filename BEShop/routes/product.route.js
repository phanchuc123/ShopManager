const express = require('express');
const router = express.Router();
const { listProduct,detailproduct } = require('../controllers/product.controller');

router.get('/products', listProduct);
router.get('/products/:id', detailproduct);
module.exports = router;
