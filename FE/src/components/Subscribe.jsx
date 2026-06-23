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
                    <p>Link</p>
                    <Link to = "/"className="link">Home</Link>
                    <Link to = "/shop"className="link">Shop</Link>
                    <Link to = "/about"className="link">About</Link>
                    <Link to = "/contact"className="link">Contact</Link>
                </nav>
                <nav className="sub_service-help">
                    <p>Help</p>
                    <Link className="link">Payments</Link>
                    <Link className="link">Returns</Link>
                    <Link className="link">Policies</Link>
                </nav>
            </div>
            <div className="sub_input">
                <p>Newletter</p>
                <div className="sub_input-on">
                    <input type="text" name="" id="" placeholder='Enter your Email or Phone'/>
                    <button>Subscribe</button>
                </div>
            </div>
        </div>
    );
}