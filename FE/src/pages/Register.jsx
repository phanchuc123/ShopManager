import { useState } from "react";
import API_BASE_URL from "../utils/api";
import { Link } from "react-router-dom";
import "../css/Register.css";
import panel from "../img/nenHome.png";
import { auth } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Register() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const user = {
      username: formData.get("username"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    if (user.password !== user.confirmPassword) {
      setMessage("Password không khớp");
      return;
    }

    let firebaseUser = null;
    try {
      // 1. Register with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      firebaseUser = userCredential.user;

      // 2. Sync with MySQL Database
      const res = await fetch(`${API_BASE_URL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      
      if (data && data.message === "Đăng ký thành công") {
        setMessage("Đăng ký thành công!");
      } else {
        // Rollback Firebase user if MySQL creation fails (e.g. username already exists)
        if (firebaseUser) {
          await firebaseUser.delete();
        }
        setMessage(typeof data === "string" ? data : "Đăng ký thất bại");
      }
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setMessage("Email này đã được đăng ký trên hệ thống.");
      } else if (err.code === "auth/weak-password") {
        setMessage("Mật khẩu quá yếu (tối thiểu 6 ký tự).");
      } else if (err.code === "auth/invalid-email") {
        setMessage("Email không hợp lệ.");
      } else {
        setMessage(err.message || "Lỗi đăng ký!");
      }
    }
  };


  return (
    <div
      className="register-container"
      style={{ backgroundImage: `url(${panel})` }}
    >
      <div className="form_register">
        <h2>Create an account</h2>

        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="UserName" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="text" name="phone" placeholder="Phone" required />
          <input type="password" name="password" placeholder="Password" required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" required/>
          <button type="submit">REGISTER</button>
        </form>

        {message && <p>{message}</p>}

        <p>
          Already have an account ? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
