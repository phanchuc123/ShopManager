const adminModel = require('../models/admin.model');

const getOrders = async (req, res) => {
    try {
        const orders = await adminModel.getAllOrders();
        res.json({ success: true, data: orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { status } = req.body;
        const result = await adminModel.updateOrderStatus(order_id, status);
        if (result) {
            res.json({ success: true, message: "Cập nhật trạng thái đơn hàng thành công" });
        } else {
            res.json({ success: false, message: "Không thể cập nhật đơn hàng" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await adminModel.getAllFeedbacks();
        res.json({ success: true, data: feedbacks });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await adminModel.getAllUsers();
        res.json({ success: true, data: users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await adminModel.getAllCategories();
        res.json({ success: true, data: categories });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const addCategory = async (req, res) => {
    try {
        const { nameCate } = req.body;
        if (!nameCate) {
            return res.json({ success: false, message: "Tên danh mục không được để trống" });
        }
        const data = await adminModel.createCategory(nameCate);
        res.json({ success: true, message: "Thêm danh mục thành công", data });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const removeCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adminModel.deleteCategory(id);
        if (result) {
            res.json({ success: true, message: "Xóa danh mục thành công" });
        } else {
            res.json({ success: false, message: "Xóa danh mục thất bại hoặc danh mục không tồn tại" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const addProduct = async (req, res) => {
    try {
        const productData = req.body;
        if (!productData.ProName || !productData.cost) {
            return res.json({ success: false, message: "Tên sản phẩm và giá tiền là bắt buộc" });
        }
        const insertId = await adminModel.createProduct(productData);
        res.json({ success: true, message: "Thêm sản phẩm thành công", product_id: insertId });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;
        const result = await adminModel.updateProduct(id, productData);
        if (result) {
            res.json({ success: true, message: "Cập nhật sản phẩm thành công" });
        } else {
            res.json({ success: false, message: "Không thể cập nhật sản phẩm" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const removeProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await adminModel.deleteProduct(id);
        if (result) {
            res.json({ success: true, message: "Xóa sản phẩm thành công" });
        } else {
            res.json({ success: false, message: "Xóa sản phẩm thất bại" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getImagesList = async (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const imgDir = path.join(__dirname, '..', 'public', 'img');
        if (!fs.existsSync(imgDir)) {
            return res.json({ success: true, data: [] });
        }
        const files = fs.readdirSync(imgDir);
        const images = files.filter(f => /\.(png|jpe?g|webp|svg|gif)$/i.test(f));
        res.json({ success: true, data: images });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

module.exports = {
    getOrders,
    updateOrder,
    getFeedbacks,
    getUsers,
    getCategories,
    addCategory,
    removeCategory,
    addProduct,
    editProduct,
    removeProduct,
    getImagesList
};
