const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.get('/orders', adminController.getOrders);
router.put('/orders/:order_id/status', adminController.updateOrder);
router.get('/feedbacks', adminController.getFeedbacks);
router.get('/users', adminController.getUsers);
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.addCategory);
router.delete('/categories/:id', adminController.removeCategory);
router.post('/products', adminController.addProduct);
router.put('/products/:id', adminController.editProduct);
router.delete('/products/:id', adminController.removeProduct);
router.get('/images', adminController.getImagesList);

module.exports = router;
