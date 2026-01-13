
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  return (
    <div className="w-full bg-white z-50 font-sans">
      {/* 1. Scrolling Announcement Bar (Left to Right) */}
      <div className="bg-[#0f1713] py-2 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee-reverse">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/90 font-light px-4">
            HERITAGE STUDIO — EXCLUSIVE FESTIVE COLLECTIONS LIVE &nbsp;&nbsp;&nbsp;&nbsp;
            FREE SHIPPING ON ORDERS ABOVE ₹7000 &nbsp;&nbsp;&nbsp;&nbsp;
            FESTIVE VIBES: BUY 2 GET 1 FREE ON SELECTED ITEMS &nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          {/* Duplicate for seamless loop */}
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/90 font-light px-4">
            HERITAGE STUDIO — EXCLUSIVE FESTIVE COLLECTIONS LIVE &nbsp;&nbsp;&nbsp;&nbsp;
            FREE SHIPPING ON ORDERS ABOVE ₹7000 &nbsp;&nbsp;&nbsp;&nbsp;
            FESTIVE VIBES: BUY 2 GET 1 FREE ON SELECTED ITEMS &nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>

      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* 2. Top Bar: Search, Logo, and User Actions */}
          <div className="flex justify-between items-center py-5 md:py-8">
            {/* Left: Search Icon */}
            <div className="flex-1 flex items-center">
               <button className="text-gray-500 hover:text-black transition-colors">
                <Search size={20} strokeWidth={1.2} />
              </button>
            </div>

            {/* Center: Brand Logo */}
            <div className="flex-[2] flex justify-center">
              <Link to="/" className="transform transition-transform hover:scale-105 duration-500">
                <img 
                  src="https://res.cloudinary.com/dgabaplay/image/upload/v1767779771/Green_and_White_Elegant_India_Fashion_Brand_Logo_i4wpn2.png" 
                  alt="Sudrsya Logo" 
                  className="h-12 md:h-24 object-contain"
                />
              </Link>
            </div>

            {/* Right: Cart (Admin Login Removed) */}
            <div className="flex-1 flex items-center justify-end space-x-5 md:space-x-8 text-gray-600">
              <Link to="/cart" className="relative hover:text-black transition-colors">
                <ShoppingBag size={21} strokeWidth={1.2} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-maroon text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* 3. Bottom Bar: Categorical Navigation */}
          <div className="flex justify-center pb-6 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-6 md:space-x-12 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#333] whitespace-nowrap px-4">
              <NavLink to="/products">Jewellery</NavLink>
              <NavLink to="/products?category=Sarees">Saree</NavLink>
              <NavLink to="/products?category=Lehenga">Lehenga</NavLink>
              <NavLink to="/products?price=99" className="text-maroon">Under ₹99</NavLink>
              <NavLink to="/products?category=Earrings">Buy 2 Get 1</NavLink>
              <NavLink to="/products">Collections</NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Global Navbar Styles and Animations */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-reverse {
          display: inline-block;
          animation: marquee-reverse 20s linear infinite;
        }

        .nav-link-item {
          position: relative;
          padding-bottom: 6px;
          cursor: pointer;
        }
        
        .nav-link-item::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1.5px;
          bottom: 0;
          left: 0;
          background-color: var(--theme-gold); 
          transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .nav-link-item:hover::after {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

const NavLink = ({ to, children, className = "" }: { to: string, children: React.ReactNode, className?: string }) => (
  <Link 
    to={to} 
    className={`nav-link-item hover:text-black transition-colors duration-300 ${className}`}
  >
    {children}
  </Link>
);

export default Navbar;
