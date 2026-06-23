const BASE_URL = (process.env.APP_URL || 'http://localhost:3001') + '/public/';
const connection = require('../config/database');
const get_product = async () => {
    const [results,fields] = await connection.query(
        'SELECT * FROM product'
    );

    return results.map(p => ({
        ...p,
        ProPic: BASE_URL + p.ProPic   
    }));
};
const get_detail = async (id) =>{
    const [results,fields] = await connection.query('SELECT p.*, c.nameCate FROM product p LEFT JOIN category c ON p.idcategory = c.idCate WHERE p.id = ?', [id]);
    if(results.length === 0) return null;
    const product = results[0];
    product.ProPic = BASE_URL + product.ProPic;
    return product;
}
const search_product = async(keyword) =>{
    const [results,fields] = await connection.query('SELECT * FROM product WHERE ProName LIKE ?', [`%${keyword}%`]);
    return results.map(p => ({
        ...p,
        ProPic: BASE_URL + p.ProPic   
    }));
}
module.exports = {
    get_product,
    get_detail,
    search_product
}