
import React, { useState } from 'react';
// Corrected: Using named imports for react-router-dom to fix property resolution errors
import { Link } from 'react-router-dom';
import { CartItem, Product } from '../types';
import { Trash2, Plus, Minus, Send, ArrowLeft, Gift, ShoppingBag, Tag, X } from 'lucide-react';
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
  };

  const handleProceed = () => {
    sendToWhatsApp(cart, offerDetails);
    
    // Fire-and-forget analytics calls
    cart.forEach(item => {
      firestoreHelpers.incrementWhatsApp(item.id).catch(err => console.error('Analytics error:', err));
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 md:p-8 text-center bg-gray-50">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-xl">
          <ShoppingBag size={48} className="text-maroon/20 md:w-14 md:h-14" />
        </div>
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 font-bold mb-4">Your treasure box is empty</h2>
        <p className="text-gray-400 mb-8 md:mb-10 max-w-sm text-base md:text-lg italic font-serif">A beautiful discovery is just a click away.</p>
        <Link to="/products" className="bg-maroon text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-2xl text-sm md:text-base">
          Explore Creations
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 space-y-4">
          <div>
            <span className="text-gold font-bold uppercase tracking-widest text-[10px] mb-2 block">Checkout</span>
            <h1 className="text-4xl md:text-6xl font-serif text-gray-900 font-bold">Your Selection</h1>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{cart.length} Masterpiece{cart.length > 1 ? 's' : ''}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          <div className="lg:col-span-7 space-y-8">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 hover:shadow-md transition-all group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform mx-auto sm:mx-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div className="text-center sm:text-left mb-4 sm:mb-0">
                      <h3 className="text-lg sm:text-xl font-serif text-gray-900 font-bold mb-1 leading-tight">{item.name}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</p>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="p-2 sm:p-3 text-gray-300 hover:text-red-600 bg-gray-50 rounded-full transition-colors self-center sm:self-start">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 sm:mt-6 space-y-4 sm:space-y-0">
                    <div className="flex items-center bg-gray-50 rounded-full p-1.5 border border-gray-100 mx-auto sm:mx-0">
                      <button onClick={() => onUpdateQty(item.id, -1)} className="p-2 text-gray-400 hover:text-maroon transition-colors"><Minus size={14} /></button>
                      <span className="mx-4 sm:mx-6 font-bold text-gray-900 w-6 text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} className="p-2 text-gray-400 hover:text-maroon transition-colors"><Plus size={14} /></button>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-right">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
            
            <Link to="/products" className="inline-flex items-center text-maroon font-bold uppercase tracking-widest hover:text-gold transition-colors pt-6 text-xs">
              <ArrowLeft size={16} className="mr-3" />
              Keep Exploring
            </Link>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl border border-gray-100 sticky top-24">
              <h3 className="text-2xl md:text-3xl font-serif text-gray-900 font-bold mb-8 md:mb-10">Grand Summary</h3>
              
              {/* Offer Notifications */}
              {offerDetails.messages.length > 0 && (
                <div className="bg-gold/5 p-6 rounded-2xl mb-8 flex items-start space-x-4 border border-gold/10">
                  <Gift className="text-maroon flex-shrink-0" size={24} />
                  <div className="text-sm font-bold text-maroon leading-relaxed">
                    {offerDetails.messages.map((m: string, i: number) => <p key={i}>{m}</p>)}
                  </div>
                </div>
              )}

              {/* Coupon Section */}
              <div className="mb-8 md:mb-10 pb-8 md:pb-10 border-b border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Have a coupon?</p>
                {offerDetails.activeCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 px-4 md:px-6 py-3 md:py-4 rounded-2xl border border-green-100">
                    <div className="flex items-center space-x-3 text-green-700">
                      <Tag size={16} />
                      <span className="font-bold text-sm md:text-base">{offerDetails.activeCoupon.code} Applied</span>
                    </div>
                    <button onClick={removeCoupon} className="text-green-700 hover:text-red-500"><X size={18} /></button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input 
                      placeholder="Enter code"
                      className="flex-grow bg-gray-50 border-0 rounded-2xl p-4 outline-none focus:ring-2 ring-maroon/10 font-bold text-sm uppercase"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                    />
                    <button 
                      onClick={handleApply}
                      className="px-6 md:px-8 py-3 md:py-4 bg-gray-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-all"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponStatus.message && !offerDetails.activeCoupon && (
                  <p className={`mt-2 text-[10px] font-bold uppercase px-4 ${couponStatus.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{couponStatus.message}</p>
                )}
              </div>

              <div className="space-y-4 md:space-y-5 mb-10 md:mb-12">
                <div className="flex justify-between text-gray-400 font-bold text-sm uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>₹{offerDetails.subtotal.toLocaleString()}</span>
                </div>
                {offerDetails.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold text-sm uppercase tracking-widest">
                    <span>B2G1 Discount</span>
                    <span>-₹{offerDetails.discount.toLocaleString()}</span>
                  </div>
                )}
                {offerDetails.couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold text-sm uppercase tracking-widest">
                    <span>Coupon Savings</span>
                    <span>-₹{offerDetails.couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-900 font-bold text-2xl md:text-3xl pt-6 md:pt-8 border-t border-gray-100">
                  <span>Total</span>
                  <span>₹{offerDetails.total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleProceed}
                className="w-full py-5 md:py-6 bg-maroon text-white rounded-[1.5rem] font-bold uppercase tracking-[0.2em] hover:bg-gold transition-all flex items-center justify-center space-x-3 shadow-2xl text-sm md:text-base"
              >
                <Send size={20} />
                <span>Confirm on WhatsApp</span>
              </button>
              <p className="text-[9px] md:text-[10px] text-center text-gray-300 mt-4 md:mt-6 leading-relaxed font-bold uppercase tracking-widest px-4">
                No immediate payment. Our consultants will verify the pieces and process your heritage order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
