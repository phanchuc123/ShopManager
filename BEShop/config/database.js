console.log(">> DATABASE CONFIG: database.js is loading...");
const mysql = require('mysql2/promise');
require('dotenv').config();

console.log(">> DATABASE CONFIG: Creating mysql connection pool...");
const connection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'shopmanager1',
    port: process.env.DB_PORT || '3306',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : undefined
});
console.log(">> DATABASE CONFIG: Connection pool created successfully.");

module.exports = connection;