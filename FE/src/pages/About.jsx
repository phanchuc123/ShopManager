import about1 from "../img/about1.jpg"
import Subscribe from "../components/Subscribe";
import Panel from "../components/Panel";
import imgAbout from "../img/Shop.png";
import "../css/About.css";
export default function About(){
    return(
        <>
        <Panel namelink="Giới thiệu" imglink={imgAbout} />
        <section className="section_about">
            <div className="container-intro">
                <div className="header-intro">
                    <h2>Chúng tôi là ai</h2>
                    <p>Furniro, được đặt tên từ Furniture Innovation (Sự đổi mới về nội thất), được thành lập tại Hoa Kỳ vào năm 2010 bởi một nhóm doanh nhân trẻ dưới hình thức liên doanh với nhà sản xuất có 30 năm kinh nghiệm tại Malaysia. Furniro giới thiệu xu hướng nội thất RTA (Ready-To-Assemble - Tự lắp ráp) mới ra thị trường với triết lý: phù hợp với không gian, phong cách và ngân sách của bạn.
                       Thông qua đầu tư trực tiếp từ nhà sản xuất, Furniro có thể tham gia sâu vào quy trình nghiên cứu và phát triển sản phẩm, kiểm soát chất lượng, vận hành, chuỗi cung ứng và chăm sóc khách hàng. Đội ngũ thiết kế và kỹ sư của chúng tôi luôn hướng tới việc tạo ra những sản phẩm thiết kế đẹp hơn với chi phí thấp nhất cùng chất lượng bền bỉ theo thời gian.
                       Được chế tạo từ 90% gỗ cao su tái chế của Malaysia, Furniro cam kết mang lại đồ nội thất gia đình tiện lợi, giá cả phải chăng, độc đáo và bền vững. Cho dù bạn đang ở căn hộ đầu tiên hay tìm kiếm giải pháp tiết kiệm để trang trí không gian sống mơ ước, Furniro luôn là lựa chọn thiết thực với danh mục sản phẩm đa dạng và dễ dàng lắp ráp.
                    </p>
                </div>
                <div className="ship-intro">
                    <h2>Phạm vi giao hàng</h2>
                    <ul>
                        <li>Việt Nam</li>
                        <li>Hoa Kỳ</li>
                        <li>Canada</li>
                        <li>Mexico</li>
                    </ul>
                </div>
            </div>  
            <div className="img-intro">
                <img src={about1} alt="anh" />
            </div> 
            <div className="mission-intro">
                <h2>Furniro</h2>
                <p>Tại Furniro, chúng tôi mong muốn mang đồ nội thất gia đình đến gần hơn với tất cả mọi người. Bằng các thiết kế thực tiễn, lắp ráp dễ dàng và mức giá hợp lý, chúng tôi trao những sản phẩm tâm huyết trực tiếp tới cửa nhà bạn — giúp bạn kiến tạo một không gian sống tiện nghi và xinh đẹp.</p>
            </div>
            <div className="mission-item-intro">
                <div className="mission item1">
                    <h4>Giải pháp nội thất tiết kiệm</h4>
                    <p>Cung cấp giá trị tốt nhất và các giải pháp thực tế để trang hoàng tổ ấm của bạn.</p>
                </div>
                <div className="mission item2">
                    <h4>Thiết kế đa chức năng</h4>
                    <p>Kiểu dáng linh hoạt, đa dụng cho mọi góc nhỏ trong không gian sống của bạn.</p>
                </div>
                <div className="mission item3">
                    <h4>Danh mục sản phẩm đa dạng</h4>
                    <p>Hơn 1500 sản phẩm sẵn có với nhiều phong cách và mức giá khác nhau.</p>
                </div>
                <div className="mission item4">
                    <h4>Lấy khách hàng làm trọng tâm</h4>
                    <p>Xây dựng mối quan hệ bền chặt bằng việc mang lại dịch vụ khách hàng xuất sắc.</p>
                </div>
            </div>
            <div className="on-intro">
                <h2>Sản phẩm của chúng tôi hiện có tại</h2>
                <div className="on-item">
                    <div className="on-img">
                        <img src="https://www.furinno.com/wp-content/uploads/2025/01/Amazon.png" alt="anh" />
                    </div>
                    <div className="on-img">
                        <img src="	https://www.furinno.com/wp-content/uploads/2025/01/Walmart.png" alt="anh" />
                    </div>
                    <div className="on-img">
                        <img src="	https://www.furinno.com/wp-content/uploads/2025/01/Home-Depot.png" alt="anh" />
                    </div>
                    <div className="on-img">
                        <img src="https://www.furinno.com/wp-content/uploads/2025/01/Target.png" alt="anh" />
                    </div>
                    <div className="on-img">
                        <img src="https://www.furinno.com/wp-content/uploads/2025/01/Lowes.png" alt="anh" />
                    </div>
                </div>
            </div>
        </section>
        <Subscribe />
        </>
    );
}