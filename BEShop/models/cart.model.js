const connection = require('../config/database');

const getOrCreateCart = async (user_id) =>{
    const [results,fields] = await connection.query("SELECT * FROM cart where user_id = ?",[user_id]);
    if(results.length > 0){
        return results[0];
    }else{
        const [insertResult, insertFields] = await connection.query("INSERT INTO cart (user_id) VALUES (?)",[user_id]);
        return {
            cart_id: insertResult.insertId,
            user_id: user_id
        }
    }
};
const addToCart = async(user_id, product_id, quantity = 1, price, size, color) =>{
    const cart = await getOrCreateCart(user_id);
    const [results, fields] = await connection.query("SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?", [cart.cart_id, product_id]);
    if(results.length > 0){
        const item = results[0];
        const newQuantity = item.quantity + quantity;
        await connection.query("UPDATE cart_items SET quantity = ? WHERE item_id = ?", [newQuantity, item.item_id]);
        return {success:true, message: "Cập nhật số lượng sản phẩm trong giỏ hàng"};
    }
    else{
        await connection.query("INSERT INTO cart_items (cart_id, product_id, quantity, price, size, color) VALUES (?, ?, ?, ?, ?, ?)", [cart.cart_id, product_id, quantity, price, size, color]);
        return {success:true, message: "Thêm sản phẩm vào giỏ hàng thành công"};
    }
};
const get_cart_by_user = async(user_id) =>{
    const[cartResults, cartFields] = await connection.query("SELECT * FROM cart WHERE user_id = ?", [user_id]);
    return cartResults.length > 0 ? cartResults[0] : null;
}
const get_item_by_cart = async(cart_id) =>{
    const[itemResults, itemFields] = await connection.query("SELECT ci.*, p.ProName, p.ProPic, p.ProDes FROM cart_items ci JOIN product p ON ci.product_id = p.id WHERE ci.cart_id = ?", [cart_id]);
    return itemResults;
};
const deleteItem = async(item_id) =>{
    const [results, fields] = await connection.query("DELETE FROM cart_items WHERE item_id = ?", [item_id]);
    if(results.affectedRows > 0){
        return {success:true, message: "Xóa sản phẩm khỏi giỏ hàng thành công"};
    }
    return {success:false, message: "Xóa sản phẩm khỏi giỏ hàng thất bại"};
};
module.exports = {
    addToCart,
    get_cart_by_user,
    get_item_by_cart,
    deleteItem,
    getOrCreateCart
}