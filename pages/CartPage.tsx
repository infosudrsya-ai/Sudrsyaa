import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';
import { Trash2, Plus, Minus, Send, ArrowLeft, Gift, ShoppingBag, Tag, X, ShieldCheck } from 'lucide-react';
import { sendToWhatsApp } from '../whatsapp';
import { firestoreHelpers } from '../firebase';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  offerDetails: any;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, onUpdateQty, onRemove, offerDetails, applyCoupon, removeCoupon }) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState({ message: '', type: '' });

  const handleApply = async () => {
    if (!couponInput) return;
    const res = await applyCoupon(couponInput);
    setCouponStatus({ message: res.message, type: res.success ? 'success' : 'error' });
    if (res.success) setCouponInput('');
  };

  const handleProceed = () => {
    sendToWhatsApp(cart, offerDetails);
    cart.forEach(item => {
      firestoreHelpers.incrementWhatsApp(item.id).catch(err => console.error('Analytics error:', err));
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="relative mb-8">
          <div className="w-32 h-32 md:w-44 md:h-44 bg-gray-50 rounded-full flex items-center justify-center shadow-inner">
            <ShoppingBag size={50} className="text-gray-200" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gold p-3 rounded-full text-white shadow-lg">
            <Plus size={20} />
          </div>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 font-bold mb-4">Your collection is empty</h2>
        <p className="text-gray-500 mb-10 max-w-xs md:max-w-md text-base md:text-lg">
          Discover our curated masterpieces and start building your legacy collection today.
        </p>
        <Link to="/products" className="bg-maroon text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-xl hover:-translate-y-1 active:scale-95">
          Explore Creations
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-gray-100 pb-8 gap-4">
          <div>
            <nav className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-3">
              <Link to="/" className="hover:text-maroon">Home</Link>
              <span>/</span>
              <span className="text-gray-400">Cart</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-serif text-gray-900 font-bold">Curated Selection</h1>
          </div>
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
            <span className="text-maroon font-bold text-sm">{cart.length}</span>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-2">Unique Pieces</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Items */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item.id} className="group relative bg-white border-b border-gray-100 pb-6 flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Image Container */}
                  <div className="relative w-full sm:w-40 h-48 sm:h-40 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>

                  {/* Details Container */}
                  <div className="flex-grow flex flex-col justify-between h-full py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-gold font-bold uppercase tracking-widest mb-1">{item.category}</p>
                        <h3 className="text-xl font-serif text-gray-900 font-bold leading-tight group-hover:text-maroon transition-colors">{item.name}</h3>
                      </div>
                      <button 
                        onClick={() => onRemove(item.id)} 
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        title="Remove piece"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-6 sm:mt-auto">
                      <div className="flex items-center bg-gray-50 rounded-full border border-gray-100 p-1">
                        <button onClick={() => onUpdateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-maroon hover:bg-white rounded-full transition-all"><Minus size={14} /></button>
                        <span className="px-4 font-bold text-gray-900 text-sm">{item.quantity}</span>
                        <button onClick={() => onUpdateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-maroon hover:bg-white rounded-full transition-all"><Plus size={14} /></button>
                      </div>
                      <p className="text-xl font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/products" className="inline-flex items-center text-gray-400 font-bold uppercase tracking-widest hover:text-maroon transition-colors mt-10 text-xs group">
              <ArrowLeft size={16} className="mr-3 transition-transform group-hover:-translate-x-2" />
              Continue Shopping
            </Link>
          </div>

          {/* Right Side: Summary Card */}
          <div className="lg:col-span-5">
            <div className="bg-gray-50/50 backdrop-blur-sm p-6 md:p-10 rounded-[2rem] border border-gray-100 sticky top-8 shadow-sm">
              <h3 className="text-2xl font-serif text-gray-900 font-bold mb-8">Summary</h3>
              
              {/* Offers */}
              {offerDetails.messages.length > 0 && (
                <div className="bg-white p-4 rounded-2xl mb-8 border border-gold/20 shadow-sm flex items-start space-x-3">
                  <div className="bg-gold/10 p-2 rounded-lg">
                    <Gift className="text-gold" size={20} />
                  </div>
                  <div className="text-xs font-bold text-gray-700 leading-relaxed uppercase tracking-tight">
                    {offerDetails.messages.map((m: string, i: number) => <p key={i} className="mb-1 last:mb-0">{m}</p>)}
                  </div>
                </div>
              )}

              {/* Coupons */}
              <div className="mb-8">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Privilege Code</label>
                {offerDetails.activeCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 px-5 py-4 rounded-xl border border-green-100">
                    <div className="flex items-center space-x-3 text-green-700">
                      <Tag size={16} />
                      <span className="font-bold text-sm tracking-wide">{offerDetails.activeCoupon.code}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-green-700 hover:bg-white p-1 rounded-full transition-colors"><X size={16} /></button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input 
                      placeholder="ENTER CODE"
                      className="flex-grow bg-white border-0 rounded-xl px-5 py-3 outline-none focus:ring-1 ring-gold/30 font-bold text-xs tracking-widest uppercase shadow-sm"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                    />
                    <button 
                      onClick={handleApply}
                      className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-gold transition-all shadow-md active:scale-95"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponStatus.message && !offerDetails.activeCoupon && (
                  <p className={`mt-3 text-[10px] font-bold uppercase tracking-widest text-center ${couponStatus.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                    {couponStatus.message}
                  </p>
                )}
              </div>

              {/* Pricing */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 font-bold text-xs uppercase tracking-[0.1em]">
                  <span>Subtotal</span>
                  <span>₹{offerDetails.subtotal.toLocaleString()}</span>
                </div>
                {offerDetails.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold text-xs uppercase tracking-[0.1em]">
                    <span>Promotional Offer</span>
                    <span>-₹{offerDetails.discount.toLocaleString()}</span>
                  </div>
                )}
                {offerDetails.couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold text-xs uppercase tracking-[0.1em]">
                    <span>Coupon Applied</span>
                    <span>-₹{offerDetails.couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Total Amount</span>
                      <span className="text-3xl font-bold text-gray-900">₹{offerDetails.total.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-green-600 text-[10px] font-bold uppercase tracking-widest bg-green-50 px-2 py-1 rounded">
                      <ShieldCheck size={12} className="mr-1" /> Secure
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleProceed}
                className="w-full py-5 bg-maroon text-white rounded-xl font-bold uppercase tracking-[0.25em] hover:bg-black transition-all flex items-center justify-center space-x-3 shadow-xl hover:-translate-y-1 active:scale-95"
              >
                <Send size={18} />
                <span>Request on WhatsApp</span>
              </button>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-[10px] text-center text-gray-400 leading-relaxed font-medium uppercase tracking-widest">
                  Personal concierge service <br />
                  <span className="text-gold">No payment required now</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
