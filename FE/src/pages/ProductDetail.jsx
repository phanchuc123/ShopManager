import { useState,useEffect } from 'react';
import { useParams, Link,useNavigate } from 'react-router-dom';
import Subscribe from "../components/Subscribe.jsx";
import "../css/ProductDetail.css";
import API_BASE_URL from "../utils/api";


export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setProduct(data);
          setSelectedSize(data.size ? data.size.split(",")[0] : "");
          setSelectedColor(
            data.color ? data.color.split(",")[0] : ""
          );
        }
      })
      .catch((err) => console.error("Lỗi khi tải sản phẩm:", err));
  }, [id]);
  if (!product) {
    return (
      <div style={{padding: '4rem', textAlign: 'center'}}>
        <h2>Product not found</h2>
        <Link to="/shop" style={{color: '#B88E2F'}}>Back to Shop</Link>
      </div>
    );
  }
  const productImages = [product.ProPic, product.ProPic, product.ProPic, product.ProPic];
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  const handleAddToCart = async() => {
    const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Please login to add to cart.");
    window.location.href = "/ShopManager/login";
    return;
  }

  const cartItem = {
    user_id: user.id,
    product_id: product.id,
    quantity: quantity,
    price: Number(product.cost),
    size: selectedSize,
    color: selectedColor
  };

  try {
    console.log("user:", user);
    console.log("product:", product);
    const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartItem)
    });
    const data = await res.json();
    alert(data.message);
  } catch (err) {
    console.error("Error adding to cart:", err);
    alert("Error connecting to server.");
  }
  };
  const handleBuyNow = () =>{
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user){
      alert("Please login to proceed with purchase.");
    }
    const total = Number(product.cost) * quantity
    navigate("/checkout",{
      state:{
        type:"buynow",
        quantity:quantity,
        total:total,
        items:[
          {
            item_id:product.id,
            ProName: product.ProName,
            quantity: quantity,
            price:Number(product.cost),
            subtotal:total
          }
        ],
        size:selectedSize,
        color:selectedColor
      }
    });
  };
  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="breadcrumb-container">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to="/shop" className="breadcrumb-link">Shop</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{product.ProName}</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="product-section">
        <div className="product-grid">
          {/* Left: Images */}
          <div className="image-gallery">
            <div className="thumbnail-list">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`thumbnail-btn ${selectedImage === index ? 'active' : ''}`}
                >
                  <img src={img} alt={`${product.ProName} ${index + 1}`} />
                </button>
              ))}
            </div>

            <div className="main-image">
              <img src={productImages[selectedImage]} alt={product.ProName} />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="product-info">
            <h1>{product.ProName}</h1>
            <p className="product-price">{product.cost}đ</p>
            {product.discost && (
              <p className="product-old-price">{product.discost}đ</p>
            )}

            {/* Rating */}
            <div className="rating-section">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    className="star" 
                    viewBox="0 0 20 20"
                    style={{
                      fill: star <= Math.floor(product.rating) ? '#FFC700' : '#E0E0E0'
                    }}
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="review-count">{product.reviews} Customer Review{product.reviews !== 1 ? 's' : ''}</span>
            </div>

            {/* Description */}
            <p className="product-description">
              { product.ProDes}
            </p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="size-selection">
                <span className="selection-label">Size</span>
                <div className="size-options">
                  {product.sizes.split(",").map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`size-btn ${
                        selectedSize === size ? "active" : ""
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="color-selection">
                <span className="selection-label">Color</span>
                <div className="color-options">
                  {product.colors.split(",").map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`color-btn ${
                        selectedColor === color ? "active" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="product-actions">
              <div className="quantity-selector">
                <button onClick={decreaseQuantity} className="quantity-btn">-</button>
                <span className="quantity-value">{quantity}</span>
                <button onClick={increaseQuantity} className="quantity-btn">+</button>
              </div>

              <button className="btn-add-cart" onClick={handleAddToCart}>
                Add To Cart
              </button>

              <button className="btn-compare" onClick={handleBuyNow}>Buy Now</button>
            </div>

            {/* Product Meta */}
            <div className="product-meta">
              <div className="meta-row">
                <span className="meta-label">SKU</span>
                <span className="meta-separator">:</span>
                <span className="meta-value">{product.sku}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Category</span>
                <span className="meta-separator">:</span>
                <span className="meta-value">{product.nameCate}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Tags</span>
                <span className="meta-separator">:</span>
                <span className="meta-value">{product.tags}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Share</span>
                <span className="meta-separator">:</span>
                <div className="social-links">
                  <button className="social-btn" aria-label="Share on Twitter">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </button>
                  <button className="social-btn" aria-label="Share on Facebook">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                  </button>
                  <button className="social-btn" aria-label="Share on LinkedIn">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="tabs-section">
          <div className="tab-headers">
            <button
              onClick={() => setActiveTab('description')}
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('additional')}
              className={`tab-btn ${activeTab === 'additional' ? 'active' : ''}`}
            >
              Additional Information
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            >
              Reviews [{product.reviews}]
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-content-inner">
                <p>{product.description}</p>
                <p style={{marginTop: '1rem'}}>
                  This {product.ProName} is a perfect addition to your home. 
                  Made with high-quality materials and modern design, 
                  it combines functionality with aesthetic appeal.
                </p>
              </div>
            )}

            {activeTab === 'additional' && (
              <div className="tab-content-inner">
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <tbody>
                    <tr style={{borderBottom: '1px solid #E5E5E5'}}>
                      <td style={{padding: '1rem', color: '#9F9F9F', width: '200px'}}>SKU</td>
                      <td style={{padding: '1rem'}}>{product.sku}</td>
                    </tr>
                    <tr style={{borderBottom: '1px solid #E5E5E5'}}>
                      <td style={{padding: '1rem', color: '#9F9F9F'}}>Category</td>
                      <td style={{padding: '1rem'}}>{product.nameCate}</td>
                    </tr>
                    <tr style={{borderBottom: '1px solid #E5E5E5'}}>
                      <td style={{padding: '1rem', color: '#9F9F9F'}}>Available Sizes</td>
                      <td style={{padding: '1rem'}}>
                        {product.sizes ? product.sizes.split(',').join(', ') : 'N/A'}
                      </td>
                    </tr>
                    <tr style={{borderBottom: '1px solid #E5E5E5'}}>
                      <td style={{padding: '1rem', color: '#9F9F9F'}}>Colors</td>
                      <td style={{padding: '1rem'}}>
                        {product.colors ? product.colors.split(',').length + ' options' : 'N/A'}
                    </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}


            {activeTab === 'reviews' && (
              <div className="tab-content-inner">
                <div style={{textAlign: 'center', padding: '2rem'}}>
                  <h3 style={{marginBottom: '0.5rem'}}>Customer Reviews</h3>
                  <div className="stars" style={{justifyContent: 'center', marginBottom: '1rem'}}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className="star" 
                        viewBox="0 0 20 20"
                        style={{
                          fill: star <= Math.floor(product.rating) ? '#FFC700' : '#E0E0E0'
                        }}
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p style={{color: '#666'}}>
                    Based on {product.reviews} review{product.reviews !== 1 ? 's' : ''}
                  </p>
                  <p style={{marginTop: '1rem', color: '#9F9F9F'}}>
                    Customer reviews will be displayed here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Subscribe />
    </div>
  );
}