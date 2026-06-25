import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../utils/api";
import Subscribe from "../components/Subscribe";
import "../css/Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState({ username: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Feedback states
  const [alert, setAlert] = useState({ text: "", type: "" }); // type: "success" | "error"

  // Order history states
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingOrderItems, setLoadingOrderItems] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setAlert({ text: "Bạn chưa đăng nhập. Đang chuyển hướng đến trang Đăng nhập...", type: "error" });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEditForm({
        username: parsedUser.username || "",
        phone: parsedUser.phone || "",
      });
    }
  }, [navigate]);

  // Fetch orders when orders tab is activated
  useEffect(() => {
    if (activeTab === "orders" && user) {
      fetchUserOrders();
    }
  }, [activeTab, user]);

  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/user/${user.id}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        setAlert({ text: data.message || "Không thể tải lịch sử đơn hàng", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setAlert({ text: "Lỗi kết nối máy chủ khi tải đơn hàng", type: "error" });
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setAlert({ text: "", type: "" });

    if (!editForm.username.trim()) {
      setAlert({ text: "Tên đăng nhập không được để trống", type: "error" });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          username: editForm.username,
          phone: editForm.phone,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setAlert({ text: "Cập nhật thông tin thành công!", type: "success" });
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setIsEditing(false);
      } else {
        setAlert({ text: data.message || "Cập nhật thông tin thất bại", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setAlert({ text: "Lỗi kết nối máy chủ khi cập nhật thông tin", type: "error" });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setAlert({ text: "", type: "" });

    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setAlert({ text: "Vui lòng nhập đầy đủ thông tin mật khẩu", type: "error" });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlert({ text: "Mật khẩu mới không trùng khớp", type: "error" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setAlert({ text: "Mật khẩu mới phải có tối thiểu 6 ký tự", type: "error" });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          username: user.username,
          phone: user.phone,
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setAlert({ text: "Thay đổi mật khẩu thành công!", type: "success" });
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setAlert({ text: data.message || "Thay đổi mật khẩu thất bại", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setAlert({ text: "Lỗi kết nối máy chủ khi đổi mật khẩu", type: "error" });
    }
  };

  const handleViewOrderDetail = async (order) => {
    setSelectedOrder(order);
    setLoadingOrderItems(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/order/${order.order_id}`);
      const data = await res.json();
      if (data.success) {
        setOrderItems(data.data.items || []);
      } else {
        alert("Không thể tải chi tiết đơn hàng");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối khi tải chi tiết đơn hàng");
    } finally {
      setLoadingOrderItems(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "status-pending";
      case "SHIPPED":
        return "status-shipped";
      case "DELIVERED":
        return "status-delivered";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const formatStatus = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "Chờ xử lý";
      case "SHIPPED":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Đã giao hàng";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="profile-page-container">
        {alert.text && (
          <div className="profile-alert profile-alert-error" style={{ marginTop: "40px" }}>
            {alert.text}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <h2 className="profile-title">Tài khoản của tôi</h2>

      {alert.text && (
        <div className={`profile-alert ${alert.type === "success" ? "profile-alert-success" : "profile-alert-error"}`}>
          {alert.text}
        </div>
      )}

      <div className="profile-tabs">
        <button
          className={`profile-tab-btn ${activeTab === "info" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("info");
            setAlert({ text: "", type: "" });
          }}
        >
          Thông tin cá nhân
        </button>
        <button
          className={`profile-tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("orders");
            setAlert({ text: "", type: "" });
          }}
        >
          Lịch sử đơn hàng
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "info" && (
          <div className="info-section">
            <div className="info-header">
              <h3>Thông tin tài khoản</h3>
              {!isEditing ? (
                <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                  Chỉnh sửa
                </button>
              ) : (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="btn-save-profile" onClick={handleSaveInfo}>
                    Lưu
                  </button>
                  <button
                    className="btn-cancel-profile"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({ username: user.username, phone: user.phone });
                      setAlert({ text: "", type: "" });
                    }}
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveInfo}>
              <div className="profile-form-group">
                <label>Tên người dùng</label>
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="profile-form-group">
                <label>Email (Không thể thay đổi)</label>
                <input type="email" value={user.email} disabled />
              </div>

              <div className="profile-form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  disabled={!isEditing}
                />
              </div>
            </form>

            <div className="password-change-section">
              <h4>Thay đổi mật khẩu</h4>
              <form onSubmit={handleChangePassword}>
                <div className="profile-form-group">
                  <label>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>

                <div className="profile-form-group">
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                  />
                </div>

                <div className="profile-form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Xác nhận mật khẩu mới"
                  />
                </div>

                <button type="submit" className="btn-save-profile" style={{ marginTop: "10px" }}>
                  Đổi mật khẩu
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h3>Đơn hàng của bạn</h3>
            {loadingOrders ? (
              <p>Đang tải danh sách đơn hàng...</p>
            ) : orders.length === 0 ? (
              <div className="no-orders">
                <p>Bạn chưa đặt đơn hàng nào.</p>
                <Link to="/shop" className="no-orders-btn">
                  Mua sắm ngay
                </Link>
              </div>
            ) : (
              <div className="orders-table-container">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Mã đơn hàng</th>
                      <th>Ngày đặt</th>
                      <th>Tổng cộng</th>
                      <th>Phương thức TT</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.order_id}>
                        <td>#{order.order_id}</td>
                        <td>{new Date(order.created_at).toLocaleDateString("vi-VN")}</td>
                        <td>{parseFloat(order.total_price).toLocaleString()} đ</td>
                        <td>{order.payment_method === "bank" ? "Chuyển khoản" : "Thanh toán khi nhận hàng"}</td>
                        <td>
                          <span className={`status-badge ${getStatusClass(order.status)}`}>
                            {formatStatus(order.status)}
                          </span>
                        </td>
                        <td>
                          <button className="btn-view-detail" onClick={() => handleViewOrderDetail(order)}>
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết đơn hàng #{selectedOrder.order_id}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="order-meta-info">
                <div className="meta-group">
                  <h5>Thông tin giao hàng</h5>
                  <p>
                    <strong>Người nhận:</strong> {selectedOrder.first_name} {selectedOrder.last_name}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {selectedOrder.address}, {selectedOrder.city},{" "}
                    {selectedOrder.province}
                  </p>
                </div>
                <div className="meta-group">
                  <h5>Thông tin đơn hàng</h5>
                  <p>
                    <strong>Ngày đặt:</strong> {new Date(selectedOrder.created_at).toLocaleString("vi-VN")}
                  </p>
                  <p>
                    <strong>Thanh toán:</strong>{" "}
                    {selectedOrder.payment_method === "bank"
                      ? "Chuyển khoản ngân hàng"
                      : "Thanh toán khi nhận hàng"}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                      {formatStatus(selectedOrder.status)}
                    </span>
                  </p>
                </div>
              </div>

              <h4>Sản phẩm đã đặt</h4>
              {loadingOrderItems ? (
                <p>Đang tải chi tiết sản phẩm...</p>
              ) : orderItems.length === 0 ? (
                <p>Không có thông tin sản phẩm.</p>
              ) : (
                <table className="modal-items-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th style={{ textAlign: "right" }}>Giá</th>
                      <th style={{ textAlign: "center" }}>Số lượng</th>
                      <th style={{ textAlign: "right" }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
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
                <p className="total-price">
                  Tổng thanh toán: {parseFloat(selectedOrder.total_price).toLocaleString()} đ
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Subscribe />
    </div>
  );
}
