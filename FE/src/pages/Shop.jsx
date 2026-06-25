import Panel from "../components/Panel.jsx";
import Subscribe from "../components/Subscribe.jsx";
import imgShop from "../img/Shop.png";
import "../css/Shop.css";
// import {products} from "../data/products.js";
import Product from "../components/Product.jsx";
import { useState ,useEffect} from "react";
import API_BASE_URL from "../utils/api";


export default function Shop(){
    
    const [products, setProducts] = useState([]);
    const [page,setPage] = useState(1);
    const [search,setSearch] = useState("");
    useEffect(() => {
    const url = search
        ? `${API_BASE_URL}/api/products?search=${encodeURIComponent(search)}`
        : `${API_BASE_URL}/api/products`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            setProducts(data);
            setPage(1); // reset page khi search
        })
        .catch(err => console.error("Lỗi khi load dữ liệu:", err));
}, [search]);

    const itemofPage = 8;
    const totalPage = Math.ceil(products.length / itemofPage); 
    const start = (page - 1) * itemofPage;
    const visible = products.slice(start,start+itemofPage);



    return(
        <section className="section_Shop">
            <Panel namelink="Cửa hàng" imglink = {imgShop}/>
            <div className="container_search">
                <label htmlFor="">Search :</label>
                <form className="input_search" onSubmit={(e)=>e.preventDefault()}>
                    <input type="text" name="searchproduct" id="" placeholder="Enter Your Item" onChange={(e)=> setSearch(e.target.value)} />
                </form>
            </div>
            <div className="our_product_list">
                <div className="our_product_item">
                    {visible.map((product)=>(
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
                <div className="pagination"> 
                    {Array.from({ length: totalPage }, (_, i) => ( <button key={i} className={i + 1 === page ? "active" : ""} onClick={() => setPage(i + 1)} > {i + 1} </button> ))} <button onClick={() => setPage((p) => Math.min(totalPage, p + 1))}>Next</button> 
                </div>
            </div>
            <Subscribe/>
        </section>
    );
}