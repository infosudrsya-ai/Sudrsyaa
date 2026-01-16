import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  return (
    /* Removed sticky and fixed positioning so it scrolls away */
    <div className="w-full bg-white z-50 font-sans relative">
      
      {/* 1. Scrolling Announcement Bar */}
      <div className="bg-[#0f1713] py-2 overflow-hidden border-b border-white/10">
        <div className="flex whitespace-nowrap animate-marquee-smooth">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/90 font-light px-4">
              HERITAGE STUDIO — EXCLUSIVE FESTIVE COLLECTIONS LIVE &nbsp;&nbsp;&nbsp;&nbsp;
              FREE SHIPPING ON ORDERS ABOVE ₹7000 &nbsp;&nbsp;&nbsp;&nbsp;
              FESTIVE VIBES: BUY 2 GET 1 FREE ON SELECTED ITEMS &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/90 font-light px-4">
              HERITAGE STUDIO — EXCLUSIVE FESTIVE COLLECTIONS LIVE &nbsp;&nbsp;&nbsp;&nbsp;
              FREE SHIPPING ON ORDERS ABOVE ₹7000 &nbsp;&nbsp;&nbsp;&nbsp;
              FESTIVE VIBES: BUY 2 GET 1 FREE ON SELECTED ITEMS &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>
      </div>

      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* 2. Top Bar: Search, Logo, and User Actions */}
          <div className="flex justify-between items-center py-4 md:py-8">
            {/* Left: Search Icon */}
            <div className="flex-1 flex items-center">
               <button className="text-gray-500 hover:text-black transition-colors p-1" aria-label="Search">
                <Search size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Center: Brand Logo */}
            <div className="flex-[2] flex justify-center">
              <Link to="/" className="transform transition-transform active:scale-95">
                <img 
                  src="https://res.cloudinary.com/dgabaplay/image/upload/v1767779771/Green_and_White_Elegant_India_Fashion_Brand_Logo_i4wpn2.png" 
                  alt="Sudrsya Logo" 
                  className="h-10 md:h-20 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Right: Cart */}
            <div className="flex-1 flex items-center justify-end text-gray-600">
              <Link to="/cart" className="relative hover:text-black transition-colors p-1">
                <ShoppingBag size={21} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#800000] text-white text-[8px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* 3. Bottom Bar: Categorical Navigation */}
          {/* Improved for Android touch scrolling */}
          <div className="flex justify-start md:justify-center pb-4 overflow-x-auto scrollbar-hide touch-pan-x">
            <div className="flex space-x-6 md:space-x-12 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#333] whitespace-nowrap px-2">
              <NavLink to="/products">Jewellery</NavLink>
              <NavLink to="/products?category=Sarees">Saree</NavLink>
              <NavLink to="/products?category=Lehenga">Lehenga</NavLink>
              <NavLink to="/products?price=99" >Under ₹99</NavLink>
              <NavLink to="/products?category=Earrings">Buy 2 Get 1</NavLink>
              <NavLink to="/products">Collections</NavLink>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        @keyframes marquee-smooth {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        
        .animate-marquee-smooth {
          display: flex;
          animation: marquee-smooth 25s linear infinite;
          will-change: transform;
        }

        .nav-link-item {
          position: relative;
          padding-bottom: 4px;
        }
        
        .nav-link-item::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1.2px;
          bottom: 0;
          left: 0;
          background-color: #b8860b; 
          transition: width 0.3s ease;
        }

        /* Hover only works on desktop to avoid weird "stuck" underlines on mobile tap */
        @media (hover: hover) {
          .nav-link-item:hover::after {
            width: 100%;
          }
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
