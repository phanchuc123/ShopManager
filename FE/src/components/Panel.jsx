import logo from "../img/logo.png";
import "../css/Panel.css";
import { Link } from "react-router-dom";
export default function Panel({ namelink, imglink }) {
  return (
    <div className="container_panel" style={{backgroundImage: `url(${imglink})`}}>
      <div className="panel_intro">
        <div className="panel_logo">
          <img src={logo} alt="logo" />
        </div>
        <h1>{namelink}</h1>
        <div className="panel_transition">
          <p><Link className="linkHome" to="/">Home {" > "}</Link>{namelink}</p>
        </div>
      </div>
    </div>
  );
}
