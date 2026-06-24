const {process_login, is_register,process_register, getUserByEmail} = require('../models/user.model');

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
const firebaseLogin = async (req, res) => {
    try{
        const { email } = req.body;
        if(!email){
            return res.json({success:false, message: "Email không được để trống"});
        }
        const user = await getUserByEmail(email);
        if(!user){
            return res.json({success:false, message: "Tài khoản không tồn tại trên hệ thống dữ liệu"});
        }
        delete user.password;
        res.json({success:true, message: "Đăng nhập thành công", user});
    }
    catch(error){
        res.json({success:false, message: "Lỗi server"});
    }
}
const googleLogin = async (req, res) => {
    try {
        const { email, username, phone } = req.body;
        if (!email) {
            return res.json({ success: false, message: "Email không được để trống" });
        }
        
        let user = await getUserByEmail(email);
        if (!user) {
            // Automatically register the user in MySQL
            let baseUsername = username || email.split('@')[0];
            let finalUsername = baseUsername;
            let attempt = 0;
            let success = false;
            
            while (attempt < 5) {
                const randomPassword = Math.random().toString(36).slice(-8);
                const newUser = {
                    username: finalUsername,
                    email: email,
                    phone: phone || '',
                    password: randomPassword
                };
                const registerSuccess = await process_register(newUser);
                if (registerSuccess) {
                    success = true;
                    break;
                }
                // If username is taken, append random digits
                finalUsername = `${baseUsername}${Math.floor(100 + Math.random() * 900)}`;
                attempt++;
            }
            
            if (!success) {
                return res.json({ success: false, message: "Lỗi đồng bộ tài khoản" });
            }
            user = await getUserByEmail(email);
        }
        
        delete user.password;
        res.json({ success: true, message: "Đăng nhập bằng Google thành công", user });
    } catch (error) {
        res.json({ success: false, message: "Lỗi server" });
    }
};
module.exports = {
    register,
    login,
    firebaseLogin,
    googleLogin
}