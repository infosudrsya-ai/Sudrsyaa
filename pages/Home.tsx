import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { firestoreHelpers } from '../firebase';
import { Product, Category, ELIGIBLE_FOR_OFFER } from '../types';
import ProductCard from '../components/ProductCard';
import { Sparkles, Gift, ArrowRight, ChevronRight } from 'lucide-react';

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
            <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === heroIndex ? 'opacity-100' : 'opacity-0'}`}>
              <img src={img} className="w-full h-full object-cover transform scale-105 animate-slow-zoom" alt={`Slide ${idx}`} />
              <div className="absolute inset-0 bg-black/45"></div>
            </div>
          ))}
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="uppercase tracking-[0.4em] text-[10px] mb-6 font-bold text-white/80">The 2024 Atelier Collection</p>
          <h1 className="text-5xl md:text-8xl font-serif mb-8 leading-tight tracking-tight">A Legacy of Grace</h1>
          <p className="text-lg md:text-xl mb-12 font-serif italic text-white/90 max-w-xl mx-auto">"Hand-curated threads and metals that tell a thousand-year story."</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/products?category=Sarees" className="bg-white text-gray-900 px-10 py-4 font-bold text-xs uppercase tracking-widest hover:bg-maroon hover:text-white transition-all text-center">Explore Sarees</Link>
            <Link to="/products" className="bg-white text-gray-900 px-10 py-4 font-bold text-xs uppercase tracking-widest hover:bg-maroon hover:text-white transition-all text-center">The Jewellery Box</Link>
          </div>
        </div>
      </section>

      {/* Section: The Saree Room */}
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
          {sareeRoomProds.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />)}
        </div>
      </section>

      {/* Section: New Arrivals */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-maroon font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Fresh from the Atelier</span>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 font-bold mb-4">New Arrivals</h2>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full opacity-30"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {newArrivals.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />)}
          </div>
        </div>
      </section>

      {/* Section: The Lehenga Room */}
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
          {lehengaRoomProds.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />)}
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
  <div className="max-w-7xl mx-auto">
    {/* Refined Header */}
    <h2 className="text-4xl font-serif text-[#1a3a32] text-center mb-16">
      Jewellery 
      <span className="block text-[10px] uppercase tracking-[0.5em] text-gray-400 mt-3 font-sans">
        STORE
      </span>
    </h2>

    <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-12 gap-x-6 md:gap-x-12">
      {[
        { title: 'Earrings', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768326776/earings_kcusmb.webp' },
        { title: 'Neckpieces', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768326776/neckless_me69lo.png' },
        { title: 'Rings', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768326788/ring_qz11jg.png' },
        { title: 'Nose Pins', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768326775/nose2_nn1t7t.png' },
        { title: 'Anklets', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768326775/nose2_nn1t7t.png' }
      ].map((cat, idx) => (
        <Link 
          key={idx} 
          to={`/products?category=${cat.title}`} 
          className={`flex flex-col items-center group ${
            idx === 4 ? "col-span-2 lg:col-span-1" : ""
          }`}
        >
          {/* The Circle Container */}
          <div className="relative w-32 h-32 md:w-44 md:h-44 bg-[#fdf2f2] rounded-full flex items-center justify-center overflow-hidden mb-6 transition-all duration-500 group-hover:shadow-xl group-hover:scale-105">
            {/* The Image */}
            <img 
              src={cat.img} 
              alt={cat.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          </div>

          {/* Typography */}
          <span className="text-[#1a3a32] font-serif font-bold text-xs md:text-sm text-center uppercase tracking-[0.2em]">
            {cat.title}
          </span>
          
          {/* Subtle decorative line */}
          <div className="w-0 h-[1px] bg-[#1a3a32] mt-1 transition-all duration-300 group-hover:w-8"></div>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* Section: Buy 2 Get 1 FREE */}
      <section className="py-16 md:py-24 px-4 bg-[#0a1128] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center space-x-3 bg-white/10 px-6 py-2 rounded-full mb-8 border border-white/10 backdrop-blur-sm">
              <Gift size={20} className="text-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]">The Heritage Celebration Offer</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-serif font-bold mb-6 tracking-tight">Buy 2 Get 1 FREE</h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8 mt-12">
                {offerShowcaseProds.map(product => (
                <Link key={product.id} to={`/products?category=${product.category}`} className="group relative aspect-[3/4] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-gray-900">
                    <img src={product.images[0]} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000" alt={product.name} />
                    <div className="absolute inset-0 flex flex-col justify-end p-6"><h3 className="text-lg font-serif font-bold group-hover:text-gold transition-colors">{product.category}</h3></div>
                </Link>
                ))}
            </div>
        </div>
      </section>

      {/* All Category Showcase Section (Nose Pins & Earrings) */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        {['Nose Pins', 'Earrings'].map((catName) => (
          <div key={catName} className="mb-20">
            <div className="flex justify-between items-end mb-8 border-b pb-4">
              <h2 className="text-3xl font-serif font-bold">{catName}</h2>
              <Link to={`/products?category=${catName}`} className="flex items-center text-maroon font-bold text-xs uppercase tracking-tighter hover:gap-2 transition-all">
                See More <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.filter(p => p.category === catName).slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-white text-center px-4">
        <Sparkles className="text-gold mx-auto mb-8" size={32} />
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 font-bold mb-8 italic">"Heritage Reimagined"</h2>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-serif italic max-w-2xl mx-auto">Our atelier brings together master weavers and metalsmiths to revive ancestral techniques.</p>
      </section>

      <style>{`
        @keyframes slowZoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
        .animate-slow-zoom { animation: slowZoom 15s linear infinite alternate; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Home;
