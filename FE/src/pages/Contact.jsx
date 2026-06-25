import { FaMapMarkerAlt, FaPhoneAlt, FaClock } from "react-icons/fa";
import Panel from "../components/Panel.jsx";
import imgContact from "../img/Shop.png";
import "../css/Contact.css";
import Subscribe from "../components/Subscribe.jsx";
import { useState, useEffect } from "react";
import API_BASE_URL from "../utils/api";

export default function Contact() {
  const[success,setSuccess] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const handleSend = async (e) =>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const feelback = {
      your_name: formData.get("your_name"),
      your_email: formData.get("your_email"),
      your_optional: formData.get("your_optional"),
      your_msg: formData.get("your_msg"),
    };
    if(!feelback.your_msg){
      setSuccess("Nhap du thong tin feelback");
    }
    try{
      const res = await fetch(`${API_BASE_URL}/api/feelback/insertFB`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(feelback)
      });
      const data = await res.json();
      setSuccess(data.message);
    }catch(err){
      console.error(err);
      setSuccess("Loi server");
    }
  }
  return (
    <section className="section_Contact">
      <Panel namelink="Liên hệ" imglink={imgContact} />

      <div className="contact_info">
        <div className="frame_info1">
          <h2>Liên hệ với chúng tôi</h2>
          <pre>
            Để biết thêm thông tin chi tiết về sản phẩm & dịch vụ, xin vui lòng gửi thư cho chúng tôi. 
            Đội ngũ nhân viên luôn sẵn sàng giải đáp và hỗ trợ bạn sớm nhất có thể. Đừng ngần ngại!
          </pre>
        </div>

        <div className="frame_info2">
          <div className="info2_detail">
            <span className="detail_item">
              <FaMapMarkerAlt className="icon" />
              <div>
                <h5>Địa chỉ</h5>
                <p>48 Ngô Sĩ Liên, Liên Chiểu, Đà Nẵng, Việt Nam</p>
              </div>
            </span>

            <span className="detail_item">
              <FaPhoneAlt className="icon" />
              <div>
                <h5>Điện thoại</h5>
                <p>Di động: +(84) 546-6789</p>
                <p>Hotline: +(84) 456-6789</p>
              </div>
            </span>

            <span className="detail_item">
              <FaClock className="icon" />
              <div>
                <h5>Thời gian làm việc</h5>
                <p>Thứ Hai – Thứ Sáu: 9:00 – 22:00</p>
                <p>Thứ Bảy – Chủ Nhật: 9:00 – 21:00</p>
              </div>
            </span>
          </div>

          <div className="info2_input">
            <form onSubmit={handleSend}>
              {user && (
                <div style={{ fontSize: '14px', color: '#B88E2F', marginBottom: '15px', backgroundColor: '#fcf8f3', padding: '10px', borderRadius: '6px', border: '1px solid #f0e6d2' }}>
                  Gửi phản hồi với tài khoản: <strong>{user.username} ({user.email})</strong>
                </div>
              )}
              <label>
                Họ và tên
                <input 
                  type="text" 
                  name="your_name" 
                  placeholder="Nhập tên của bạn" 
                  defaultValue={user ? user.username : ""} 
                  key={user ? user.username : "empty-name"}
                  required 
                />
              </label>
              <label>
                Địa chỉ Email
                <input 
                  type="email" 
                  name="your_email" 
                  placeholder="abc@gmail.com" 
                  defaultValue={user ? user.email : ""} 
                  key={user ? user.email : "empty-email"}
                  required
                />
              </label>
              <label>
                Tiêu đề
                <input type="text" name="your_optional" placeholder="Nhập tiêu đề phản hồi (tùy chọn)" required/>
              </label>
              <label>
                Lời nhắn
                <textarea name="your_msg" placeholder="Xin chào! Tôi muốn hỏi về..." required></textarea>
              </label>
              <button type="submit">Gửi yêu cầu</button>
            </form>
            {success && <p className="success">{success}</p>}
          </div>
        </div>
      </div>
      <Subscribe/>
    </section>
  );
}
