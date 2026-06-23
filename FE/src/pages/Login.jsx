import { Link } from "react-router-dom";
import "../css/Login.css";
import panel from "../img/nenHome.png";
import { useState } from "react";
import API_BASE_URL from "../utils/api";
export default function Login(){
    const [message, setMessage] = useState("");
    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const user = {
            email: formData.get("email"),
            password: formData.get("password"),
        };
        try{
            const res = await fetch(`${API_BASE_URL}/api/user/login`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user),// chuyển user sang json
            });
            const data = await res.json(); //nhận dữ liệu từ BE
            if(data.success){
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "/";
            }
            else{
                setMessage(data.message);
            }
        }catch(err){
            console.error("Error:", err);
            setMessage("Lỗi kết nối server!");
        }
    }
    return (
        <div className="login_container" style={{backgroundImage : `url(${panel})`}}>
            <div className="form_login">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" name = "email" placeholder="Email" />
                    <input type="password" name = "password" placeholder="Password"/>
                    <button type="submit">LOGIN</button>
                </form>
                {message && <p>{message}</p>}
                <p>Don't have an account ?<Link to = "/register">Registor</Link></p>
            </div>
        </div>
    );
}