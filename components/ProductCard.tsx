
import React from 'react';
import { Link } from 'react-router-dom';
import { Product, Category, ELIGIBLE_FOR_OFFER } from '../types';
import { ShoppingBag, Lock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isEligible = ELIGIBLE_FOR_OFFER.includes(product.category);
  
  // Calculate original price correctly based on final price and discount percentage
  const originalPrice = product.discount > 0 
    ? Math.round(product.price / (1 - product.discount / 100)) 
    : product.price;

  return (
    <div className={`group relative bg-white overflow-hidden transition-all duration-500 flex flex-col h-full ${product.isSoldOut ? 'opacity-75' : ''}`}>
      <Link to={`/product/${product.id}`} className="block overflow-hidden relative aspect-[3/4] rounded-[2rem] bg-gray-50">
        <img 
          src={product.images[0] || 'https://picsum.photos/400/600'} 
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ${product.isSoldOut ? 'grayscale cursor-not-allowed' : ''}`}
        />
        
        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col space-y-2 z-10">
          {product.isSoldOut ? (
            <div className="bg-gray-800 text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Sold Out</div>
          ) : (
            <>
              {isEligible && (
                <div className="bg-gold text-maroon text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg backdrop-blur-sm bg-white/90 border border-gold/20">
                  Buy 2 Get 1
                </div>
              )}
              {product.trending && (
                <div className="bg-blue-600 text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Trending</div>
              )}
              {product.fastSelling && (
                <div className="bg-orange-600 text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Fast Selling</div>
              )}
              {product.limitedStock && (
                <div className="bg-red-600 text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Limited Stock</div>
              )}
            </>
          )}
        </div>

        {/* Action Overlay */}
        {!product.isSoldOut && (
          <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
            <button 
              onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
              className="w-full py-4 bg-white/95 backdrop-blur-md text-gray-900 rounded-2xl font-bold uppercase tracking-widest hover:bg-maroon hover:text-white transition-all flex items-center justify-center space-x-2 shadow-2xl"
            >
              <ShoppingBag size={16} />
              <span>Add to Cart</span>
            </button>
          </div>
        )}
        
        {product.isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
             <div className="bg-white/80 p-3 rounded-full"><Lock size={20} className="text-gray-400" /></div>
          </div>
        )}
      </Link>
      
      <div className="pt-6 px-2 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.category}</p>
          <div className="flex items-center text-maroon">
            <span className="text-xs font-bold font-mono uppercase tracking-tighter">Code: {product.code}</span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`} className="block mb-2 group-hover:text-gold transition-colors flex-grow">
          <h3 className="text-xl font-serif text-gray-900 font-bold leading-tight">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-3 mt-auto">
          <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
