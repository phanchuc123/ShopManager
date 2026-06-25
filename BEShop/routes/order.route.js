const express = require("express");
const router = express.Router();
const {placeOrder,orderDetail,getUserOrders} = require("../controllers/order.controller");

router.post("/order",placeOrder);
router.get("/order/:order_id",orderDetail);
router.get("/user/:user_id",getUserOrders);

module.exports = router;