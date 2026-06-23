const connection = require("../config/database");

const insertFeelBack = async (feelback) =>{
    const [resultsFB] = await connection.query('INSERT INTO feelback (your_name,your_email,your_optional,your_msg) VALUES(?,?,?,?)',[feelback.your_name,feelback.your_email,feelback.your_optional,feelback.your_msg]);
    return resultsFB;
}

module.exports={
    insertFeelBack
}