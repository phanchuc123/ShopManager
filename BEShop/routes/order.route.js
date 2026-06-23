const express = require("express");
const router = express.Router();
const {placeOrder,orderDetail} = require("../controllers/order.controller");

router.post("/order",placeOrder);
router.get("/order/:order_id",orderDetail);

module.exports = router;