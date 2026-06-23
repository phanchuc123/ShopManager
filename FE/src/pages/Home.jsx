import Home1 from"../components/Home1.jsx"
import TemplateRoom from "../components/TemplatecRoom.jsx";
import Product from "../components/Product.jsx";
import Subscribe from "../components/Subscribe.jsx";
import DiningImg from "../img/Dining.png"
import LivingImg from "../img/living.png"
import BedroomImg from "../img/Bedroom.png"
// import {products} from "../data/products.js";
import beaut1 from "../img/beaut1.png";
import beaut2 from "../img/beaut2.png";
import beaut3 from "../img/beaut3.png";
import furni1 from "../img/furni1.png";
import furni2 from "../img/furni2.png";
import furni3 from "../img/furni3.png";
import furni4 from "../img/furni4.png";
import furni5 from "../img/furni5.png";
import furni6 from "../img/furni6.png";
import furni7 from "../img/furni7.png";
import furni8 from "../img/furni8.png";
import furni9 from "../img/furni9.png";
import { Link } from "react-router-dom";
import { useEffect,useState } from "react";
import "../css/Home.css"
import API_BASE_URL from "../utils/api";
export default function Home(){
    const [products, setProducts] = useState([]);
    useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi khi load dữ liệu:", err));
    }, []);
    return(
        <section className="section_Home">
             <Home1/>
             <div className="item_room">
                <h3 className="room title">Browse The Range</h3>
                <p className="room des">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
             </div>
             <div className="section_Home-room">
                 <TemplateRoom tolink={""} picture={DiningImg} des={"Dining"}/>
                 <TemplateRoom tolink={""} picture={LivingImg} des={"Living"}/>
                 <TemplateRoom tolink={""} picture={BedroomImg} des={"Bedroom"}/>          
             </div>
             <div className="our_product_title">
                <h3>Our Product</h3>
             </div>
            <div className="our_product_list">
                <div className="our_product_item">
                    {products.map((product)=>(
                        <Product key={product.id}
                                    tolink={`/product/${product.id}`}
                                    ProName={product.ProName}
                                    ProPic={product.ProPic}
                                    ProDes={product.ProDes}
                                    cost={product.cost}
                                    discost={product.discost}
                                    discount={product.discount}
                        />
                    ))}
                </div>
            </div>
             <div className="showmore">
                <Link to="/shop" className="btn_showmore">SHOW MORE</Link>
             </div>

             <div className="beautiful_room">
                <div className="beautiful_des">
                    <h2 className="h2_beauti">50+ Beautiful rooms inspiration</h2>
                    <p className="p_beauti">Our designer already made a lot of beautiful prototipe of rooms that inspire you</p>
                    <div className="btn_explore">
                        <button>Explore More</button>
                    </div>
                </div>
                <div className="beautiful_img">
                   <img className="img img1" src={beaut2} alt="anh" />
                   <img className="img img2" src={beaut1} alt="anh" />
                   <img className="img img3" src={beaut3} alt="anh" />
                </div>
             </div>

             <div className="container_furni">
                <div className="furni_title">
                    <p className="p_furni">Share your setup with</p>
                    <h2 className="h2_furni">#FuniroFurniture</h2>
                </div>
                <div className="furni_img">
                    <img src={furni1} alt="" className="p p1" />
                    <img src={furni2} alt="" className="p p2" />
                    <img src={furni3} alt="" className="p p3" />
                    <img src={furni4} alt="" className="p p4" />
                    <img src={furni5} alt="" className="p p5" />
                    <img src={furni6} alt="" className="p p6" />
                    <img src={furni7} alt="" className="p p7" />
                    <img src={furni8} alt="" className="p p8" />
                    <img src={furni9} alt="" className="p p9" />
                </div>
             </div>
             <Subscribe/>
        </section>
    );
}