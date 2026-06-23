import about1 from "../img/about1.jpg"
import Subscribe from "../components/Subscribe";
import Panel from "../components/Panel";
import imgAbout from "../img/Shop.png";
import "../css/About.css";
export default function About(){
    return(
        <>
        <Panel namelink="About" imglink={imgAbout} />
        <section className="section_about">
            <div className="container-intro">
                <div className="header-intro">
                    <h2>Who We Are</h2>
                    <p>Furniro, named from Furniture Innovation, was founded in the United States in 2010 by a couple of young entrepreneurs as a joint venture to the 30-years experienced manufacturer in Malaysia. Furinno introduces a new trend of RTA (Ready-To-Assemble) furniture to the market with the concept to fit in your space, your style, and fit on your budget.
                       Through direct investment by the manufacturer, Furinno is able to involve vertically in the process of product research and development, quality control, operation, supply chain, and customer services. Our designers and engineers set their sights on creating better designs at the lowest cost with the quality that sustains the period of use. 
                       Engineered with 90% recycled Malaysian rubberwood, Furinno is committed to making home furnishing easy affordable, and unique while remaining sustainable in the process. Whether you’re in your first apartment or looking for a budget-friendly way to create the space you want, Furinno is always your practical choice for a wide selection and easy to assemble furniture.
                    </p>
                </div>
                <div className="ship-intro">
                    <h2>Where do we ship ?</h2>
                    <ul>
                        <li>United States</li>
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
                <p>At Furniro, we make home furnishing accessible to everyone. With practical designs, easy assembly, and affordable prices, we bring intentional pieces directly to your door—helping you create a functional and beautiful home.</p>
            </div>
            <div className="mission-item-intro">
                <div className="mission item1">
                    <h4>Affordable Home Solutions</h4>
                    <p>Offering the best value and practical solution to furnish your home.</p>
                </div>
                <div className="mission item2">
                    <h4>Multifunctional Designs</h4>
                    <p>Versatile and flexible designs for every corner of your living space.</p>
                </div>
                <div className="mission item3">
                    <h4>Wide Selection of Products</h4>
                    <p>More than 1500 products available in various styles and prices.</p>
                </div>
                <div className="mission item4">
                    <h4>Customer-Centered</h4>
                    <p>Building strong relationships by providing excellent services.</p>
                </div>
            </div>
            <div className="on-intro">
                <h2>On furniture are available on</h2>
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