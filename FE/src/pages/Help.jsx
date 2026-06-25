import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Panel from "../components/Panel.jsx";
import imgHelp from "../img/Shop.png";
import Subscribe from "../components/Subscribe.jsx";
import "../css/Help.css";

export default function Help() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") || "payments";
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };

  return (
    <section className="section-help">
      <Panel namelink="Trung tâm Hỗ trợ" imglink={imgHelp} />

      <div className="help-container">
        <div className="help-tabs">
          <button
            className={`help-tab-btn ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => handleTabChange("payments")}
          >
            Phương Thức Thanh Toán
          </button>
          <button
            className={`help-tab-btn ${activeTab === "returns" ? "active" : ""}`}
            onClick={() => handleTabChange("returns")}
          >
            Chính Sách Đổi Trả
          </button>
          <button
            className={`help-tab-btn ${activeTab === "policies" ? "active" : ""}`}
            onClick={() => handleTabChange("policies")}
          >
            Điều Khoản & Bảo Mật
          </button>
        </div>

        <div className="help-content">
          {activeTab === "payments" && (
            <div className="help-section-content">
              <h3>Phương Thức Thanh Toán</h3>
              <p className="help-intro">
                Furniro hỗ trợ nhiều hình thức thanh toán linh hoạt nhằm đem lại sự tiện lợi nhất cho khách hàng khi mua sắm:
              </p>

              <div className="payment-method-card">
                <h4>1. Thanh toán khi nhận hàng (COD)</h4>
                <p>
                  Quý khách sẽ thanh toán tiền mặt trực tiếp cho nhân viên giao hàng sau khi đã nhận sản phẩm và kiểm tra chất lượng. Đây là phương thức thanh toán an toàn và phổ biến nhất.
                </p>
              </div>

              <div className="payment-method-card">
                <h4>2. Chuyển khoản ngân hàng trực tiếp</h4>
                <p>
                  Quý khách chuyển khoản tổng giá trị đơn hàng qua một trong các tài khoản ngân hàng của Furniro dưới đây. Sau khi nhận được thanh toán, chúng tôi sẽ lập tức liên hệ và giao hàng.
                </p>
                <div className="bank-details-box">
                  <p><strong>Tên chủ tài khoản:</strong> CÔNG TY CỔ PHẦN FURNIRO VIỆT NAM</p>
                  <p><strong>Ngân hàng:</strong> Vietcombank (Chi nhánh Đà Nẵng)</p>
                  <p><strong>Số tài khoản:</strong> 1024 8888 9999</p>
                  <p><strong>Nội dung chuyển khoản:</strong> Mã đơn hàng (Ví dụ: #105)</p>
                </div>
              </div>

              <div className="payment-method-card">
                <h4>3. Hỗ trợ mua trả góp</h4>
                <p>
                  Chúng tôi liên kết với các ngân hàng lớn để cung cấp chương trình trả góp lãi suất 0% thông qua thẻ tín dụng cho các đơn hàng có giá trị từ 10.000.000 đ trở lên.
                </p>
              </div>
            </div>
          )}

          {activeTab === "returns" && (
            <div className="help-section-content">
              <h3>Chính Sách Đổi Trả & Hoàn Tiền</h3>
              <p className="help-intro">
                Để đảm bảo sự hài lòng tối đa, Furniro cam kết hỗ trợ khách hàng đổi mới hoặc hoàn tiền đối với các trường hợp lỗi sản xuất hoặc không vừa ý:
              </p>

              <div className="help-policy-block">
                <h4>1. Thời hạn đổi trả hàng</h4>
                <p>
                  Quý khách có quyền đổi trả sản phẩm trong vòng <strong>7 ngày</strong> kể từ ngày ký nhận bàn giao hàng từ nhân viên vận chuyển.
                </p>
              </div>

              <div className="help-policy-block">
                <h4>2. Điều kiện áp dụng đổi trả</h4>
                <ul>
                  <li>Sản phẩm phải còn nguyên vẹn tem, nhãn mác của nhà sản xuất.</li>
                  <li>Sản phẩm chưa qua sử dụng, không bị trầy xước, dính bẩn hoặc hư hại do lỗi người sử dụng.</li>
                  <li>Có đầy đủ hóa đơn mua hàng hoặc thông tin đặt hàng trên hệ thống của Furniro.</li>
                </ul>
              </div>

              <div className="help-policy-block">
                <h4>3. Quy trình thực hiện đổi trả</h4>
                <ol>
                  <li>Liên hệ bộ phận Chăm sóc khách hàng thông qua Hotline <strong>1900 1024</strong> hoặc gửi email về <strong>support@furniro.com</strong> kèm hình ảnh sản phẩm.</li>
                  <li>Sau khi yêu cầu được xác nhận, quý khách có thể gửi hàng về kho của chúng tôi hoặc nhân viên vận chuyển sẽ đến tận nơi nhận lại sản phẩm (phí vận chuyển đổi trả sẽ được thông báo cụ thể).</li>
                  <li>Furniro sẽ tiến hành đổi sản phẩm mới hoặc hoàn tiền qua tài khoản ngân hàng trong vòng 3-5 ngày làm việc kể từ lúc nhận được hàng trả về.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === "policies" && (
            <div className="help-section-content">
              <h3>Điều Khoản Sử Dụng & Chính Sách Bảo Mật</h3>
              <p className="help-intro">
                An toàn thông tin của khách hàng là ưu tiên hàng đầu tại Furniro. Dưới đây là chính sách bảo mật chi tiết:
              </p>

              <div className="help-policy-block">
                <h4>1. Thu thập thông tin cá nhân</h4>
                <p>
                  Chúng tôi thu thập các thông tin cơ bản gồm: Tên, Email, Số điện thoại và Địa chỉ giao hàng khi bạn đăng ký tài khoản hoặc tiến hành mua sản phẩm. Thông tin này chỉ được sử dụng để xử lý đơn hàng và cung cấp dịch vụ tốt nhất.
                </p>
              </div>

              <div className="help-policy-block">
                <h4>2. Bảo mật thông tin giao dịch</h4>
                <p>
                  Mọi thông tin giao dịch thẻ hoặc ngân hàng của bạn đều được mã hóa bằng công nghệ SSL bảo mật cao và không được lưu trữ trên máy chủ của chúng tôi để tránh nguy cơ rò rỉ dữ liệu.
                </p>
              </div>

              <div className="help-policy-block">
                <h4>3. Chia sẻ thông tin với bên thứ ba</h4>
                <p>
                  Furniro cam kết KHÔNG bán, chia sẻ hay trao đổi thông tin khách hàng cho bên thứ ba vì mục đích thương mại. Thông tin chỉ được chia sẻ duy nhất cho các đối tác vận chuyển để thực hiện việc giao sản phẩm đến tay bạn.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Subscribe />
    </section>
  );
}
