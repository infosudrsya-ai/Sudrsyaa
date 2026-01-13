
import React, { useState } from 'react';
import { X, Plus, Download, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface InvoiceModalProps {
  products: Product[];
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ products, onClose }) => {
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [items, setItems] = useState<{ product: Product, qty: number }[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);

  const addItem = () => {
    const p = products.find(prod => prod.id === selectedProductId);
    if (p) {
      setItems([...items, { product: p, qty: selectedQty }]);
    }
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const subtotal = items.reduce((acc, curr) => acc + (curr.product.price * curr.qty), 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl p-10 flex space-x-10 max-h-[90vh] overflow-y-auto">
        
        {/* Form Side */}
        <div className="flex-grow space-y-8">
          <div className="flex justify-between items-start">
            <h2 className="text-4xl font-serif font-bold text-gray-900">Tax Invoice Generator</h2>
            <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X size={24} /></button>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Customer Details</p>
            <input 
              placeholder="Full Name"
              className="w-full bg-gray-50 border-0 rounded-2xl p-4 outline-none focus:ring-2 ring-maroon/20 font-medium"
              value={customer.name}
              onChange={e => setCustomer({ ...customer, name: e.target.value })}
            />
            <input 
              placeholder="Phone Number"
              className="w-full bg-gray-50 border-0 rounded-2xl p-4 outline-none focus:ring-2 ring-maroon/20 font-medium"
              value={customer.phone}
              onChange={e => setCustomer({ ...customer, phone: e.target.value })}
            />
            <textarea 
              placeholder="Full Address / Shipping Address"
              className="w-full bg-gray-50 border-0 rounded-2xl p-4 outline-none focus:ring-2 ring-maroon/20 font-medium"
              rows={3}
              value={customer.address}
              onChange={e => setCustomer({ ...customer, address: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Add Items</p>
            <div className="flex space-x-2">
              <select 
                className="flex-grow bg-gray-50 border-0 rounded-2xl p-4 outline-none focus:ring-2 ring-maroon/20 font-medium"
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
              >
                <option value="">Select Product...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>)}
              </select>
              <input 
                type="number"
                min="1"
                className="w-20 bg-gray-50 border-0 rounded-2xl p-4 outline-none focus:ring-2 ring-maroon/20 font-medium"
                value={selectedQty}
                onChange={e => setSelectedQty(Number(e.target.value))}
              />
              <button 
                onClick={addItem}
                className="px-6 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <button className="w-full py-5 bg-[#10b981] text-white rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center space-x-2 shadow-xl hover:bg-[#059669]">
            <Download size={20} />
            <span>Generate & Download PDF</span>
          </button>
        </div>

        {/* Preview Side */}
        <div className="w-[400px] flex-shrink-0 bg-gray-50 rounded-3xl p-8 border border-gray-100 flex flex-col relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:bg-gray-200 rounded-full hidden lg:block"><X size={20} /></button>
          
          <div className="flex justify-between items-start mb-10">
            <h3 className="font-bold text-gray-900">Preview</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase">INV-134112<br/>13/1/2026</span>
          </div>

          <div className="flex-grow space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-gray-400 italic py-10">No items added yet</p>
            ) : (
              items.map((it, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{it.product.name}</p>
                    <p className="text-[10px] text-gray-400">{it.qty} x ₹{it.product.price}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <p className="text-sm font-bold text-maroon">₹{it.product.price * it.qty}</p>
                    <button onClick={() => removeItem(idx)} className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6 space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Grand Total</span>
              <span>₹{subtotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
