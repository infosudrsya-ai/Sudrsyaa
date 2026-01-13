
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import AdminDashboard from './admin/Dashboard';
import AddProduct from './admin/AddProduct';
import AdminLogin from './pages/AdminLogin';
import InfoPage from './pages/InfoPage';
import { useCart } from './useCart';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, getOfferDetails, applyCoupon, removeCoupon } = useCart();
  const offerDetails = getOfferDetails();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar cartCount={cart.reduce((a, b) => a + b.quantity, 0)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onAddToCart={addToCart} />} />
            <Route path="/products" element={<ProductList onAddToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetails onAddToCart={addToCart} />} />
            <Route path="/cart" element={
              <CartPage 
                cart={cart} 
                onUpdateQty={updateQuantity} 
                onRemove={removeFromCart} 
                offerDetails={offerDetails}
                applyCoupon={applyCoupon}
                removeCoupon={removeCoupon}
              />
            } />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin.dashbord" element={<AdminDashboard />} />
            <Route path="/admin/add" element={<AddProduct />} />
            <Route path="/info/:type" element={<InfoPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
