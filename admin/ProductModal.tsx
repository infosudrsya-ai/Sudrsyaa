
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { firestoreHelpers } from '../firebase';
import { X, Trash2, Zap, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [mainPrice, setMainPrice] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: Category.Earrings,
    price: 0, // This will store the final price
    discount: 0, // This stores the percentage
    material: '',
    deliveryTimeline: '5-7',
    shortDescription: '',
    longDescription: '',
    showOnHomepage: true,
    isSoldOut: false,
    fastSelling: false,
    trending: false,
    limitedStock: false,
    images: ['']
  });

  useEffect(() => {
    if (product) {
      // Calculate original price back from discount if not directly stored
      const original = product.discount > 0 ? Math.round(product.price / (1 - product.discount/100)) : product.price;
      setMainPrice(original);
      setDiscountPercent(product.discount || 0);
      
      setFormData({
        name: product.name,
        code: product.code,
        category: product.category,
        price: product.price,
        discount: product.discount || 0,
        material: product.material || '',
        deliveryTimeline: product.deliveryTimeline || '5-7',
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        showOnHomepage: product.showOnHomepage !== undefined ? product.showOnHomepage : true,
        isSoldOut: product.isSoldOut || false,
        fastSelling: product.fastSelling || false,
        trending: product.trending || false,
        limitedStock: product.limitedStock || false,
        images: product.images.length > 0 ? product.images : ['']
      });
    }
  }, [product]);

  // Effect to calculate final price
  useEffect(() => {
    const final = Math.round(mainPrice * (1 - discountPercent / 100));
    setFormData(prev => ({ ...prev, price: final, discount: discountPercent }));
  }, [mainPrice, discountPercent]);

  const handleImageChange = (index: number, val: string) => {
    const newImgs = [...formData.images];
    newImgs[index] = val;
    setFormData({ ...formData, images: newImgs });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    if (formData.images.length === 1) return;
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const dataToSave = {
      ...formData,
      images: formData.images.filter(img => img.trim() !== ''),
      buy2get1Eligible: formData.category !== Category.Sarees,
    };

    try {
      if (product) {
        await firestoreHelpers.updateProduct(product.id, dataToSave);
      } else {
        await firestoreHelpers.addProduct(dataToSave);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-12">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">
              {product ? 'Refine Creation' : 'Archive Art'}
            </h2>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Masterpiece Identification & Status</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</label>
              <input required type="text" className="w-full bg-gray-50 border-0 rounded-2xl p-5 outline-none focus:ring-2 ring-maroon/20 font-bold" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Code</label>
              <input required type="text" className="w-full bg-gray-50 border-0 rounded-2xl p-5 outline-none focus:ring-2 ring-maroon/20 font-bold uppercase" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} />
            </div>
          </div>

          {/* Pricing Logic Section */}
          <div className="grid grid-cols-3 gap-8 p-8 bg-maroon/5 rounded-[2rem] border border-maroon/10">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-maroon uppercase tracking-widest">Main Price (MRP)</label>
              <input required type="number" className="w-full bg-white border border-maroon/10 rounded-2xl p-4 outline-none focus:ring-2 ring-maroon/20 font-bold" value={mainPrice} onChange={e => setMainPrice(Number(e.target.value))} />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-maroon uppercase tracking-widest">Percentage Off (%)</label>
              <input required type="number" max="100" min="0" className="w-full bg-white border border-maroon/10 rounded-2xl p-4 outline-none focus:ring-2 ring-maroon/20 font-bold" value={discountPercent} onChange={e => setDiscountPercent(Number(e.target.value))} />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Calculated Selling Price</label>
              <div className="w-full bg-gray-100 rounded-2xl p-4 font-black text-maroon text-xl">
                ₹{formData.price.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 p-8 bg-gray-50 rounded-3xl border border-gray-100">
             <StatusToggle label="Trending" active={formData.trending} icon={<Zap size={14}/>} onClick={() => setFormData({...formData, trending: !formData.trending})} />
             <StatusToggle label="Fast Selling" active={formData.fastSelling} icon={<TrendingUp size={14}/>} onClick={() => setFormData({...formData, fastSelling: !formData.fastSelling})} />
             <StatusToggle label="Limited Stock" active={formData.limitedStock} icon={<Clock size={14}/>} onClick={() => setFormData({...formData, limitedStock: !formData.limitedStock})} />
             <StatusToggle label="Sold Out" active={formData.isSoldOut} icon={<AlertCircle size={14}/>} onClick={() => setFormData({...formData, isSoldOut: !formData.isSoldOut})} />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
              <select className="w-full bg-gray-50 border-0 rounded-2xl p-5 outline-none focus:ring-2 ring-maroon/20 font-bold" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as Category })}>
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Material</label>
              <input type="text" className="w-full bg-gray-50 border-0 rounded-2xl p-5 outline-none focus:ring-2 ring-maroon/20 font-bold" value={formData.material} onChange={e => setFormData({ ...formData, material: e.target.value })} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gallery</label>
              <button type="button" onClick={addImageField} className="text-[10px] font-bold text-maroon uppercase tracking-widest">+ Add Frame</button>
            </div>
            {formData.images.map((img, i) => (
              <div key={i} className="flex space-x-3">
                <input type="text" className="flex-grow bg-gray-50 border-0 rounded-2xl p-5 outline-none focus:ring-2 ring-maroon/20 font-medium text-sm" value={img} onChange={e => handleImageChange(i, e.target.value)} />
                <button type="button" onClick={() => removeImageField(i)} className="p-5 text-red-400 hover:bg-red-50 rounded-2xl"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Story</label>
            <textarea rows={4} className="w-full bg-gray-50 border-0 rounded-2xl p-5 outline-none focus:ring-2 ring-maroon/20 font-medium text-sm" value={formData.longDescription} onChange={e => setFormData({ ...formData, longDescription: e.target.value })} />
          </div>

          <div className="flex space-x-6 pt-6">
            <button type="button" onClick={onClose} className="flex-grow py-6 border-2 border-gray-100 rounded-[1.5rem] font-bold uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] py-6 bg-gray-900 text-white rounded-[1.5rem] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-50">
              {loading ? 'Processing...' : (product ? 'Update Archive' : 'Seal Creation')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StatusToggle = ({ label, active, icon, onClick }: any) => (
  <button 
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center space-x-2 p-4 rounded-2xl border transition-all ${active ? 'bg-maroon text-white border-maroon shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-maroon/20'}`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export default ProductModal;
