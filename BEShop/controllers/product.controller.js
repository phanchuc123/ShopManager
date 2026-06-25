const {get_product,get_detail,search_product} = require('../models/product.model');
const {getReviewsByProductId, addReview} = require('../models/review.model');

const listProduct = async (req, res) => {
    try {
        const { search } = req.query;

        if (search && search.trim() !== "") {
            products = await search_product(search);
        } else {
            products = await get_product();
        }

        res.json(products);
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const detailproduct = async (req, res) => {
    let id = req.params.id;
    let product = await get_detail(id);
    res.json(product);
}

const getProductReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await getReviewsByProductId(id);
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const submitProductReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, username, rating, comment } = req.body;

        if (!user_id || !username || !rating || !comment) {
            return res.json({ success: false, message: "Vui lòng nhập đầy đủ thông tin đánh giá" });
        }

        const review = await addReview(id, user_id, username, rating, comment);
        if (!review) {
            return res.json({ success: false, message: "Không thể thêm đánh giá" });
        }

        res.json({ success: true, message: "Đánh giá thành công!", data: review });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

module.exports = {
    listProduct,
    detailproduct,
    getProductReviews,
    submitProductReview
}