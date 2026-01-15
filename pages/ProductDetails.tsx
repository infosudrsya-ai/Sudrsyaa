import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { firestoreHelpers } from '../firebase';
import { Product, Category, CartItem } from '../types';
import { 
  ShoppingBag, ChevronRight, ShieldCheck, Truck, Star, 
  Globe, Banknote, ChevronDown, ChevronUp, Info, 
  Minus, Plus, Check, AlertCircle, Sparkles, Ruler, Package, Heart,
  RotateCcw, Award, ShieldAlert
} from 'lucide-react';
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

const FAQ_DATA = [
  { q: "What materials define Sudrsya pieces?", a: "We utilize high-grade base metals finished with a multi-layered 24k gold dipping process for lasting brilliance." },
  { q: "How do I maintain the heritage luster?", a: "Keep away from direct heat, water, and perfumes. Store in the provided airtight Sudrsya box." },
  { q: "Do you provide custom design services?", a: "Yes, bespoke customizations are our specialty via WhatsApp consultation." },
  { q: "What is your exchange policy?", a: "We offer a 7-day exchange window for unused items in original packaging." },
  { q: "Is international shipping available?", a: "Yes, we ship worldwide with premium courier partners like DHL and FedEx." },
  { q: "Are the stones used authentic?", a: "We use high-quality semi-precious stones and CZ crystals hand-picked for clarity." }
];

