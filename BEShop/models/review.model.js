const connection = require('../config/database');

const getReviewsByProductId = async (product_id) => {
    const [results] = await connection.query(
        "SELECT * FROM product_reviews WHERE product_id = ? ORDER BY created_at DESC",
        [product_id]
    );
    return results;
};

const addReview = async (product_id, user_id, username, rating, comment) => {
    // 1. Insert review
    const [result] = await connection.query(
        "INSERT INTO product_reviews (product_id, user_id, username, rating, comment) VALUES (?, ?, ?, ?, ?)",
        [product_id, user_id, username, rating, comment]
    );

    if (result.affectedRows === 0) return null;

    // 2. Recalculate average and count
    const [stats] = await connection.query(
        "SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM product_reviews WHERE product_id = ?",
        [product_id]
    );
    const count = stats[0].count;
    const avg = parseFloat(stats[0].avg_rating || 0).toFixed(1);

    // 3. Update product cache
    await connection.query(
        "UPDATE product SET rating = ?, reviews = ? WHERE id = ?",
        [avg, count, product_id]
    );

    return {
        review_id: result.insertId,
        product_id,
        user_id,
        username,
        rating,
        comment,
        created_at: new Date()
    };
};

module.exports = {
    getReviewsByProductId,
    addReview
};
