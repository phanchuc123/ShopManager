const {get_product,get_detail,search_product} = require('../models/product.model');

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

module.exports = {
    listProduct,
    detailproduct,
}