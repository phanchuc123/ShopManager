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
function App() {
 

  return (
    <BrowserRouter basename="/ShopManager">
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
