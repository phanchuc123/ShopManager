const connection = require('../config/database');
const bcrypt = require('bcrypt');

const is_register = async (email, username) =>{
    const[results, fields] = await connection.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
    return results;
}
const process_register = async (user) =>{
    const existingUsers = await is_register(user.email, user.username);
    if(existingUsers.length > 0){
        return  null;
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const[results, fields] = await connection.query('INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)', [user.username, user.email, user.phone, hashedPassword]);
    return results.affectedRows ===1;
}
const process_login = async (email,password) =>{
    const[results, fields] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if(results.length ===0){
        return null;
    }
    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
}
const getUserByEmail = async (email) => {
    const [results, fields] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    return results.length > 0 ? results[0] : null;
}

const getUserById = async (id) => {
    const [results, fields] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    return results.length > 0 ? results[0] : null;
}

const updateUserProfile = async (id, username, phone) => {
    const [results] = await connection.query('UPDATE users SET username = ?, phone = ? WHERE id = ?', [username, phone, id]);
    return results.affectedRows > 0;
}

const updateUserPassword = async (id, hashedPassword) => {
    const [results] = await connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return results.affectedRows > 0;
}

module.exports = {
    process_register,
    is_register,
    process_login,
    getUserByEmail,
    getUserById,
    updateUserProfile,
    updateUserPassword
}