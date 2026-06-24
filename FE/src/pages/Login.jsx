import { Link } from "react-router-dom";
import "../css/Login.css";
import panel from "../img/nenHome.png";
import { useState } from "react";
import API_BASE_URL from "../utils/api";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login(){
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get("email");
        const password = formData.get("password");

        try{
            // 1. Authenticate with Firebase Auth
            await signInWithEmailAndPassword(auth, email, password);

            // 2. Fetch MySQL user details using the email
            const res = await fetch(`${API_BASE_URL}/api/user/firebase-login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if(data.success){
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "/";
            }
            else{
                setMessage(data.message);
            }
        }catch(err){
            console.error("Error:", err);
            if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
                setMessage("Email hoặc mật khẩu không chính xác.");
            } else if (err.code === "auth/invalid-email") {
                setMessage("Email không đúng định dạng.");
            } else {
                setMessage(err.message || "Lỗi đăng nhập!");
            }
        }
    };

    const handleGoogleLogin = async () => {
        try {
            // 1. Trigger Firebase Google popup sign-in
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // 2. Sync Google User details to MySQL Database
            const res = await fetch(`${API_BASE_URL}/api/user/google-login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: user.email,
                    username: user.displayName,
                    phone: user.phoneNumber
                })
            });

            const data = await res.json();
            if(data.success){
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "/";
            }
            else{
                setMessage(data.message);
            }
        } catch (err) {
            console.error("Google Login Error:", err);
            if (err.code === "auth/popup-closed-by-user") {
                setMessage("Đã đóng cửa sổ đăng nhập Google.");
            } else if (err.code === "auth/cancelled-popup-request") {
                setMessage("Yêu cầu đăng nhập bị hủy.");
            } else {
                setMessage(err.message || "Lỗi đăng nhập Google!");
            }
        }
    };

    return (
        <div className="login_container" style={{backgroundImage : `url(${panel})`}}>
            <div className="form_login">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" name = "email" placeholder="Email" />
                    <input type="password" name = "password" placeholder="Password"/>
                    <button type="submit">LOGIN</button>
                </form>

                <div className="login_divider">
                    <span>or</span>
                </div>

                <button type="button" className="btn_google_login" onClick={handleGoogleLogin}>
                    <svg className="google_icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign in with Google
                </button>

                {message && <p className="login_message">{message}</p>}
                <p>Don't have an account ?<Link to = "/register">Registor</Link></p>
            </div>
        </div>
    );
}