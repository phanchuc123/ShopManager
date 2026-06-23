import { useState } from "react";
import API_BASE_URL from "../utils/api";
import { Link } from "react-router-dom";
import "../css/Register.css";
import panel from "../img/nenHome.png";

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

  try {
    const res = await fetch(`${API_BASE_URL}/api/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    setMessage(data.message);
  } catch (err) {
    console.error(err);
    setMessage("Lỗi kết nối server!");
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
