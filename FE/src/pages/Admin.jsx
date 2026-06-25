import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../utils/api";
import Subscribe from "../components/Subscribe";
import "../css/Admin.css";

export default function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");

  // Data states
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [availableImages, setAvailableImages] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // null for Add, object for Edit
  const [productForm, setProductForm] = useState({
    ProName: "",
    cost: "",
    discost: "",
    discount: "",
    idcategory: "",
    ProDes: "",
    description: "",
    sku: "",
    tags: "",
    sizes: "",
    colors: "",
    ProPic: ""
  });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingOrderItems, setLoadingOrderItems] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");

  // Alert state
  const [alert, setAlert] = useState({ text: "", type: "" });

  // Authenticate Admin
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") {
      setAlert({ text: "Bạn không có quyền truy cập trang quản trị. Đang chuyển hướng về trang chủ...", type: "error" });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      setIsAdmin(true);
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Orders
      const resOrders = await fetch(`${API_BASE_URL}/api/admin/orders`);
      const dataOrders = await resOrders.json();
      if (dataOrders.success) setOrders(dataOrders.data);

      // 2. Fetch Products
      const resProducts = await fetch(`${API_BASE_URL}/api/products`);
      const dataProducts = await resProducts.json();
      setProducts(dataProducts);

      // 3. Fetch Categories
      const resCategories = await fetch(`${API_BASE_URL}/api/admin/categories`);
      const dataCategories = await resCategories.json();
      if (dataCategories.success) setCategories(dataCategories.data);

      // 4. Fetch Users
      const resUsers = await fetch(`${API_BASE_URL}/api/admin/users`);
      const dataUsers = await resUsers.json();
      if (dataUsers.success) setUsers(dataUsers.data);

      // 5. Fetch Feedbacks
      const resFeedbacks = await fetch(`${API_BASE_URL}/api/admin/feedbacks`);
      const dataFeedbacks = await resFeedbacks.json();
      if (dataFeedbacks.success) setFeedbacks(dataFeedbacks.data);

      // 6. Fetch Available Images
      const resImages = await fetch(`${API_BASE_URL}/api/admin/images`);
      const dataImages = await resImages.json();
      if (dataImages.success) setAvailableImages(dataImages.data);

    } catch (err) {
      console.error(err);
      setAlert({ text: "Lỗi đồng bộ dữ liệu với máy chủ", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Trigger alert timeout
  const showAlert = (text, type = "success") => {
    setAlert({ text, type });
    setTimeout(() => {
      setAlert({ text: "", type: "" });
    }, 4000);
  };

  // ----------------------------------------------------
  // ORDER ACTIONS
  // ----------------------------------------------------
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o));
        showAlert("Cập nhật trạng thái đơn hàng thành công!");
      } else {
        showAlert(data.message || "Không thể cập nhật trạng thái", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Lỗi máy chủ khi cập nhật trạng thái đơn hàng", "error");
    }
  };

  const handleViewOrderDetail = async (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
    setLoadingOrderItems(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/order/${order.order_id}`);
      const data = await res.json();
      if (data.success) {
        setOrderItems(data.data.items || []);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi tải chi tiết đơn hàng");
    } finally {
      setLoadingOrderItems(false);
    }
  };

  // ----------------------------------------------------
  // CATEGORY ACTIONS
  // ----------------------------------------------------
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameCate: newCategoryName })
      });
      const data = await res.json();
      if (data.success) {
        setCategories(prev => [data.data, ...prev]);
        setNewCategoryName("");
        showAlert("Thêm danh mục thành công!");
      } else {
        showAlert(data.message || "Thêm thất bại", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Lỗi khi thêm danh mục", "error");
    }
  };

  const handleDeleteCategory = async (idCate) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này? Hợp đồng sản phẩm liên quan sẽ bị ảnh hưởng.")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/categories/${idCate}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setCategories(prev => prev.filter(c => c.idCate !== idCate));
        showAlert("Xóa danh mục thành công!");
      } else {
        showAlert(data.message || "Xóa danh mục thất bại", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Lỗi máy chủ khi xóa danh mục", "error");
    }
  };

  // ----------------------------------------------------
  // PRODUCT ACTIONS
  // ----------------------------------------------------
  const openAddProductModal = () => {
    setSelectedProduct(null);
    setProductForm({
      ProName: "",
      cost: "",
      discost: "",
      discount: "",
      idcategory: categories[0]?.idCate || "",
      ProDes: "",
      description: "",
      sku: "",
      tags: "",
      sizes: "",
      colors: "",
      ProPic: ""
    });
    setShowProductModal(true);
  };

  const openEditProductModal = (prod) => {
    setSelectedProduct(prod);
    // Extrapolate raw image path from full API URL (strip http://.../public/)
    const fullPrefix = `${API_BASE_URL}/public/`;
    const cleanPic = prod.ProPic.replace(fullPrefix, "");

    setProductForm({
      ProName: prod.ProName || "",
      cost: prod.cost || "",
      discost: prod.discost || "",
      discount: prod.discount || "",
      idcategory: prod.idcategory || "",
      ProDes: prod.ProDes || "",
      description: prod.description || "",
      sku: prod.sku || "",
      tags: prod.tags || "",
      sizes: prod.sizes || "",
      colors: prod.colors || "",
      ProPic: cleanPic
    });
    setShowProductModal(true);
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...productForm, [name]: value };

    if (name === "discost" || name === "discount") {
      const discostVal = name === "discost" ? parseFloat(value) : parseFloat(productForm.discost);
      const discountVal = name === "discount" ? parseFloat(value) : parseFloat(productForm.discount);

      if (!isNaN(discostVal) && !isNaN(discountVal) && discountVal > 0) {
        const calculatedCost = Math.round(discostVal * (1 - discountVal / 100));
        updatedForm.cost = calculatedCost.toString();
      } else if (!isNaN(discostVal) && (isNaN(discountVal) || discountVal === 0)) {
        updatedForm.cost = discostVal.toString();
      }
    } else if (name === "cost") {
      const costVal = parseFloat(value);
      const discostVal = parseFloat(productForm.discost);

      if (!isNaN(costVal) && !isNaN(discostVal) && discostVal > 0) {
        const calculatedDiscount = Math.round(((discostVal - costVal) / discostVal) * 100);
        updatedForm.discount = calculatedDiscount > 0 ? calculatedDiscount.toString() : "";
      }
    }

    setProductForm(updatedForm);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.ProName || !productForm.cost) {
      alert("Vui lòng nhập tên và giá sản phẩm");
      return;
    }

    const isEdit = !!selectedProduct;
    const url = isEdit
      ? `${API_BASE_URL}/api/admin/products/${selectedProduct.id}`
      : `${API_BASE_URL}/api/admin/products`;

    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm)
      });
      const data = await res.json();

      if (data.success) {
        showAlert(isEdit ? "Cập nhật sản phẩm thành công!" : "Thêm sản phẩm thành công!");
        setShowProductModal(false);
        // Refresh products and stats
        const resProds = await fetch(`${API_BASE_URL}/api/products`);
        const dataProds = await resProds.json();
        setProducts(dataProds);
      } else {
        alert(data.message || "Lỗi lưu sản phẩm");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối máy chủ");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showAlert("Xóa sản phẩm thành công!");
      } else {
        showAlert(data.message || "Xóa sản phẩm thất bại", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Lỗi khi xóa sản phẩm", "error");
    }
  };

  const formatStatus = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING": return "Chờ xử lý";
      case "SHIPPED": return "Đang giao hàng";
      case "DELIVERED": return "Đã giao hàng";
      case "CANCELLED": return "Đã hủy";
      default: return status;
    }
  };

  if (!isAdmin) {
    return (
      <div className="admin-page-container">
        {alert.text && <div className="admin-alert admin-alert-error" style={{ marginTop: "40px" }}>{alert.text}</div>}
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <h2 className="admin-title">Trang Quản Trị Furniro</h2>

      {alert.text && (
        <div className={`admin-alert ${alert.type === "error" ? "admin-alert-error" : "admin-alert-success"}`}>
          {alert.text}
        </div>
      )}

      <div className="admin-dashboard-layout">
        {/* Navigation Sidebar */}
        <div className="admin-sidebar">
          <button className={`admin-nav-btn ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
            Quản lý Đơn hàng ({orders.length})
          </button>
          <button className={`admin-nav-btn ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
            Quản lý Sản phẩm ({products.length})
          </button>
          <button className={`admin-nav-btn ${activeTab === "categories" ? "active" : ""}`} onClick={() => setActiveTab("categories")}>
            Quản lý Danh mục ({categories.length})
          </button>
          <button className={`admin-nav-btn ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
            Danh sách Người dùng ({users.length})
          </button>
          <button className={`admin-nav-btn ${activeTab === "feedbacks" ? "active" : ""}`} onClick={() => setActiveTab("feedbacks")}>
            Phản hồi Khách hàng ({feedbacks.length})
          </button>
        </div>

        {/* Dynamic Panel Content */}
        <div className="admin-main-panel">
          {loading ? (
            <p>Đang tải dữ liệu hệ thống...</p>
          ) : (
            <>
              {/* ORDERS TAB */}
              {activeTab === "orders" && (
                <div>
                  <h3 className="panel-section-title">Danh sách đơn hàng</h3>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Đơn hàng</th>
                          <th>Khách hàng</th>
                          <th>Ngày đặt</th>
                          <th>Tổng cộng</th>
                          <th>Phương thức TT</th>
                          <th>Trạng thái</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.order_id}>
                            <td>#{o.order_id}</td>
                            <td>{o.first_name} {o.last_name}</td>
                            <td>{new Date(o.created_at).toLocaleDateString("vi-VN")}</td>
                            <td>{parseFloat(o.total_price).toLocaleString()} đ</td>
                            <td>{o.payment_method === "bank" ? "Chuyển khoản" : "COD"}</td>
                            <td>
                              <select
                                className={`admin-status-select status-${o.status?.toLowerCase()}`}
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.order_id, e.target.value)}
                              >
                                <option value="PENDING">Chờ xử lý</option>
                                <option value="SHIPPED">Đang giao hàng</option>
                                <option value="DELIVERED">Đã giao hàng</option>
                                <option value="CANCELLED">Đã hủy</option>
                              </select>
                            </td>
                            <td>
                              <button className="admin-action-btn btn-view" onClick={() => handleViewOrderDetail(o)}>Xem chi tiết</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PRODUCTS TAB */}
              {activeTab === "products" && (
                <div>
                  <div className="panel-header-actions">
                    <h3 className="panel-section-title">Quản lý sản phẩm</h3>
                    <button className="admin-btn-primary" onClick={openAddProductModal}>Thêm sản phẩm mới</button>
                  </div>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Hình ảnh</th>
                          <th>Tên sản phẩm</th>
                          <th>SKU</th>
                          <th>Giá bán</th>
                          <th>Đánh giá</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p.id}>
                            <td>
                              <img src={p.ProPic} alt={p.ProName} className="admin-table-product-img" />
                            </td>
                            <td><strong>{p.ProName}</strong></td>
                            <td>{p.sku || "N/A"}</td>
                            <td>{parseFloat(p.cost).toLocaleString()} đ</td>
                            <td>⭐ {p.rating || "0.0"} ({p.reviews || 0})</td>
                            <td>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button className="admin-action-btn btn-edit" onClick={() => openEditProductModal(p)}>Sửa</button>
                                <button className="admin-action-btn btn-delete" onClick={() => handleDeleteProduct(p.id)}>Xóa</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CATEGORIES TAB */}
              {activeTab === "categories" && (
                <div className="admin-split-grid">
                  <div>
                    <h3 className="panel-section-title">Danh sách danh mục</h3>
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Mã DM</th>
                            <th>Tên danh mục</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map(c => (
                            <tr key={c.idCate}>
                              <td>#{c.idCate}</td>
                              <td><strong>{c.nameCate}</strong></td>
                              <td>
                                <button className="admin-action-btn btn-delete" onClick={() => handleDeleteCategory(c.idCate)}>Xóa</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="admin-form-card">
                    <h4>Tạo danh mục mới</h4>
                    <form onSubmit={handleAddCategory} className="admin-inline-form">
                      <div className="form-group">
                        <label>Tên danh mục</label>
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Ví dụ: Ghế Sofa, Bàn trà"
                          required
                        />
                      </div>
                      <button type="submit" className="admin-btn-primary" style={{ marginTop: "15px", width: "100%" }}>Thêm danh mục</button>
                    </form>
                  </div>
                </div>
              )}

              {/* USERS TAB */}
              {activeTab === "users" && (
                <div>
                  <h3 className="panel-section-title">Danh sách thành viên đăng ký</h3>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Tên tài khoản</th>
                          <th>Email</th>
                          <th>Số điện thoại</th>
                          <th>Vai trò</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id}>
                            <td>#{u.id}</td>
                            <td><strong>{u.username}</strong></td>
                            <td>{u.email}</td>
                            <td>{u.phone || "Chưa cập nhật"}</td>
                            <td>
                              <span className={`role-badge role-${u.role}`}>
                                {u.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* FEEDBACKS TAB */}
              {activeTab === "feedbacks" && (
                <div>
                  <h3 className="panel-section-title">Phản hồi từ biểu mẫu liên hệ</h3>
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Mã PH</th>
                          <th>Người gửi</th>
                          <th>Email</th>
                          <th>Tiêu đề</th>
                          <th>Nội dung lời nhắn</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedbacks.map(f => (
                          <tr key={f.fb_id}>
                            <td>#{f.fb_id}</td>
                            <td><strong>{f.your_name}</strong></td>
                            <td><a href={`mailto:${f.your_email}`}>{f.your_email}</a></td>
                            <td>{f.your_optional || "Trống"}</td>
                            <td className="feedback-message-cell">{f.your_msg}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết đơn hàng #{selectedOrder.order_id}</h3>
              <button className="modal-close-btn" onClick={() => setShowOrderModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="order-meta-info">
                <div className="meta-group">
                  <h5>Khách nhận hàng</h5>
                  <p><strong>Người nhận:</strong> {selectedOrder.first_name} {selectedOrder.last_name}</p>
                  <p><strong>Địa chỉ:</strong> {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.province}</p>
                </div>
                <div className="meta-group">
                  <h5>Đơn hàng</h5>
                  <p><strong>Ngày tạo:</strong> {new Date(selectedOrder.created_at).toLocaleString("vi-VN")}</p>
                  <p><strong>Thanh toán:</strong> {selectedOrder.payment_method === "bank" ? "Chuyển khoản" : "COD"}</p>
                  <p><strong>Trạng thái:</strong> {formatStatus(selectedOrder.status)}</p>
                </div>
              </div>

              <h4>Danh sách sản phẩm mua</h4>
              {loadingOrderItems ? (
                <p>Đang tải danh sách hàng...</p>
              ) : (
                <table className="modal-items-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th style={{ textAlign: "right" }}>Đơn giá</th>
                      <th style={{ textAlign: "center" }}>Số lượng</th>
                      <th style={{ textAlign: "right" }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map(item => (
                      <tr key={item.order_item_id}>
                        <td>{item.product_name}</td>
                        <td style={{ textAlign: "right" }}>{parseFloat(item.price).toLocaleString()} đ</td>
                        <td style={{ textAlign: "center" }}>{item.quantity}</td>
                        <td style={{ textAlign: "right" }}>{parseFloat(item.subtotal).toLocaleString()} đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="modal-summary">
                <p>Tổng số lượng: {selectedOrder.total_quantity}</p>
                <p className="total-price">Tổng giá trị: {parseFloat(selectedOrder.total_price).toLocaleString()} đ</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-container" style={{ maxWidth: "700px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedProduct ? `Chỉnh sửa sản phẩm #${selectedProduct.id}` : "Thêm sản phẩm mới"}</h3>
              <button className="modal-close-btn" onClick={() => setShowProductModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveProduct}>
              <div className="modal-body admin-product-form-grid">
                <div className="form-group">
                  <label>Tên sản phẩm *</label>
                  <input type="text" name="ProName" value={productForm.ProName} onChange={handleProductInputChange} placeholder="Ví dụ: Sofa da cao cấp" required />
                </div>
                <div className="form-group">
                  <label>Giá bán (VND) *</label>
                  <input type="number" name="cost" value={productForm.cost} onChange={handleProductInputChange} placeholder="Ví dụ: 12000000" required />
                </div>
                <div className="form-group">
                  <label>Giá chưa giảm (VND - Tùy chọn)</label>
                  <input type="number" name="discost" value={productForm.discost} onChange={handleProductInputChange} placeholder="Ví dụ: 15000000" />
                </div>
                <div className="form-group">
                  <label>Mức giảm (%)</label>
                  <input type="number" name="discount" value={productForm.discount} onChange={handleProductInputChange} placeholder="Ví dụ: 20" />
                </div>
                <div className="form-group">
                  <label>Danh mục</label>
                  <select name="idcategory" value={productForm.idcategory} onChange={handleProductInputChange}>
                    {categories.map(c => (
                      <option key={c.idCate} value={c.idCate}>{c.nameCate}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Chọn ảnh từ thư mục *</label>
                  <select name="ProPic" value={productForm.ProPic} onChange={handleProductInputChange} required>
                    <option value="">-- Chọn ảnh sản phẩm --</option>
                    {availableImages.map(imgName => (
                      <option key={imgName} value={`img/${imgName}`}>{imgName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Mã sản phẩm (SKU)</label>
                  <input type="text" name="sku" value={productForm.sku} onChange={handleProductInputChange} placeholder="Ví dụ: SS-204" />
                </div>
                <div className="form-group">
                  <label>Mô tả ngắn</label>
                  <input type="text" name="ProDes" value={productForm.ProDes} onChange={handleProductInputChange} placeholder="Ví dụ: Sofa da sang trọng..." />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>Mô tả chi tiết</label>
                  <textarea name="description" value={productForm.description} onChange={handleProductInputChange} placeholder="Nhập mô tả đầy đủ về chất liệu, thông số kỹ thuật..." rows="4"></textarea>
                </div>
                <div className="form-group">
                  <label>Kích thước có sẵn (ngăn cách bằng dấu phẩy)</label>
                  <input type="text" name="sizes" value={productForm.sizes} onChange={handleProductInputChange} placeholder="Ví dụ: L,XL,M" />
                </div>
                <div className="form-group">
                  <label>Màu sắc (ngăn cách bằng dấu phẩy)</label>
                  <input type="text" name="colors" value={productForm.colors} onChange={handleProductInputChange} placeholder="Ví dụ: Red,Blue,#B88E2F" />
                </div>
                <div className="form-group">
                  <label>Tags (ngăn cách bằng dấu phẩy)</label>
                  <input type="text" name="tags" value={productForm.tags} onChange={handleProductInputChange} placeholder="Ví dụ: sofa,livingroom" />
                </div>
              </div>
              <div className="modal-footer" style={{ padding: "20px 24px", borderTop: "1px solid #eee", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" className="btn-cancel-profile" onClick={() => setShowProductModal(false)}>Hủy</button>
                <button type="submit" className="admin-btn-primary">Lưu sản phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Subscribe />
    </div>
  );
}
