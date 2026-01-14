import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { firestoreHelpers } from '../firebase';
import { Product, Category, ELIGIBLE_FOR_OFFER } from '../types';
import ProductCard from '../components/ProductCard';
import { Sparkles, Gift, ArrowRight } from 'lucide-react';

const Home: React.FC<{ onAddToCart: (p: Product) => void }> = ({ onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  // Hero Section Images
  const heroImages = [
    "https://res.cloudinary.com/dgabaplay/image/upload/v1768374300/gold-jewelry-with-gems-showcase_1_o499ys.jpg",
    "https://res.cloudinary.com/dgabaplay/image/upload/v1768328614/traditional-indian-wedding-jewelry_1_crkeid.jpg",
    "https://res.cloudinary.com/dgabaplay/image/upload/v1768328483/3484_z8u0kp.jpg"
  ];

  useEffect(() => {
    const fetch = async () => {
      const prods = await firestoreHelpers.getProducts();
      setProducts(prods as Product[]);
      setLoading(false);
    };
    fetch();

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sareeRoomProds = products.filter(p => p.category === Category.Sarees).slice(0, 4);
  const lehengaRoomProds = products.filter(p => p.category === Category.Lehenga).slice(0, 4);
  const newArrivals = [...products].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 4);

  const offerShowcaseProds = ELIGIBLE_FOR_OFFER.map(cat => {
    return products.find(p => p.category === cat);
  }).filter(Boolean) as Product[];

  const categoryImages = [
    { title: 'Sarees', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768327314/saree_qnzlcs.png' },
    { title: 'Lehenga', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768327474/lehenga_dll8lm.png' },
    { title: 'Earrings', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768326776/earings_kcusmb.webp' },
    { title: 'Neckpieces', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768326776/neckless_me69lo.png' },
    { title: 'Rings', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768326788/ring_qz11jg.png' },
    { title: 'Nose Pins', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768326775/nose2_nn1t7t.png' },
    { title: 'Anklets', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768326776/earings_kcusmb.webp' },
  ];

  return (
    <div className="bg-white text-gray-900">
      
      {/* Circular Categories Bar */}
      <section className="py-12 px-4 border-b border-gray-100 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto flex justify-center space-x-8 sm:space-x-12 min-w-max">
          {categoryImages.map((cat) => (
            <Link key={cat.title} to={`/products?category=${cat.title}`} className="group flex flex-col items-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-gray-100 group-hover:border-maroon transition-all duration-500 mb-3 p-1">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-maroon transition-colors">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === heroIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={img} className="w-full h-full object-cover transform scale-105 animate-slow-zoom" alt={`Slide ${idx}`} />
              <div className="absolute inset-0 bg-black/45"></div>
            </div>
          ))}
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <p className="uppercase tracking-[0.4em] text-[10px] mb-6 font-bold text-white/80">The 2024 Atelier Collection</p>
          <h1 className="text-5xl md:text-8xl font-serif mb-8 leading-tight tracking-tight">A Legacy of Grace</h1>
          <p className="text-lg md:text-xl mb-12 font-serif italic text-white/90 max-w-xl mx-auto">
            "Hand-curated threads and metals that tell a thousand-year story."
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/products?category=Sarees" className="bg-white text-gray-900 px-10 py-4 font-bold text-xs uppercase tracking-widest hover:bg-maroon hover:text-white transition-all text-center">
              Explore Sarees
            </Link>
            <Link to="/products" className="bg-white text-gray-900 px-10 py-4 font-bold text-xs uppercase tracking-widest hover:bg-maroon hover:text-white transition-all text-center">
              The Jewellery Box
            </Link>
          </div>
        </div>
      </section>

      {/* Section 1: The Saree Room (Now Centered and Responsive) */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-gold font-bold uppercase tracking-widest text-[10px] mb-2 block">Draped in Tradition</span>
          <h2 className="text-4xl md:text-6xl font-serif text-gray-900 font-bold mb-4">The Saree Room</h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full opacity-30 mb-6"></div>
          <Link to="/products?category=Sarees" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-maroon hover:opacity-70 transition-opacity">
            <span>View All Drapes</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse rounded-[1.5rem] md:rounded-[2rem]"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {sareeRoomProds.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </section>

      {/* Section 2: New Arrivals (Centered) */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-maroon font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Fresh from the Atelier</span>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 font-bold mb-4">New Arrivals</h2>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full opacity-30"></div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: The Lehenga Room (New Section Added) */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-gold font-bold uppercase tracking-widest text-[10px] mb-2 block">Royal Silhouettes</span>
          <h2 className="text-4xl md:text-6xl font-serif text-gray-900 font-bold mb-4">The Lehenga Room</h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full opacity-30 mb-6"></div>
          <Link to="/products?category=Lehenga" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-maroon hover:opacity-70 transition-opacity">
            <span>Explore Collection</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse rounded-[1.5rem] md:rounded-[2rem]"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {lehengaRoomProds.length > 0 ? (
              lehengaRoomProds.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400 italic font-serif">
                New bridal collections arriving soon...
              </div>
            )}
          </div>
        )}
      </section>

      {/* Section 4: Buy 2 Get 1 FREE */}
      <section className="py-16 md:py-24 px-4 bg-[#0a1128] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center space-x-3 bg-white/10 px-6 py-2 rounded-full mb-8 border border-white/10 backdrop-blur-sm animate-pulse">
              <Gift size={20} className="text-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]">The Heritage Celebration Offer</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-serif font-bold mb-6 tracking-tight">Buy 2 Get 1 FREE</h2>
            <p className="text-white/60 max-w-2xl mx-auto italic font-serif text-lg md:text-xl px-4">
              Select any three masterpieces from our jewellery collections, and the lowest priced treasure is our gift to your heritage.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8">
            {offerShowcaseProds.map(product => (
              <Link 
                key={product.id} 
                to={`/products?category=${product.category}`}
                className="group relative aspect-[3/4] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-gold/50 transition-all duration-700 bg-gray-900 shadow-2xl"
              >
                <img src={product.images[0]} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt={product.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-transparent to-transparent opacity-80 group-hover:opacity-30 transition-opacity"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-gold mb-2 block opacity-0 group-hover:opacity-100 transition-opacity">Discover</span>
                  <h3 className="text-lg md:text-2xl font-serif font-bold leading-tight group-hover:text-gold transition-colors">{product.category}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 md:mt-20 text-center">
            <Link to="/products" className="inline-block border-2 border-white/20 px-8 md:px-12 py-4 md:py-5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-[#0a1128] transition-all">
              Curate Your Set
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Sparkles className="text-gold mx-auto mb-8" size={32} />
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 font-bold mb-8 italic">"Heritage Reimagined"</h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-serif italic max-w-2xl mx-auto px-4">
            Our atelier brings together master weavers and metalsmiths to revive ancestral techniques for the contemporary connoisseur.
          </p>
        </div>
      </section>

      <style>{`
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slowZoom 15s linear infinite alternate;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;
