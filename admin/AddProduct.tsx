
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestoreHelpers } from '../firebase';
import { Category } from '../types';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [mainPrice, setMainPrice] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: Category.Earrings,
    price: 0, // Final price
    discount: 0, // Percentage
    shortDescription: '',
    longDescription: '',
    deliveryDate: '7-10 Days',
    buy2get1Eligible: true,
  });
  const [images, setImages] = useState<string[]>([]);

  // Calculate final price automatically
  useEffect(() => {
    const final = Math.round(mainPrice * (1 - discountPercent / 100));
    setFormData(prev => ({ ...prev, price: final, discount: discountPercent }));
  }, [mainPrice, discountPercent]);

  const handleImageAdd = () => {
    const url = prompt('Enter image URL');
    if (url) setImages(prev => [...prev, url]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await firestoreHelpers.addProduct({
        ...formData,
        images,
        buy2get1Eligible: formData.category !== Category.Sarees,
      });
      alert('Product added successfully!');
      navigate('/admin.dashbord');
    } catch (error) {
      console.error(error);
      alert('Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center text-maroon font-bold uppercase tracking-widest mb-8 hover:text-gold">
        <ArrowLeft size={18} className="mr-2" />
        Back to Dashboard
      </button>

      <h1 className="text-4xl font-serif text-maroon font-bold mb-10">Add New Masterpiece</h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 border border-maroon/10 shadow-lg rounded-[2rem]">
        {/* Gallery Upload Mock */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-maroon uppercase tracking-widest">Product Images</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square border border-maroon/10 rounded-2xl overflow-hidden">
                <img src={img} className="w-full h-full object-cover" alt="" />
                <button 
                  type="button" 
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button 
              type="button"
              onClick={handleImageAdd}
              className="aspect-square border-2 border-dashed border-maroon/20 rounded-2xl flex flex-col items-center justify-center text-maroon/40 hover:border-gold hover:text-gold transition-all"
            >
              <Upload size={24} />
              <span className="text-[10px] uppercase tracking-widest font-bold mt-2">Upload</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-maroon uppercase tracking-widest">Product Name</label>
            <input 
              required
              type="text" 
              className="w-full p-4 bg-maroon/5 border border-maroon/10 focus:border-gold outline-none rounded-xl"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-maroon uppercase tracking-widest">Product Code</label>
            <input 
              required
              type="text" 
              placeholder="e.g. SUD-JWL-001"
              className="w-full p-4 bg-maroon/5 border border-maroon/10 focus:border-gold outline-none rounded-xl"
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
            />
          </div>
        </div>

        {/* Dynamic Pricing Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-maroon/5 rounded-2xl border border-maroon/10">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-maroon uppercase tracking-widest">Main Price (MRP)</label>
            <input 
              required
              type="number" 
              className="w-full p-4 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl"
              value={mainPrice}
              onChange={e => setMainPrice(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-maroon uppercase tracking-widest">Discount (%)</label>
            <input 
              required
              type="number" 
              max="100"
              className="w-full p-4 bg-white border border-maroon/10 focus:border-gold outline-none rounded-xl"
              value={discountPercent}
              onChange={e => setDiscountPercent(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Final Price</label>
            <div className="w-full p-4 bg-gray-100 rounded-xl font-black text-maroon text-2xl">
              ₹{formData.price.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-maroon uppercase tracking-widest">Category</label>
            <select 
              className="w-full p-4 bg-maroon/5 border border-maroon/10 focus:border-gold outline-none rounded-xl"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
            >
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-maroon uppercase tracking-widest">Delivery Timeline</label>
            <input 
              type="text" 
              className="w-full p-4 bg-maroon/5 border border-maroon/10 focus:border-gold outline-none rounded-xl"
              value={formData.deliveryDate}
              onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-maroon uppercase tracking-widest">Short Description</label>
          <input 
            required
            type="text" 
            className="w-full p-4 bg-maroon/5 border border-maroon/10 focus:border-gold outline-none rounded-xl"
            value={formData.shortDescription}
            onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-maroon uppercase tracking-widest">Long Description (Story)</label>
          <textarea 
            rows={4}
            className="w-full p-4 bg-maroon/5 border border-maroon/10 focus:border-gold outline-none rounded-xl"
            value={formData.longDescription}
            onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
          />
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="w-full py-5 bg-maroon text-white font-bold uppercase tracking-widest hover:bg-gold transition-all flex items-center justify-center shadow-xl disabled:opacity-50 rounded-2xl"
        >
          <Save size={18} className="mr-2" />
          {loading ? 'Submitting...' : 'Seal the Archive'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
