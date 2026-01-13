
import React, { useState, useEffect } from 'react';
// Corrected: Using named imports for react-router-dom to fix property resolution errors
import { useSearchParams } from 'react-router-dom';
import { firestoreHelpers } from '../firebase';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal } from 'lucide-react';

const ProductList: React.FC<{ onAddToCart: (p: Product) => void }> = ({ onAddToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    firestoreHelpers.getProducts().then(data => {
      setProducts(data as Product[]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (currentCategory === 'All') {
      setFiltered(products);
    } else {
      setFiltered(products.filter(p => p.category === currentCategory));
    }
  }, [currentCategory, products]);

  const categories = ['All', ...Object.values(Category)];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-maroon/10 pb-8">
        <div>
          <h1 className="text-5xl font-serif text-maroon font-bold mb-2">Our Collection</h1>
          <p className="text-maroon/60 italic font-light uppercase tracking-widest text-sm">Timeless Craftsmanship</p>
        </div>
        <div className="mt-6 md:mt-0 flex items-center space-x-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          <SlidersHorizontal size={20} className="text-maroon mr-4 flex-shrink-0" />
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${currentCategory === cat ? 'bg-maroon text-white shadow-lg' : 'bg-white text-maroon/60 hover:text-maroon border border-maroon/10'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-64 md:h-96 bg-gray-200 animate-pulse rounded-[1rem] md:rounded-sm"></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-maroon/60 text-xl font-serif">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
