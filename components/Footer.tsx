
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f2f0e6] text-[#4a4a4a] pt-20 pb-10 border-t border-gray-200/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Logo Section */}
        <div className="flex justify-center mb-16">
          <Link to="/" className="transition-transform hover:scale-105 duration-500">
            <img 
              src="https://res.cloudinary.com/dgabaplay/image/upload/v1767779771/Green_and_White_Elegant_India_Fashion_Brand_Logo_i4wpn2.png" 
              alt="Sudrsya Logo" 
              className="h-24 md:h-32 object-contain"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
          {/* Left Side: Quick Links */}
          <div>
            <h4 className="text-gray-900 font-bold text-xl mb-10 uppercase tracking-widest">Quick links</h4>
            <ul className="space-y-6 text-sm font-medium uppercase tracking-[0.1em]">
              <li><Link to="/info/about" target="_blank" className="hover:text-maroon transition-colors block">ABOUT US</Link></li>
              <li><Link to="/info/terms" target="_blank" className="hover:text-maroon transition-colors block border-b border-gray-900 inline-block pb-0.5">TERMS AND CONDITIONS</Link></li>
              <li><Link to="/info/privacy" target="_blank" className="hover:text-maroon transition-colors block">PRIVACY POLICY</Link></li>
              <li><Link to="/info/shipping" target="_blank" className="hover:text-maroon transition-colors block">SHIPPING & DELIVERY</Link></li>
              <li><Link to="/info/returns" target="_blank" className="hover:text-maroon transition-colors block">RETURNS & EXCHANGE</Link></li>
              <li><Link to="/info/faq" target="_blank" className="hover:text-maroon transition-colors block">FREQUENTLY ASKED QUESTIONS</Link></li>
              <li><Link to="/info/contact" target="_blank" className="hover:text-maroon transition-colors block">CONTACT US</Link></li>
            </ul>
          </div>

          {/* Right Side: Contact Us */}
          <div>
            <h4 className="text-gray-900 font-bold text-xl mb-10 uppercase tracking-widest">CONTACT US</h4>
            <div className="space-y-8 text-base">
              <p className="font-medium">Contact no: 6264747608</p>
              <p className="font-medium">Office hours: Mon- Sat (10.30am - 6.30 pm)</p>
              <p className="font-medium">Email: info.sudrsya@gmail.com</p>
            </div>
          </div>
        </div>
        
        <div className="mt-24 pt-8 border-t border-gray-300/30 flex flex-col items-center space-y-4">
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.5em]">
            &copy; {new Date().getFullYear()} SUDRSYA | ALANKARA TRADITIONAL ELEGANCE
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Developed by{' '}
            <a 
              href="https://www.madhwainfotech.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-maroon hover:text-gold transition-colors underline decoration-2 underline-offset-4"
            >
              MADHWA INFOTECH
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
