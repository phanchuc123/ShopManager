const {add_to_cart, getCartbyUser, delete_item} = require('../controllers/cart.controller');
const express = require('express');
const router = express.Router();

router.post('/add', add_to_cart);
router.get('/getcartbyuser/:user_id', getCartbyUser);
router.delete('/delete/:item_id', delete_item);

module.exports = router;