import { useState, useEffect } from "react";
import Panel from "../components/Panel.jsx";
import imgCart from "../img/Shop.png";
import Subscribe from "../components/Subscribe.jsx";
import "../css/Cart.css";
import { Link } from "react-router-dom";
import API_BASE_URL from "../utils/api";
export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
  const fetchCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const res = await fetch(
        `${API_BASE_URL}/api/cart/getcartbyuser/${user.id}`
      );
      const data = await res.json();

      console.log("Cart data:", data);

      if (data.success) {
        setCartItems(data.items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error loading cart:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchCart();
}, []);


  // Tính tổng tiền
  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.subtotal || 0),
    0
  );
  const quantity = cartItems.reduce(
    (sum, item) => sum + parseInt(item.quantity || 0),
    0
  );

  const handleDelete = async (id) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/cart/delete/${id}`,
      { method: "DELETE" }
    );
    const data = await res.json();

    if (data.success) {
      setCartItems((prev) => prev.filter((item) => item.item_id !== id));
    } else {
      alert("Failed to delete item: " + data.message);
    }
  } catch (err) {
    console.error("Error deleting item:", err);
  }
};

  if (loading) return <p>Loading cart...</p>;

  return (
    <section className="section_cart">
      <Panel namelink="Cart" imglink={imgCart} />

      <div className="container_cart">
        <div className="cart_info">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.item_id}>
                    <td data-label="Product" className="cart_product_cell">
                      {item.ProPic && (
                        <img src={item.ProPic} alt={item.ProName} className="cart_product_img" />
                      )}
                      <div className="cart_product_info">
                        <span className="cart_product_name">{item.ProName}</span>
                        <div className="cart_product_options">
                          {item.size && (
                            <span className="cart_product_size">Size: {item.size}</span>
                          )}
                          {item.color && (
                            <span className="cart_product_color">
                              Color: <span className="color_dot_preview" style={{ backgroundColor: item.color }} title={item.color}></span>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td data-label="Price">
                      {parseFloat(item.price).toLocaleString()}đ
                    </td>
                    <td data-label="Quantity">
                      <p>{item.quantity}</p>
                    </td>
                    <td data-label="Subtotal">
                      {parseFloat(item.subtotal).toLocaleString()}
                    </td>
                    <td data-label="">
                      <span
                        className="delete_icon"
                        onClick={() => handleDelete(item.item_id)}
                      >
                        🗑️
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="cart_total">
          <h2>Cart Total</h2>
          <div className="total_item">
            <span>Total:</span>
            <span>{total.toLocaleString()}</span>
          </div>
          <Link to ="/checkout" state = {{ type:"cart",total:total, quantity:quantity ,items: cartItems}}>
          <button>Check Out</button>
          </Link>
        </div>
      </div>

      <Subscribe />
    </section>
  );
}
