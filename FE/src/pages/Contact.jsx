import { FaMapMarkerAlt, FaPhoneAlt, FaClock } from "react-icons/fa";
import Panel from "../components/Panel.jsx";
import imgContact from "../img/Shop.png";
import "../css/Contact.css";
import Subscribe from "../components/Subscribe.jsx";
import { useState } from "react";
import API_BASE_URL from "../utils/api";

export default function Contact() {
  const[success,setSuccess] = useState("");
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
      <Panel namelink="Contact" imglink={imgContact} />

      <div className="contact_info">
        <div className="frame_info1">
          <h2>Get In Touch With Us</h2>
          <pre>
            For More Information About Our Product & Services, Please Feel Free
            To Drop Us An Email. Our Staff Will Always Be There To Help You Out.
            Do Not Hesitate!
          </pre>
        </div>

        <div className="frame_info2">
          <div className="info2_detail">
            <span className="detail_item">
              <FaMapMarkerAlt className="icon" />
              <div>
                <h5>Address</h5>
                <p>48 Ngo Si Lien, Da Nang, Viet Nam</p>
              </div>
            </span>

            <span className="detail_item">
              <FaPhoneAlt className="icon" />
              <div>
                <h5>Phone</h5>
                <p>Mobile: +(84) 546-6789</p>
                <p>Hotline: +(84) 456-6789</p>
              </div>
            </span>

            <span className="detail_item">
              <FaClock className="icon" />
              <div>
                <h5>Working Time</h5>
                <p>Monday–Friday: 9:00 – 22:00</p>
                <p>Saturday–Sunday: 9:00 – 21:00</p>
              </div>
            </span>
          </div>

          <div className="info2_input">
            <form onSubmit={handleSend}>
              <label>
                Your name
                <input type="text" name = "your_name" placeholder="Your name" required />
              </label>
              <label>
                Email address
                <input type="email" name="your_email" placeholder="abc@gmail.com" required/>
              </label>
              <label>
                Subject
                <input type="text" name="your_optional" placeholder="This is an optional" required/>
              </label>
              <label>
                Message
                <textarea name="your_msg" placeholder="Hi! I'd like to ask about..."required></textarea>
              </label>
              <button type="submit">Submit</button>
            </form>
            {success && <p className="success">Da gui thanh cong</p>}
          </div>
        </div>
      </div>
      <Subscribe/>
    </section>
  );
}