const CATEGORY_IMAGES = [
  { title: 'Sarees', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768327314/saree_qnzlcs.png' },
  { title: 'Lehenga', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768327474/lehenga_dll8lm.png' },
  { title: 'Earrings', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768326776/earings_kcusmb.webp' },
  { title: 'Neckpieces', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768326776/neckless_me69lo.png' },
  { title: 'Rings', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768326788/ring_qz11jg.png' },
  { title: 'Nose Pins', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768326775/nose2_nn1t7t.png' },
  { title: 'Anklets', img: 'https://res.cloudinary.com/dgabaplay/image/upload/v1768326776/earings_kcusmb.webp' },
];

const ProductDetails: React.FC<{ onAddToCart: (p: Product) => void }> = ({ onAddToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [nestedShipping, setNestedShipping] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  const shuffledReviews = useMemo(() => {
    return [...DUMMY_REVIEWS].sort(() => Math.random() - 0.5);
  }, [id]);

  const displayedReviews = showAllReviews ? shuffledReviews : shuffledReviews.slice(0, 4);
  const displayedFaqs = showAllFaqs ? FAQ_DATA : FAQ_DATA.slice(0, 4);

  const handleAddToCart = () => {
    if (!product || product.isSoldOut) return;
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleDirectWhatsApp = () => {
    if (!product || product.isSoldOut) return;
    const cartItem: CartItem = { ...product, quantity };
    sendToWhatsApp([cartItem], { total: product.price * quantity, freeItems: [] });
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-2 border-maroon/20 border-t-maroon rounded-full animate-spin mb-4"></div>
      <p className="text-maroon/60 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Choose Good for Looks Good</p>
    </div>
  );
  
  if (!product) return <div className="h-screen flex items-center justify-center text-maroon text-2xl font-serif">Treasure not found.</div>;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-[10px] text-gray-400 mb-10 uppercase tracking-[0.2em]">
          <Link to="/" className="hover:text-maroon transition-colors font-bold">Home</Link>
          <ChevronRight size={10} className="mx-3" />
          <Link to="/products" className="hover:text-maroon transition-colors font-bold">Collections</Link>
          <ChevronRight size={10} className="mx-3" />
          <span className="text-gray-900 font-black">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24 items-start">
          {/* Main Gallery */}
          <div className="lg:sticky lg:top-32 space-y-6">
            <div className={`relative aspect-[4/5] overflow-hidden bg-gray-50 border border-gray-100 rounded-[2.5rem] shadow-sm ${product.isSoldOut ? 'grayscale' : ''}`}>
              <img src={product.images[activeImage]} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" alt={product.name} />
              {product.isSoldOut && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-red-600 text-white font-black uppercase tracking-[0.4em] px-10 py-4 rounded-full text-xs shadow-2xl">Sold Out</span>
                </div>
              )}
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`w-24 h-24 flex-shrink-0 border-2 rounded-[1.5rem] overflow-hidden transition-all duration-300 ${activeImage === i ? 'border-maroon scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Description Side */}
          <div className="flex flex-col">
            <div className="mb-4">
              <div className="flex items-center space-x-3 text-[10px] text-gold font-black uppercase tracking-[0.3em] mb-4">
                <span className="bg-gold/10 px-3 py-1 rounded-full">{product.category}</span>
                <span className="text-gray-200">•</span>
                <div className="flex items-center text-gray-900">
                  <Star size={12} className="fill-gold text-gold mr-1" />
                  <span className="font-bold">{product.rating || '5.0'}</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif text-gray-900 font-bold mb-6 leading-[1.1]">{product.name}</h1>
              
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8 inline-flex flex-col items-start">
  {/* Discount Badge */}
  <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-3">
    Special Offer
  </span>

  <div className="flex items-center space-x-4">
    {/* Main Price */}
    <span className="text-5xl font-black text-gray-900 tracking-tighter">
      ₹{product.price.toLocaleString()}
    </span>

    {/* Comparison Price and Percent */}
    <div className="flex flex-col">
      <span className="text-gray-400 line-through text-xl font-light">
        ₹{(product.price * 1.25).toLocaleString()}
      </span>
      <span className="text-green-600 text-sm font-bold">
        20% OFF
      </span>
    </div>
  </div>

  {/* Trust subtitle */}
  <p className="text-green-800/60 text-xs mt-3 font-medium">
    *Price inclusive of all taxes
  </p>
</div>

              <p className="text-xl font-serif text-gray-600 italic leading-relaxed mb-10 border-l-4 border-maroon/10 pl-6">
                "{product.shortDescription}"
              </p>
            </div>

            {/* Actions */}
            <div className={`space-y-8 mb-12 ${product.isSoldOut ? 'opacity-30 pointer-events-none' : ''}`}>
              <div className="flex flex-col space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Quantity</p>
                <div className="flex items-center w-40 bg-gray-50 border border-gray-100 rounded-2xl p-1.5 shadow-inner">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-maroon hover:bg-white rounded-xl transition-all"><Minus size={18} /></button>
                  <input readOnly value={quantity} className="w-14 bg-transparent text-center font-black text-xl text-gray-900" />
                  <button onClick={() => setQuantity(q => q+1)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-maroon hover:bg-white rounded-xl transition-all"><Plus size={18} /></button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all border-2 flex items-center justify-center space-x-3 ${
                    isAdded ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-maroon text-maroon hover:bg-maroon hover:text-white shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {isAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
                  <span>{isAdded ? 'Added to Bag' : 'Add to Collection'}</span>
                </button>
                <button onClick={handleDirectWhatsApp} className="py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] bg-gray-900 text-white hover:bg-black shadow-2xl hover:-translate-y-1 flex items-center justify-center space-x-3">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-5 h-5 brightness-0 invert" alt="" />
                  <span>WhatsApp Order</span>
                </button>
              </div>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-4">
              {/* DESCRIPTION SECTION (New) */}
              <div className="border border-gray-100 rounded-[2rem] overflow-hidden">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === 'description' ? null : 'description')}
                  className="w-full flex justify-between items-center p-8 bg-gray-50 hover:bg-gray-100/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Sparkles size={24} className="text-maroon" />
                    <span className="text-xl font-serif font-bold text-gray-900">Product Description</span>
                  </div>
                  {openAccordion === 'description' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openAccordion === 'description' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-8 bg-white">
                    <div className="prose prose-sm text-gray-600 mb-10 leading-relaxed font-medium">
                      {product.description || "Indulge in the timeless elegance of Sudrsya. This piece is a testament to India's rich heritage, meticulously crafted by master artisans. Every curve and stone is placed with intention, ensuring you don't just wear jewelry, but a story of tradition."}
                    </div>

                    {/* TRUST BADGES SECTION (Based on Image) */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-6 border-t border-gray-100">
                       <div className="flex flex-col items-center text-center group">
                          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                             <Heart className="text-green-800" size={20} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-tighter text-gray-800 leading-tight">Artisan<br/>Made</span>
                       </div>
                       <div className="flex flex-col items-center text-center group">
                          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                             <Truck className="text-green-800" size={20} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-tighter text-gray-800 leading-tight">Express<br/>Shipping</span>
                       </div>
                       <div className="flex flex-col items-center text-center group">
                          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                             <ShieldCheck className="text-green-800" size={20} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-tighter text-gray-800 leading-tight">Secure<br/>Payments</span>
                       </div>
                       <div className="flex flex-col items-center text-center group">
                          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                             <Globe className="text-green-800" size={20} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-tighter text-gray-800 leading-tight">Customer<br/>Support</span>
                       </div>
                       <div className="flex flex-col items-center text-center group">
                          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                             <Award className="text-green-800" size={20} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-tighter text-gray-800 leading-tight">Genuine<br/>Products</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SHIPPING & RETURNS SECTION (Updated) */}
              <div className="border border-gray-100 rounded-[2rem] overflow-hidden">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                  className="w-full flex justify-between items-center p-8 bg-gray-50 hover:bg-gray-100/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Truck size={24} className="text-maroon" />
                    <span className="text-xl font-serif font-bold text-gray-900">Shipping & Returns</span>
                  </div>
                  {openAccordion === 'shipping' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openAccordion === 'shipping' ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-8 space-y-4 bg-white">
                    {[
                      { title: 'Domestic Shipping', icon: <Package size={14} />, content: 'Free delivery within India. Orders are processed within 24-48 hours and typically reach in 3-5 business days.' },
                      { title: 'International Shipping', icon: <Globe size={14} />, content: 'Flat rate shipping worldwide. International orders take 7-12 business days depending on customs processing.' },
                      { title: 'Return & Exchange Policy', icon: <RotateCcw size={14} />, content: 'We offer a 7-day hassle-free exchange for unused items in original packaging. Please note that custom-made or personalized pieces are non-returnable. To initiate a return, contact our support team via WhatsApp with your order ID.' }
                    ].map((item) => (
                      <div key={item.title} className="border border-gray-50 rounded-2xl overflow-hidden">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setNestedShipping(nestedShipping === item.title ? null : item.title); }}
                          className="w-full flex justify-between items-center p-5 text-sm font-black uppercase tracking-widest text-gray-700 bg-gray-50/30 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                             {item.icon}
                             <span>{item.title}</span>
                          </div>
                          <Plus size={14} className={`transition-transform duration-300 ${nestedShipping === item.title ? 'rotate-45' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${nestedShipping === item.title ? 'max-h-40 p-5' : 'max-h-0'}`}>
                          <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="border border-gray-100 rounded-[2rem] overflow-hidden">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === 'faq' ? null : 'faq')}
                  className="w-full flex justify-between items-center p-8 bg-gray-50 hover:bg-gray-100/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Info size={24} className="text-maroon" />
                    <span className="text-xl font-serif font-bold text-gray-900">Expert Q&A</span>
                  </div>
                  {openAccordion === 'faq' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openAccordion === 'faq' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayedFaqs.map((faq, i) => (
                      <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-50 animate-fadeIn">
                        <p className="font-bold text-gray-900 text-sm mb-2">{faq.q}</p>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                    <div className="md:col-span-2 text-center pt-4">
                      <button 
                        onClick={() => setShowAllFaqs(!showAllFaqs)}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-maroon hover:underline"
                      >
                        {showAllFaqs ? 'Show Less' : 'View All Questions'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Same Category Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-24">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h3 className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-3">More Treasures</h3>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">From the {product.category} Collection</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="mb-24 bg-gray-50 rounded-[3.5rem] p-10 md:p-20 border border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Patron Stories</h2>
              <div className="flex justify-center space-x-1 mb-2">
                {[1,2,3,4,5].map(s => <Star key={s} size={18} className="fill-gold text-gold" />)}
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">4.9/5 Average Rating</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {displayedReviews.map((review, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 animate-fadeIn">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-maroon text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {review.username[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{review.username}</p>
                      <p className="text-[9px] text-green-600 font-black uppercase tracking-tighter flex items-center">
                        <Check size={10} className="mr-1" /> Verified Patron
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic leading-relaxed font-medium">"{review.text}"</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button 
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="px-12 py-5 border-2 border-maroon text-maroon rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-maroon hover:text-white transition-all shadow-lg"
              >
                {showAllReviews ? 'Show Fewer Stories' : 'Read More Stories'}
              </button>
            </div>
          </div>
        </section>

        {/* Circular Categories Bar */}
        <div className="pt-10 border-t border-gray-100">
          <div className="text-center mb-12">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2">Explore Our Craft</h4>
            <div className="w-12 h-1 bg-maroon/20 mx-auto"></div>
          </div>
          <section className="pb-12 px-4 overflow-x-auto scrollbar-hide">
            <div className="max-w-7xl mx-auto flex justify-center space-x-8 sm:space-x-12 min-w-max">
              {CATEGORY_IMAGES.map((cat) => (
                <Link key={cat.title} to={`/products?category=${cat.title}`} className="group flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-gray-100 group-hover:border-maroon transition-all duration-500 mb-4 p-1 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2">
                    <img src={cat.img} alt={cat.title} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-maroon transition-colors">
                    {cat.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .prose p { margin-bottom: 1em; }
      `}</style>
    </div>
  );
};

export default ProductDetails;
