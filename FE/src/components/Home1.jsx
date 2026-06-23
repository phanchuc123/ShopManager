import "../css/Home1.css"
import "../css/Header.css"
import { Link } from "react-router-dom";
export default function Home1(){
    return(
        <div className="container_home1">
            <div className="btn-buy">
                <p>New Arrival</p>
                <h2 className="title">Discover our New Collection</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.</p><br />
                <Link to ="/shop" className="btn-buy_now">BUY NOW</Link>
            </div>
        </div>
    );
}