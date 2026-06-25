const {process_login, is_register,process_register, getUserByEmail, getUserById, updateUserProfile, updateUserPassword} = require('../models/user.model');
const bcrypt = require('bcrypt');

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
const updateProfile = async (req, res) => {
    try {
        const { id, username, phone, oldPassword, newPassword } = req.body;
        if (!id) {
            return res.json({ success: false, message: "Thiếu ID người dùng" });
        }
        if (!username) {
            return res.json({ success: false, message: "Username không được để trống" });
        }

        // Fetch user from DB to verify status and password
        const user = await getUserById(id);
        if (!user) {
            return res.json({ success: false, message: "Người dùng không tồn tại" });
        }

        // 1. If password change is requested
        if (newPassword) {
            if (!oldPassword) {
                return res.json({ success: false, message: "Vui lòng nhập mật khẩu hiện tại" });
            }

            // Verify old password
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                return res.json({ success: false, message: "Mật khẩu hiện tại không chính xác" });
            }

            // Hash new password and update
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await updateUserPassword(id, hashedNewPassword);
        }

        // 2. Update profile (username, phone)
        const updated = await updateUserProfile(id, username, phone || '');
        if (!updated) {
            return res.json({ success: false, message: "Cập nhật thông tin thất bại" });
        }

        // Get the updated user object to return
        const updatedUser = await getUserById(id);
        delete updatedUser.password;

        return res.json({
            success: true,
            message: "Cập nhật thông tin thành công",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update profile error:", error);
        return res.json({ success: false, message: "Lỗi server: " + error.message });
    }
};

module.exports = {
    register,
    login,
    firebaseLogin,
    googleLogin,
    updateProfile
}