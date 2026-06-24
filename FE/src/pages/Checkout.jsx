import Panel from "../components/Panel";
import imgCheckout from "../img/Shop.png";
import "../css/Checkout.css";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Subscribe from "../components/Subscribe.jsx";
import API_BASE_URL from "../utils/api";

export default function Checkout(){
    const [error,setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading,setLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState("");
    const { type = "cart" ,total = 0, quantity = 0, items = [] } = useLocation().state || {};
    
    const [form,setForm] = useState({
        first_name:"",
        last_name:"",
        address:"",
        city:"",
        province:"",
        phone:"",
        email:"" 
    });

    // Pre-fill email and phone number if user is logged in
    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setForm(prev => ({
                ...prev,
                email: user.email || "",
                phone: user.phone || ""
            }));
        }
    }, []);

    const handleChange = e =>{
        setForm({...form,[e.target.name]:e.target.value})
    };

    const handlePlaceOrder = async () =>{
        setError("");
        setSuccess("");
        
        const user = JSON.parse(localStorage.getItem("user"));
        if(!user){
            setError("Vui lòng đăng nhập để đặt hàng");
            return;
        }

        // Validate form fields
        if (!form.first_name.trim()) {
            setError("Vui lòng điền First Name");
            return;
        }
        if (!form.last_name.trim()) {
            setError("Vui lòng điền Last Name");
            return;
        }
        if (!form.address.trim()) {
            setError("Vui lòng điền Street address");
            return;
        }
        if (!form.city.trim()) {
            setError("Vui lòng điền Town/City");
            return;
        }
        if (!form.province.trim()) {
            setError("Vui lòng điền Province");
            return;
        }
        if (!form.phone.trim()) {
            setError("Vui lòng điền Phone");
            return;
        }
        
        // Basic phone number validation (must be 10 or 11 digits)
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(form.phone.trim())) {
            setError("Số điện thoại không hợp lệ (phải gồm 10 hoặc 11 chữ số)");
            return;
        }

        if (!form.email.trim()) {
            setError("Vui lòng điền Email address");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email.trim())) {
            setError("Email không đúng định dạng");
            return;
        }

        if(!selectedPayment){
            setError("Vui lòng chọn phương thức thanh toán");
            return;
        }

        setLoading(true);
        const body = {
            type,
            user_id:user.id,
            total,
            product_id: type ==="buynow" ? items[0].item_id:null,
            quantity: type ==="buynow" ? items[0].quantity:null,
            payment_method: selectedPayment,
            ...form
        };
        
        try{
            const res = await fetch(`${API_BASE_URL}/api/orders/order`,{
                method:"POST",
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify(body)
            });
            const data = await res.json();
            if(!data.success){
               setError("Đặt hàng thất bại: " + (data.message || ""));
            }else{
               setSuccess("Đặt hàng thành công!");
               // Clear cart count on layout
               if (type === "cart") {
                   window.dispatchEvent(new Event('cartUpdated'));
               }
            }
        }catch(err){
            setError("Lỗi kết nối server!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return(
        <section className="section_Checkout">
            <Panel namelink="Checkout" imglink = {imgCheckout}/>
            <div className="container-checkout">
                <div className="billing-details">
                    <h2>Billing Details</h2>
                    <label>First Name<input name ="first_name" value={form.first_name} onChange={handleChange} type="text" /></label>
                    <label>Last Name<input name ="last_name" value={form.last_name} onChange={handleChange} type="text" /></label>
                    <label>Street address<input name ="address" value={form.address} onChange={handleChange} type="text" /></label>
                    <label>Town/City<input name = "city" value={form.city} onChange={handleChange} type="text" /></label>
                    <label>Province<input name = "province" value={form.province} onChange={handleChange} type="text" /></label>
                    <label>Phone<input name = "phone" value={form.phone} onChange={handleChange} type="text" /></label>
                    <label>Email address<input name = "email" value={form.email} onChange={handleChange} type="email" /></label>
                </div>
                <div className="total-details">
                    <h2>Your Order</h2>
                    <div>
                        <span>Total Items:</span>
                        <span>{quantity}</span>
                    </div>
                    <div>
                        <span>Total Price:</span>
                        <span>{total.toLocaleString()} đ</span>
                    </div>
                    {items.map(item => (
                        <p key={item.item_id}>
                        {item.ProName} x {item.quantity}
                        </p>
                    ))}
                    <div className="option-payment">
                        <label><input type="radio" name="payment" onChange={()=>setSelectedPayment('delivery')} />Cash on Delivery</label>
                        <label><input type="radio" name="payment" onChange={()=>setSelectedPayment('bank')} />Direct Bank Transfer</label>
                        {selectedPayment === 'bank' && (
                            <div className="info-bank">
                                <p><span>Bank Name :</span>ABC Bank</p>
                                <p><span>Account Number :</span>1234567890</p>
                                <p><span>Account Hoder :</span>Furniro Shop</p>
                                <p><span>Branch :</span>Da Nang</p>
                            </div>
                        )}
                    </div>
                        {error && (<div className="checkout-error">{error}</div>)}
                        {success && (<div className="checkout-success">{success}</div>)}
                    <div className="fr-btn">
                        <button onClick={handlePlaceOrder} disabled={loading}>
                            {loading ? "Placing Order" : "Place Order" }
                        </button>
                        <Link to ="/cart" disabled={loading}>
                            <button type="button">Info Cart Items</button>
                        </Link>
                    </div>
                </div>
            </div>
            <Subscribe/>
        </section>
    );
}