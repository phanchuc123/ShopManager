import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from './pages/Register';
import Cart from './pages/Cart';
import ProductDetail from "./pages/ProductDetail";
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Help from './pages/Help';
import Admin from './pages/Admin';
function App() {
 

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Header/>
      <Routes>
        <Route path="/" element = {<Home/>}/>
        <Route path="/shop" element = {<Shop/>}/>
        <Route path="/about" element = {<About/>}/>
        <Route path="/contact" element = {<Contact/>}/>
        <Route path="/product/:id" element = {<ProductDetail/>}/>
        <Route path="/login" element = {<Login/>}/>
        <Route path="/register" element = {<Register/>}/>
        <Route path="/cart" element = {<Cart/>}/>
        <Route path="/checkout" element = {<Checkout/>}/>
        <Route path="/profile" element = {<Profile/>}/>
        <Route path="/help" element = {<Help/>}/>
        <Route path="/admin" element = {<Admin/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
