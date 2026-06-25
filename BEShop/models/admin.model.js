const connection = require('../config/database');

const getAllOrders = async () => {
    const [results] = await connection.query("SELECT * FROM orders ORDER BY created_at DESC");
    return results;
};

const updateOrderStatus = async (order_id, status) => {
    const [result] = await connection.query("UPDATE orders SET status = ? WHERE order_id = ?", [status, order_id]);
    return result.affectedRows > 0;
};

const getAllFeedbacks = async () => {
    const [results] = await connection.query("SELECT * FROM feelback ORDER BY fb_id DESC");
    return results;
};

const getAllUsers = async () => {
    const [results] = await connection.query("SELECT id, username, email, phone, role FROM users ORDER BY id DESC");
    return results;
};

const getAllCategories = async () => {
    const [results] = await connection.query("SELECT * FROM category ORDER BY idCate DESC");
    return results;
};

const createCategory = async (nameCate) => {
    const [result] = await connection.query("INSERT INTO category (nameCate) VALUES (?)", [nameCate]);
    return { idCate: result.insertId, nameCate };
};

const deleteCategory = async (idCate) => {
    const [result] = await connection.query("DELETE FROM category WHERE idCate = ?", [idCate]);
    return result.affectedRows > 0;
};

const createProduct = async (product) => {
    const [result] = await connection.query(
        "INSERT INTO product (ProName, ProPic, ProDes, cost, discost, discount, idcategory, tags, sku, description, sizes, colors, rating, reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0.0, 0)",
        [
            product.ProName,
            product.ProPic || '',
            product.ProDes || '',
            product.cost || 0,
            product.discost || null,
            product.discount || null,
            product.idcategory || null,
            product.tags || '',
            product.sku || '',
            product.description || '',
            product.sizes || '',
            product.colors || ''
        ]
    );
    return result.insertId;
};

const updateProduct = async (id, product) => {
    const [result] = await connection.query(
        "UPDATE product SET ProName = ?, ProPic = ?, ProDes = ?, cost = ?, discost = ?, discount = ?, idcategory = ?, tags = ?, sku = ?, description = ?, sizes = ?, colors = ? WHERE id = ?",
        [
            product.ProName,
            product.ProPic,
            product.ProDes,
            product.cost,
            product.discost,
            product.discount,
            product.idcategory,
            product.tags,
            product.sku,
            product.description,
            product.sizes,
            product.colors,
            id
        ]
    );
    return result.affectedRows > 0;
};

const deleteProduct = async (id) => {
    const [result] = await connection.query("DELETE FROM product WHERE id = ?", [id]);
    return result.affectedRows > 0;
};

module.exports = {
    getAllOrders,
    updateOrderStatus,
    getAllFeedbacks,
    getAllUsers,
    getAllCategories,
    createCategory,
    deleteCategory,
    createProduct,
    updateProduct,
    deleteProduct
};
