
import React, { useState, useEffect } from 'react';
import { firestoreHelpers } from '../firebase';
import { Product, Category, Coupon } from '../types';
import { Plus, BarChart2, Package, Trash2, Edit, CheckCircle, ExternalLink, Receipt, LogOut, X, TrendingUp, Zap, Clock, Tag, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductModal from './ProductModal';
import InvoiceModal from './InvoiceModal';
import AdminLogin from '../pages/AdminLogin';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [globalSettings, setGlobalSettings] = useState({ buy2get1Enabled: true });
  const [loading, setLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [tab, setTab] = useState<'inventory' | 'performance' | 'settings'>('inventory');
  
  // Authorization Check - Instant check before rendering complex dashboard UI
  const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    const [allProds, allCoupons, settings] = await Promise.all([
      firestoreHelpers.getProducts(),
      firestoreHelpers.getCoupons(),
      firestoreHelpers.getSettings()
    ]);
    setProducts(allProds as Product[]);
    setCoupons(allCoupons as Coupon[]);
    setGlobalSettings(settings as any);
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  const handleToggleStatus = async (id: string, field: string, current: boolean) => {
    await firestoreHelpers.updateProduct(id, { [field]: !current });
    fetchData();
  };

  const handleAddCoupon = async () => {
    const code = prompt('Enter code (e.g. WELCOME10)');
    const type = prompt('Type (percentage/flat)', 'percentage') as 'percentage' | 'flat';
    const value = Number(prompt('Value', '10'));
    if (code && value) {
      await firestoreHelpers.addCoupon({ code, type, value, isActive: true });
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete permanently?')) {
      await firestoreHelpers.deleteProduct(id);
      fetchData();
    }
  };

  // If not authenticated, immediately show the login screen instead of a blank page or a redirect flash
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const totalViews = products.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const totalClicks = products.reduce((acc, p) => acc + (p.whatsappClicks || 0), 0);

  return (
    <div className="bg-[#f8f9fa] min-h-screen animate-fadeIn">
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-serif font-bold text-maroon">Sudrsya</span>
          <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Admin</span>
        </div>
        <button onClick={handleLogout} className="text-gray-500 hover:text-maroon flex items-center space-x-2 text-sm font-bold uppercase tracking-widest">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex justify-between items-end mb-10">
          <div className="flex space-x-8">
            <button onClick={() => setTab('inventory')} className={`text-4xl font-serif font-bold transition-all ${tab === 'inventory' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-400'}`}>Inventory</button>
            <button onClick={() => setTab('performance')} className={`text-4xl font-serif font-bold transition-all ${tab === 'performance' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-400'}`}>Performance</button>
            <button onClick={() => setTab('settings')} className={`text-4xl font-serif font-bold transition-all ${tab === 'settings' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-400'}`}>Offers</button>
          </div>
          <div className="flex space-x-4">
            <button onClick={() => setIsInvoiceModalOpen(true)} className="bg-[#10b981] text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm hover:bg-[#059669] transition-all">
              <Receipt size={16} />
              <span>New Bill</span>
            </button>
            <button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm hover:bg-black transition-all">
              <Plus size={16} />
              <span>Add Art</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-maroon/20 border-t-maroon rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Synchronizing Archives...</p>
          </div>
        ) : (
          <>
            {tab === 'inventory' && (
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                      <th className="px-8 py-6">Masterpiece</th>
                      <th className="px-8 py-6">Code</th>
                      <th className="px-8 py-6">Status Flags</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                              <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{p.name}</p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{p.category} | ₹{p.price.toLocaleString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6"><span className="text-xs font-mono text-gray-400 uppercase">{p.code}</span></td>
                        <td className="px-8 py-6">
                          <div className="flex space-x-2">
                            <StatusBtn label="Trending" active={p.trending} icon={<Zap size={10}/>} onClick={() => handleToggleStatus(p.id, 'trending', !!p.trending)} />
                            <StatusBtn label="Fast" active={p.fastSelling} icon={<TrendingUp size={10}/>} onClick={() => handleToggleStatus(p.id, 'fastSelling', !!p.fastSelling)} />
                            <StatusBtn label="Limited" active={p.limitedStock} icon={<Clock size={10}/>} onClick={() => handleToggleStatus(p.id, 'limitedStock', !!p.limitedStock)} />
                            <StatusBtn label="Sold Out" active={p.isSoldOut} icon={<X size={10}/>} variant="danger" onClick={() => handleToggleStatus(p.id, 'isSoldOut', !!p.isSoldOut)} />
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }} className="p-2.5 text-gray-400 hover:text-maroon bg-gray-50 rounded-xl transition-all"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(p.id)} className="p-2.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'performance' && (
              <div className="space-y-10">
                <div className="grid grid-cols-3 gap-8">
                   <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Store Reach</p>
                      <p className="text-5xl font-serif font-bold text-gray-900">{totalViews}</p>
                   </div>
                   <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Interests</p>
                      <p className="text-5xl font-serif font-bold text-green-600">{totalClicks}</p>
                   </div>
                   <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Avg. Conversion</p>
                      <p className="text-5xl font-serif font-bold text-maroon">{totalViews ? ((totalClicks/totalViews)*100).toFixed(1) : 0}%</p>
                   </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                   <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                          <th className="px-8 py-6">Product</th>
                          <th className="px-8 py-6">Views</th>
                          <th className="px-8 py-6">Clicks</th>
                          <th className="px-8 py-6">Conversion Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {products.sort((a,b) => (b.viewsCount || 0) - (a.viewsCount || 0)).map(p => (
                          <tr key={p.id}>
                            <td className="px-8 py-6 font-bold text-gray-900">{p.name} <span className="block text-[8px] uppercase text-gray-400 tracking-widest">{p.code}</span></td>
                            <td className="px-8 py-6 text-gray-500 font-mono">{p.viewsCount || 0}</td>
                            <td className="px-8 py-6 text-green-600 font-bold font-mono">{p.whatsappClicks || 0}</td>
                            <td className="px-8 py-6">
                              <div className="flex items-center space-x-3">
                                <span className="font-bold text-maroon">{p.viewsCount ? ((p.whatsappClicks/p.viewsCount)*100).toFixed(1) : 0}%</span>
                                <div className="flex-grow max-w-[100px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="bg-maroon h-full" style={{ width: `${p.viewsCount ? Math.min((p.whatsappClicks/p.viewsCount)*100, 100) : 0}%` }}></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </div>
            )}

            {tab === 'settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-serif font-bold text-gray-900">Campaigns</h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Buy 2 Get 1 Free</span>
                        <button 
                          onClick={() => {
                            const next = !globalSettings.buy2get1Enabled;
                            setGlobalSettings({ buy2get1Enabled: next });
                            firestoreHelpers.updateSettings({ buy2get1Enabled: next });
                          }}
                          className={`w-14 h-7 rounded-full p-1 transition-all ${globalSettings.buy2get1Enabled ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                          <div className={`bg-white w-5 h-5 rounded-full shadow-sm transition-all ${globalSettings.buy2get1Enabled ? 'ml-7' : 'ml-0'}`}></div>
                        </button>
                      </div>
                   </div>
                   <p className="text-gray-400 text-sm leading-relaxed mb-8">This campaign will automatically apply to all jewellery categories. The cheapest of any 3 items will become free.</p>
                </div>

                <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-serif font-bold text-gray-900">Coupons</h3>
                      <button onClick={handleAddCoupon} className="p-3 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 transition-all"><Plus size={20}/></button>
                   </div>
                   <div className="space-y-4">
                      {coupons.map(c => (
                        <div key={c.id} className="flex items-center justify-between bg-gray-50 p-6 rounded-2xl border border-gray-100">
                           <div className="flex items-center space-x-4">
                              <Tag size={18} className="text-gold" />
                              <div>
                                <p className="font-bold text-gray-900 text-lg uppercase tracking-widest">{c.code}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{c.value}{c.type === 'percentage' ? '%' : ' INR'} OFF</p>
                              </div>
                           </div>
                           <button 
                            onClick={() => firestoreHelpers.toggleCoupon(c.id!, !c.isActive).then(fetchData)}
                            className={`text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full transition-all ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                           >
                             {c.isActive ? 'Active' : 'Disabled'}
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isProductModalOpen && (
        <ProductModal product={editingProduct} onClose={() => setIsProductModalOpen(false)} onSuccess={() => { setIsProductModalOpen(false); fetchData(); }} />
      )}
      {isInvoiceModalOpen && (
        <InvoiceModal products={products} onClose={() => setIsInvoiceModalOpen(false)} />
      )}
    </div>
  );
};

const StatusBtn = ({ label, active, icon, onClick, variant = 'primary' }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-center space-x-1 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${active 
      ? (variant === 'danger' ? 'bg-red-600 text-white shadow-md' : 'bg-maroon text-white shadow-md') 
      : 'bg-gray-50 text-gray-300 hover:text-gray-400'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default AdminDashboard;
