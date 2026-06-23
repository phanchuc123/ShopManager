const {process_login, is_register,process_register} = require('../models/user.model');

const register = async (req, res) => {
    try{
        let user = req.body;
        let result = await process_register(user);
        if(!result){
            return res.json("Email or Username đã tồn tại");
        }
        res.json({message: "Đăng ký thành công"});
    }catch(error){
        res.json({message: "Lỗi server"});
    }
    
};
const login = async (req, res) => {
    try{
        const user = await process_login(req.body.email, req.body.password);
        if(!user){
            return res.json({success:false,message: "Email hoặc mật khẩu không đúng"});
        }
        delete user.password;
        res.json({success:true, message: "Đăng nhập thành công", user});
    }
    catch(error){
        res.json({success:false, message: "Lỗi server"});
    }
}
module.exports = {
    register,
    login
}