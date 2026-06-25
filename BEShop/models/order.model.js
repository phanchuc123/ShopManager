const connection = require('../config/database');

const create_order = async (user_id,first_name,last_name,address,city,province,payment_method) =>{
    const [cartresults, cartfields] = await connection.query("SELECT * FROM cart WHERE user_id = ?", [user_id]);
    if(cartresults.length === 0){
        return {success:false, message: "Giỏ hàng trống, không thể tạo đơn hàng"};
    }
    const cart_id = cartresults[0].cart_id;
    const [cartItems, cartItemFields] = await connection.query("SELECT ci.*, p.ProName FROM cart_items ci JOIN product p ON ci.product_id = p.id WHERE ci.cart_id = ?", [cart_id]);
    const total_price = cartItems.reduce((sum,i) => sum + Number(i.subtotal), 0);
    const total_quantity = cartItems.reduce((sum,i) => sum + Number(i.quantity), 0);
    const [orderResults, orderFields] = await connection.query("INSERT INTO orders (user_id, first_name, last_name, address, city, province, payment_method, total_price, total_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [user_id, first_name, last_name, address, city, province, payment_method, total_price, total_quantity]);
    const order_id = orderResults.insertId;
    
    for(const item of cartItems){
        await connection.query("INSERT INTO order_items (order_id, product_id, product_name, price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)", [order_id, item.product_id, item.ProName, item.price, item.quantity, item.subtotal]);
    }   
    await connection.query("DELETE FROM cart_items WHERE cart_id = ?", [cart_id]);
    return {
        success:true,
        order_id,total_price,total_quantity
    };
};

const getOrderDetail = async (order_id) =>{
    const [results,fields] = await connection.query("SELECT * FROM orders WHERE order_id = ?",[order_id]);
    const [items] = await connection.query("SELECT * FROM order_items WHERE order_id = ?",[order_id]);
    return {results,items};
};

const buy_now = async (user_id,product_id,quantity,first_name,last_name,address,city,province,payment_method)=>{
    if(!product_id || !quantity){
        return {
            success: false,
            message: "Thieu thong tin san pham"
        };
    }
    const[products] = await connection.query('SELECT * FROM product WHERE id = ?',[product_id]);
    if(products.length === 0){
        return{
            success: false,
            message:"San pham khong ton tai"
        };
    }
    const product = products[0];
    const price = Number(product.cost);
    const subtotal = price*quantity;

    const[orderResults] = await connection.query('INSERT INTO orders (user_id,first_name,last_name,address,city,province,total_price,total_quantity,payment_method) VALUES (?,?,?,?,?,?,?,?,?)',[user_id,first_name,last_name,address,city,province,subtotal,quantity,payment_method]);
    const order_id = orderResults.insertId;

    await connection.query('INSERT INTO order_items (order_id,product_id,product_name,price,quantity,subtotal) VALUES(?,?,?,?,?,?)',[order_id,product.id,product.ProName,price,quantity,subtotal]);
    return {
        success:true,
        order_id,
        total_price: subtotal,
        total_quantity: quantity
    }
}

const getOrdersByUserId = async (user_id) => {
    const [results] = await connection.query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [user_id]);
    return results;
};

module.exports = {
    create_order,
    getOrderDetail,
    buy_now,
    getOrdersByUserId
}