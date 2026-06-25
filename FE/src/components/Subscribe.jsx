import { Link } from 'react-router-dom'
import "../css/Subscribe.css";
export default function Subscribe(){
    return(
        <div className="container_sub">
            <div className="sub_name">
                <span>Furniro</span>
                <p>48 Ngo Si Lien Street</p>
                <p>Phone : 19001024</p>
            </div>
            <div className="sub_service">
                <nav className="sub_service-link">
                    <p>Liên kết</p>
                    <Link to="/" className="link">Trang chủ</Link>
                    <Link to="/shop" className="link">Cửa hàng</Link>
                    <Link to="/about" className="link">Giới thiệu</Link>
                    <Link to="/contact" className="link">Liên hệ</Link>
                </nav>
                <nav className="sub_service-help">
                    <p>Hỗ trợ</p>
                    <Link to="/help?tab=payments" className="link">Thanh toán</Link>
                    <Link to="/help?tab=returns" className="link">Đổi trả hàng</Link>
                    <Link to="/help?tab=policies" className="link">Chính sách bảo mật</Link>
                </nav>
            </div>
            <div className="sub_input">
                <p>Đăng ký nhận tin</p>
                <div className="sub_input-on">
                    <input type="text" name="" id="" placeholder='Nhập Email hoặc Số điện thoại'/>
                    <button>Đăng ký</button>
                </div>
            </div>
        </div>
    );
}