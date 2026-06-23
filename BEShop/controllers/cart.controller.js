const {getOrCreateCart, addToCart, get_cart_by_user, get_item_by_cart, deleteItem} = require('../models/cart.model');

const add_to_cart = async (req, res) => {
    try{
        const {user_id, product_id, quantity, price, size, color} = req.body;
        if(!user_id || !product_id){
            return res.json({success:false, message: "user_id và product_id không được để trống"});
        }
        const result = await addToCart(user_id, product_id, Number(quantity), Number(price), size, color);
        res.json(result);
    }
    catch(error){
        res.json({success:false, message:error.message});
    }
};
const getCartbyUser = async (req, res) => {
    try{
        const user_id = req.params.user_id;
        const cart = await get_cart_by_user(user_id);
        if(!cart){
            return res.json({success:false, message: "Giỏ hàng không tồn tại"});
        }
        const items = await get_item_by_cart(cart.cart_id);
        res.json({success:true, cart, items});
    }
    catch(error){
        res.json({success:false, message: "Lỗi server"});
    }
};
const delete_item = async (req, res) => {
    try{
        const item_id = req.params.item_id;
        const result = await deleteItem(item_id);
        res.json(result);
    }
    catch(error){
        res.json({success:false, message: "Lỗi server"});
    }
}
module.exports = {
    add_to_cart,
    getCartbyUser,
    delete_item
}
