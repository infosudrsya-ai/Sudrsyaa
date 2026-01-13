
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowLeft } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate a brief loading state for aesthetics
    setTimeout(() => {
      // Internal mock credentials for the showcase
      if (email === 'admin@sudrsya.com' && password === 'admin123') {
        // Set authorization flag in session storage
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin.dashbord');
      } else {
        alert('Invalid credentials. Please contact the technical administrator.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-maroon/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <div className="max-w-md w-full relative z-10">
        <button 
          onClick={() => navigate('/')} 
          className="group flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-12 hover:text-maroon transition-colors"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Boutique</span>
        </button>

        <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(45,74,34,0.1)] border border-maroon/5">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="w-20 h-20 bg-maroon text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-maroon/20 ring-8 ring-maroon/5">
              <Lock size={32} strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-serif text-gray-900 font-bold mb-4">Sudrsya Concierge</h1>
            <div className="flex items-center space-x-2 text-[10px] font-bold text-gold uppercase tracking-[0.4em]">
              <ShieldCheck size={14} />
              <span>Secure Administrative Access</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Internal Identifier</label>
              <input 
                required
                type="email" 
                placeholder="email@sudrsya.com"
                className="w-full p-5 bg-gray-50 border border-transparent focus:border-maroon/20 focus:bg-white outline-none text-gray-900 rounded-2xl transition-all font-medium"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Access Key</label>
              <input 
                required
                type="password" 
                placeholder="••••••••"
                className="w-full p-5 bg-gray-50 border border-transparent focus:border-maroon/20 focus:bg-white outline-none text-gray-900 rounded-2xl transition-all font-medium"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-6 bg-maroon text-white font-bold uppercase tracking-[0.4em] text-[11px] rounded-2xl hover:bg-black transition-all shadow-xl shadow-maroon/10 flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span>Authenticate</span>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em] leading-relaxed">
            By accessing this terminal, you acknowledge that all activity is logged and bound by Sudrsya's internal security protocols.
          </p>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} SUD-ARCHIVE V2.0.4
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
