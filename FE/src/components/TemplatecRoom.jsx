import { Link } from 'react-router-dom'
import "../css/Template.css"
export default function TemplateRoom({tolink,picture,des}){
    return (
        <Link className="card" to ={tolink}>
            <div className="card_img">
                <img src={picture} alt="anh" />
            </div>
            <span className="card_des">{des}</span>
        </Link>
    );
}