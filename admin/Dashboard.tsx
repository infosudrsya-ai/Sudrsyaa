import React, { useState, useEffect } from 'react';
import { firestoreHelpers } from '../firebase';
import { Product, Category, Coupon } from '../types';
import { 
  Plus, BarChart2, Package, Trash2, Edit, Receipt, LogOut, X, 
  TrendingUp, Zap, Clock, Tag, Settings, LayoutGrid, 
  ChevronRight, AlertCircle, Sparkles, PieChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductModal from './ProductModal';
import InvoiceModal from './InvoiceModal';
import AdminLogin from '../pages/AdminLogin';

// --- Professional Dialog Component ---
const ModalDialog = ({ isOpen, title, children, onClose, onConfirm, type = 'primary' }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
        </div>
        <div className="p-8 text-slate-600">{children}</div>
        <div className="p-6 bg-slate-50/50 flex space-x-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>
          <button onClick={onConfirm} className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all ${type === 'danger' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {type === 'danger' ? 'Confirm Delete' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

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
  
  // Dialog State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'percentage', value: '' });

  const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';

  useEffect(() => {
    if (isAuthenticated) fetchData();
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

  const confirmDelete = async () => {
    if (deleteId) {
      await firestoreHelpers.deleteProduct(deleteId);
      setDeleteId(null);
      fetchData();
    }
  };

  const handleAddCoupon = async () => {
    if (newCoupon.code && newCoupon.value) {
      await firestoreHelpers.addCoupon({ ...newCoupon, value: Number(newCoupon.value), isActive: true } as any);
      setIsCouponModalOpen(false);
      setNewCoupon({ code: '', type: 'percentage', value: '' });
      fetchData();
    }
  };

  if (!isAuthenticated) return <AdminLogin />;

  const totalViews = products.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const totalClicks = products.reduce((acc, p) => acc + (p.whatsappClicks || 0), 0);

  return (
    <div className="bg-[#fcfdfe] min-h-screen text-slate-900 font-sans">
      {/* --- Professional Header --- */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="bg-indigo-600 p-2 rounded-lg text-white"><LayoutGrid size={20}/></div>
                <span className="text-xl font-bold tracking-tight text-slate-800">Sudrsya<span className="text-indigo-600">Admin</span></span>
              </div>
              
              <nav className="hidden md:flex space-x-1">
                <TabLink active={tab === 'inventory'} onClick={() => setTab('inventory')} label="Inventory" />
                <TabLink active={tab === 'performance'} onClick={() => setTab('performance')} label="Performance" />
                <TabLink active={tab === 'settings'} onClick={() => setTab('settings')} label="Offers & Coupons" />
              </nav>
            </div>

            <button onClick={handleLogout} className="flex items-center space-x-2 text-slate-400 hover:text-rose-500 font-bold text-xs uppercase tracking-widest transition-all">
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- Mobile Nav --- */}
      <div className="md:hidden flex border-b border-slate-100 bg-white px-2 overflow-x-auto">
        <TabLink active={tab === 'inventory'} onClick={() => setTab('inventory')} label="Inventory" />
        <TabLink active={tab === 'performance'} onClick={() => setTab('performance')} label="Analytics" />
        <TabLink active={tab === 'settings'} onClick={() => setTab('settings')} label="Settings" />
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h2>
            <p className="text-slate-500 font-medium">Control your catalog, track analytics, and manage active discounts.</p>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => setIsInvoiceModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-emerald-50 text-emerald-600 border border-emerald-100 px-6 py-3.5 rounded-xl font-bold hover:bg-emerald-100 transition-all">
              <Receipt size={18} />
              <span>New Bill</span>
            </button>
            <button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
              <Plus size={18} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Records...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Inventory Tab */}
            {tab === 'inventory' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        <th className="px-8 py-5">Product Info</th>
                        <th className="px-8 py-5">Code</th>
                        <th className="px-8 py-5">Marketing Tags</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center space-x-4">
                              <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 bg-slate-100">
                                <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">{p.name}</p>
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">₹{p.price.toLocaleString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 font-mono text-xs text-slate-400 font-bold">{p.code}</td>
                          <td className="px-8 py-6">
                            <div className="flex flex-wrap gap-2">
                              <TagBtn active={p.trending} label="Trending" color="bg-rose-500" icon={<Zap size={10}/>} onClick={() => handleToggleStatus(p.id, 'trending', !!p.trending)} />
                              <TagBtn active={p.fastSelling} label="Fast" color="bg-blue-500" icon={<TrendingUp size={10}/>} onClick={() => handleToggleStatus(p.id, 'fastSelling', !!p.fastSelling)} />
                              <TagBtn active={p.isSoldOut} label="Out of Stock" color="bg-slate-900" icon={<X size={10}/>} onClick={() => handleToggleStatus(p.id, 'isSoldOut', !!p.isSoldOut)} />
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right space-x-2">
                            <button onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit size={18} /></button>
                            <button onClick={() => setDeleteId(p.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

           {/* Performance Tab */}
{tab === 'performance' && (
  <div className="space-y-10 animate-in fade-in duration-700">
    {/* High-Level Stats - Bold & Colorful Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Store Reach</p>
          <BarChart2 size={18} className="text-blue-400" />
        </div>
        <p className="text-6xl font-serif font-bold text-gray-900 leading-none">
          {totalViews.toLocaleString()}
        </p>
        <p className="text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-widest">Total Eyeballs</p>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Interests</p>
          <Zap size={18} className="text-emerald-400" />
        </div>
        <p className="text-6xl font-serif font-bold text-emerald-600 leading-none">
          {totalClicks.toLocaleString()}
        </p>
        <p className="text-[10px] font-bold text-emerald-500/60 mt-4 uppercase tracking-widest">WhatsApp Clicks</p>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Vibe Check</p>
          <TrendingUp size={18} className="text-indigo-400" />
        </div>
        <p className="text-6xl font-serif font-bold text-indigo-600 leading-none">
          {totalViews ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}%
        </p>
        <p className="text-[10px] font-bold text-indigo-400/60 mt-4 uppercase tracking-widest">Conversion Rate</p>
      </div>
    </div>

    {/* Product Breakdown - More Attractive Layout */}
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
        <div>
          <h3 className="text-xl font-serif font-bold text-gray-900">What's Popping? 🔥</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time product engagement</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50">
              <th className="px-8 py-5">Product</th>
              <th className="px-8 py-5 text-center">Add to Cart</th>
              <th className="px-8 py-5 text-center">Whatsapp</th>
              <th className="px-8 py-5 text-right">Success Bar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products
              .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
              .map((p) => {
                const pClicks = p.whatsappClicks || 0;
                const pViews = p.viewsCount || 0;
                const convRate = pViews ? ((pClicks / pViews) * 100).toFixed(1) : 0;

                return (
                  <tr key={p.id} className="group hover:bg-gray-50/80 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 group-hover:text-maroon transition-colors">{p.name}</span>
                        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tighter">{p.code}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center text-gray-500 font-mono text-sm">{pViews}</td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        💬 {pClicks}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-black text-gray-900 mb-2">{convRate}%</span>
                        <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-maroon h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${Math.min(Number(convRate) * 2.5, 100)}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

            {/* Settings Tab */}
            {tab === 'settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Global Offers</h3>
                      <p className="text-sm text-slate-500">Enable/Disable store-wide campaigns</p>
                    </div>
                    <button 
                      onClick={() => {
                        const next = !globalSettings.buy2get1Enabled;
                        setGlobalSettings({ buy2get1Enabled: next });
                        firestoreHelpers.updateSettings({ buy2get1Enabled: next });
                      }}
                      className={`w-14 h-7 rounded-full p-1 transition-all ${globalSettings.buy2get1Enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                      <div className={`bg-white w-5 h-5 rounded-full shadow-sm transition-all ${globalSettings.buy2get1Enabled ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                  <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100 flex space-x-4">
                    <div className="bg-white p-3 rounded-lg text-indigo-600 shadow-sm"><Tag size={20}/></div>
                    <div>
                      <p className="font-bold text-indigo-900 uppercase text-xs tracking-wider">Buy 2 Get 1 Free</p>
                      <p className="text-sm text-indigo-700 mt-1 italic">Automatically makes the cheapest item free when 3 items are added.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-slate-800">Active Coupons</h3>
                    <button onClick={() => setIsCouponModalOpen(true)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all"><Plus size={20}/></button>
                  </div>
                  <div className="space-y-3">
                    {coupons.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <div>
                          <p className="font-black text-slate-800 tracking-widest text-sm uppercase">{c.code}</p>
                          <p className="text-[10px] font-bold text-indigo-500 uppercase">{c.value}{c.type === 'percentage' ? '%' : ' INR'} OFF</p>
                        </div>
                        <button 
                          onClick={() => firestoreHelpers.toggleCoupon(c.id!, !c.isActive).then(fetchData)}
                          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${c.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'}`}
                        >
                          {c.isActive ? 'Active' : 'Paused'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* --- Dialogs --- */}
      <ModalDialog 
        isOpen={deleteId !== null} 
        title="Delete Confirmation" 
        type="danger"
        onClose={() => setDeleteId(null)} 
        onConfirm={confirmDelete}
      >
        Are you sure you want to permanently delete this product? This action cannot be undone.
      </ModalDialog>

      <ModalDialog 
        isOpen={isCouponModalOpen} 
        title="Create New Coupon" 
        onClose={() => setIsCouponModalOpen(false)} 
        onConfirm={handleAddCoupon}
      >
        <div className="space-y-4">
          <input 
            type="text" placeholder="CODE (e.g. SAVE20)" 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase" 
            value={newCoupon.code} 
            onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
          />
          <div className="flex space-x-2">
            <input 
              type="number" placeholder="Value" 
              className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold" 
              value={newCoupon.value}
              onChange={e => setNewCoupon({...newCoupon, value: e.target.value})}
            />
            <select 
              className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              onChange={e => setNewCoupon({...newCoupon, type: e.target.value})}
            >
              <option value="percentage">% Off</option>
              <option value="flat">Flat ₹</option>
            </select>
          </div>
        </div>
      </ModalDialog>

      {isProductModalOpen && (
        <ProductModal product={editingProduct} onClose={() => setIsProductModalOpen(false)} onSuccess={() => { setIsProductModalOpen(false); fetchData(); }} />
      )}
      {isInvoiceModalOpen && (
        <InvoiceModal products={products} onClose={() => setIsInvoiceModalOpen(false)} />
      )}
    </div>
  );
};

// --- Sub-components ---
const TabLink = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick} 
    className={`px-6 py-4 text-sm font-bold transition-all relative ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {label}
    {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 animate-in fade-in slide-in-from-bottom-1" />}
  </button>
);

const StatCard = ({ label, value, icon, sub, color = "text-slate-800" }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-indigo-200 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="text-slate-400">{icon}</div>
      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{sub}</span>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
  </div>
);

const TagBtn = ({ active, label, color, icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${active 
      ? `${color} text-white shadow-md` 
      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default AdminDashboard;
