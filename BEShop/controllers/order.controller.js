const {create_order, getOrderDetail,buy_now, getOrdersByUserId} = require("../models/order.model");

const placeOrder = async (req,res) =>{
    try{
        const{type,user_id,product_id,quantity,first_name,last_name,address,city,province,payment_method} = req.body;
        // const user_id = req.user_id;
        let result;

        if(type ==="buynow"){
            result = await buy_now(user_id,product_id,quantity,first_name,last_name,address,city,province,payment_method);
        }else{
            result = await create_order(user_id,first_name,last_name,address,city,province,payment_method)
        }
        if(!result.success){
            return res.json({
                success:false,
                message:result.message || "Dat hang that bai"
            });
        }
        return res.json({
            success:true,
            message:"Dat hang thanh cong",
            data: result
        });
    }catch(error){
        return res.json({
            success:false,
            message: error.message
        });
    }
};
const orderDetail = async (req,res) =>{
    try{
        const {order_id} = req.params;
        const data = await getOrderDetail(order_id);
        return res.json({
            success:true,
            data : data
        });
    }catch(error){
        res.json({
            success:false,
            message:error.message
        });
    }
};
const getUserOrders = async (req, res) => {
    try {
        const { user_id } = req.params;
        if (!user_id) {
            return res.json({ success: false, message: "Thiếu ID người dùng" });
        }
        const data = await getOrdersByUserId(user_id);
        return res.json({
            success: true,
            data: data
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    placeOrder,
    orderDetail,
    getUserOrders
}