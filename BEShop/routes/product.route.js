const express = require('express');
const router = express.Router();
const { listProduct,detailproduct,getProductReviews,submitProductReview } = require('../controllers/product.controller');

router.get('/products', listProduct);
router.get('/products/:id', detailproduct);
router.get('/products/:id/reviews', getProductReviews);
router.post('/products/:id/reviews', submitProductReview);
module.exports = router;
