
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { firestoreHelpers } from '../firebase';
import { Product, ELIGIBLE_FOR_OFFER, Category, CartItem } from '../types';
import { ShoppingBag, ChevronRight, ShieldCheck, Truck, RotateCcw, Star, Grid, Lock, Globe, Banknote, ChevronDown, ChevronUp, Info, Minus, Plus, Check, AlertCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { sendToWhatsApp } from '../whatsapp';

const DUMMY_REVIEWS = [
  { username: "Aditi S.", rating: 5, text: "The craftsmanship is exquisite! Truly reflects traditional values." },
  { username: "Priya R.", rating: 4, text: "Beautiful piece, looks even better in person. Delivery was prompt." },
  { username: "Anjali K.", rating: 5, text: "Perfect for my wedding anniversary. The gold plating is premium." },
  { username: "Sunita M.", rating: 5, text: "Outstanding quality. Sudrsya never disappoints with their collections." },
  { username: "Meera B.", rating: 4, text: "The detail on this necklace is amazing. Authentic feel." },
  { username: "Ritu V.", rating: 5, text: "Highly recommend! The packaging was also very royal." },
  { username: "Sneha G.", rating: 5, text: "A timeless masterpiece. Matches all my silk sarees perfectly." },
  { username: "Kavita L.", rating: 4, text: "Very elegant. Bought it as a gift and they loved it." },
  { username: "Deepa N.", rating: 5, text: "Simply stunning. The weight and finish are just right." },
  { username: "Pooja J.", rating: 5, text: "Best traditional jewellery purchase online. Will buy again!" },
];

const ProductDetails: React.FC<{ onAddToCart: (p: Product) => void }> = ({ onAddToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('shipping');
  const [isAdded, setIsAdded] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const [productData, allProducts] = await Promise.all([
            firestoreHelpers.getProduct(id),
            firestoreHelpers.getProducts()
          ]);
          
          if (productData) {
            const p = productData as Product;
            setProduct(p);
            setRelatedProducts(
              (allProducts as Product[])
                .filter(item => item.category === p.category && item.id !== p.id)
                .slice(0, 4)
            );
          }
        } catch (err) {
          console.error("Error loading product details:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  const shuffledReviews = useMemo(() => {
    return [...DUMMY_REVIEWS].sort(() => Math.random() - 0.5);
  }, [id]);

  const displayedReviews = showAllReviews ? shuffledReviews : shuffledReviews.slice(0, 4);

  const handleAddToCart = () => {
    if (!product || product.isSoldOut) return;
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleDirectWhatsApp = () => {
    if (!product || product.isSoldOut) return;
    
    const cartItem: CartItem = { ...product, quantity };
    const minimalOfferDetails = {
      total: product.price * quantity,
      freeItems: []
    };
    
    sendToWhatsApp([cartItem], minimalOfferDetails);
    firestoreHelpers.incrementWhatsApp(product.id).catch(err => console.error('Analytics error:', err));
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-2 border-maroon/20 border-t-maroon rounded-full animate-spin mb-4"></div>
      <p className="text-maroon/60 text-xs font-bold uppercase tracking-widest animate-pulse">Summoning Masterpiece...</p>
    </div>
  );
  
  if (!product) return <div className="h-screen flex items-center justify-center text-maroon text-2xl">Product not found.</div>;

  const isEligibleForOffer = product.category !== Category.Sarees;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <nav className="flex items-center text-[11px] text-gray-400 mb-10 uppercase tracking-[0.2em]">
          <Link to="/" className="hover:text-maroon transition-colors">Home</Link>
          <ChevronRight size={12} className="mx-3" />
          <Link to="/products" className="hover:text-maroon transition-colors">Collection</Link>
          <ChevronRight size={12} className="mx-3" />
          <span className="text-gray-900 font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 mb-20 items-start">
          <div className="lg:sticky lg:top-32 space-y-6">
            <div className={`relative aspect-square overflow-hidden bg-gray-50 border border-gray-100 rounded-[2.5rem] shadow-sm ${product.isSoldOut ? 'grayscale' : ''}`}>
              <img src={product.images[activeImage]} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" alt={product.name} />
              {product.isSoldOut && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-red-600 text-white font-black uppercase tracking-[0.5em] px-8 py-3 rounded-full text-sm shadow-2xl shadow-red-600/20">OUT OF STOCK</span>
                </div>
              )}
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`w-28 h-28 flex-shrink-0 border-2 rounded-[1.5rem] overflow-hidden transition-all duration-300 ${activeImage === i ? 'border-maroon scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-10">
              <div className="flex items-center space-x-3 text-xs text-gold font-black uppercase tracking-[0.3em] mb-4">
                <span className="bg-gold/10 px-3 py-1 rounded-full">{product.category}</span>
                <span className="text-gray-200">•</span>
                <div className="flex items-center text-gray-900">
                  <Star size={14} className="fill-gold text-gold mr-1" />
                  <span className="font-bold">{product.rating || '5.0'}</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif text-gray-900 font-bold mb-6 leading-[1.1]">{product.name}</h1>
              
              <div className="flex flex-col mb-8">
                <div className="flex items-center space-x-6 mb-2">
                  <span className="text-5xl font-black text-gray-900 tracking-tighter">₹{product.price.toLocaleString()}</span>
                  <span className="text-gray-300 line-through text-2xl font-light">₹{(product.price * 1.25).toLocaleString()}</span>
                  {product.isSoldOut && (
                    <span className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-red-100 ml-4">
                      <AlertCircle size={14} />
                      <span>Sold Out</span>
                    </span>
                  )}
                </div>
                {isEligibleForOffer && !product.isSoldOut && (
                  <div className="flex items-center space-x-2 text-maroon font-black text-sm uppercase tracking-widest mt-2 animate-pulse">
                    <Check size={16} />
                    <span>Buy 2 and Get 1 FREE</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-10 pb-10 border-b border-gray-100">
              <p className="text-2xl font-serif text-gray-800 italic leading-relaxed font-medium">
                "{product.shortDescription}"
              </p>
            </div>

            {/* Quantity Selector - Disabled if sold out */}
            <div className={`mb-10 transition-opacity ${product.isSoldOut ? 'opacity-30 pointer-events-none' : ''}`}>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-5">Select Quantity</p>
              <div className="flex items-center w-48 bg-gray-50 border border-gray-100 rounded-[1.5rem] p-2 shadow-inner">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q-1))} 
                  className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-maroon hover:bg-white rounded-[1rem] transition-all"
                >
                  <Minus size={20} />
                </button>
                <input readOnly value={quantity} className="w-16 bg-transparent text-center font-black text-2xl text-gray-900" />
                <button 
                  onClick={() => setQuantity(q => q+1)} 
                  className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-maroon hover:bg-white rounded-[1rem] transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Action Buttons - Distinct styling for sold out */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
              <button 
                onClick={handleAddToCart}
                disabled={product.isSoldOut || isAdded}
                className={`py-7 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] transition-all border-2 relative overflow-hidden ${
                  isAdded ? 'bg-green-600 border-green-600 text-white scale-95' : 
                  product.isSoldOut ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 
                  'bg-white border-maroon text-maroon hover:bg-maroon hover:text-white shadow-xl hover:-translate-y-1'
                }`}
              >
                {isAdded ? (
                  <span className="flex items-center justify-center space-x-2 animate-scaleIn">
                    <Check size={18} />
                    <span>Added!</span>
                  </span>
                ) : (
                  <span>{product.isSoldOut ? 'Not Available' : 'Add to Collection'}</span>
                )}
              </button>
              <button 
                onClick={handleDirectWhatsApp}
                disabled={product.isSoldOut}
                className={`py-7 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] transition-all ${
                  product.isSoldOut ? 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed' : 
                  'bg-gray-900 text-white hover:bg-black shadow-2xl hover:-translate-y-1'
                }`}
              >
                {product.isSoldOut ? 'Sold Out' : 'Order on WhatsApp'}
              </button>
            </div>

            <div className="space-y-6 mb-12">
              <p className="text-gray-500 leading-relaxed font-medium text-xl font-serif">
                {product.longDescription}
              </p>
              <div className="grid grid-cols-3 gap-8 py-10 border-y border-gray-100 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gold/5 text-gold rounded-full flex items-center justify-center mb-3">
                    <ShieldCheck size={32} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pure Craft</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gold/5 text-gold rounded-full flex items-center justify-center mb-3">
                    <Globe size={32} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Global Reach</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gold/5 text-gold rounded-full flex items-center justify-center mb-3">
                    <Banknote size={32} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ... Rest of component remains the same ... */}
        <section className="mt-12 space-y-4">
          <div className="bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100">
            <button 
              onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
              className="w-full flex justify-between items-center p-10 md:p-14 text-2xl md:text-3xl font-serif font-bold text-gray-900 transition-colors hover:bg-gray-100/50"
            >
              <div className="flex items-center space-x-6">
                <Truck size={36} className="text-maroon" />
                <span>Shipping & Delivery Policy</span>
              </div>
              {openAccordion === 'shipping' ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
            </button>
            {openAccordion === 'shipping' && (
              <div className="px-10 md:px-14 pb-16 animate-fadeIn grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100">
                  <h4 className="text-[10px] font-black text-maroon uppercase tracking-[0.3em] mb-6">Dispatch Timeline</h4>
                  <p className="text-base text-gray-500 leading-relaxed font-medium">Each creation is meticulously inspected before dispatch. Shipping from our atelier typically takes 2-3 business days. Personalized pieces may require additional time.</p>
                </div>
                <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100">
                  <h4 className="text-[10px] font-black text-maroon uppercase tracking-[0.3em] mb-6">Insured Tracking</h4>
                  <p className="text-base text-gray-500 leading-relaxed font-medium">Your heritage piece is precious. We provide fully insured door-to-door tracking. Real-time updates are sent via SMS and Email once the order is in transit.</p>
                </div>
                <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100">
                  <h4 className="text-[10px] font-black text-maroon uppercase tracking-[0.3em] mb-6">Direct Concierge</h4>
                  <p className="text-base text-gray-500 leading-relaxed font-medium">For special delivery requests or international coordination, our personal concierge team is available to ensure your treasure arrives precisely as expected.</p>
                </div>
              </div>
            )}
          </div>
          <div className="bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100">
            <button 
              onClick={() => setOpenAccordion(openAccordion === 'faq' ? null : 'faq')}
              className="w-full flex justify-between items-center p-10 md:p-14 text-2xl md:text-3xl font-serif font-bold text-gray-900 transition-colors hover:bg-gray-100/50"
            >
              <div className="flex items-center space-x-6">
                <Info size={36} className="text-maroon" />
                <span>Frequently Asked Questions</span>
              </div>
              {openAccordion === 'faq' ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
            </button>
            {openAccordion === 'faq' && (
              <div className="px-10 md:px-14 pb-16 animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <p className="text-xl font-bold text-gray-900 mb-4">What materials define Sudrsya pieces?</p>
                  <p className="text-base text-gray-500 leading-relaxed font-medium">We utilize high-grade base metals finished with a multi-layered 24k gold dipping process for lasting brilliance. Our stones are hand-selected for clarity and color profile.</p>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <p className="text-xl font-bold text-gray-900 mb-4">How do I maintain the heritage luster?</p>
                  <p className="text-base text-gray-500 leading-relaxed font-medium">Keep away from direct heat, water, and perfumes. Store in the provided airtight Sudrsya box after use to prevent environmental oxidation and maintain the gold's depth.</p>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <p className="text-xl font-bold text-gray-900 mb-4">Do you provide custom design services?</p>
                  <p className="text-base text-gray-500 leading-relaxed font-medium">Yes, bespoke customizations are our specialty. Please reach out via the WhatsApp button for a personal consultation with our master designers regarding any modifications.</p>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <p className="text-xl font-bold text-gray-900 mb-4">What is your exchange policy?</p>
                  <p className="text-base text-gray-500 leading-relaxed font-medium">We offer a 7-day exchange window for unused items in original packaging. In the rare event of damage during transit, we provide an immediate replacement.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

export default ProductDetails;
