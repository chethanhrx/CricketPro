import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg font-sans px-4">
      {/* Dynamic Glowing Backgrounds */}
      <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold/20 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-navy/10 blur-[100px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
        className="w-full max-w-[440px]"
      >
        <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(26,26,46,0.2)] border border-white p-10 relative overflow-hidden">
          
          {/* Glossy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/20 to-transparent pointer-events-none z-0 rounded-[2.5rem]"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <motion.div 
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl mb-4"
              >
                🏏
              </motion.div>
              <h1 className="text-4xl font-black text-navy tracking-tight">CricketPro</h1>
              <p className="text-gray-500 font-medium mt-2">Sign in to your account</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red/10 border border-red/30 text-red px-4 py-3 rounded-2xl mb-6 text-sm font-bold shadow-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-sm font-bold text-navy mb-2 block uppercase tracking-wide">Email</label>
                <input 
                  type="email" 
                  required 
                  placeholder="you@example.com"
                  className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-gray-200 focus:border-gold focus:ring-4 focus:ring-gold/20 outline-none transition-all duration-300 font-medium text-navy placeholder:text-gray-400 shadow-inner"
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-navy mb-2 block uppercase tracking-wide">Password</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-gray-200 focus:border-gold focus:ring-4 focus:ring-gold/20 outline-none transition-all duration-300 font-medium text-navy placeholder:text-gray-400 shadow-inner"
                  value={form.password} 
                  onChange={(e) => setForm({ ...form, password: e.target.value })} 
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 bg-navy text-white font-bold text-lg px-6 py-4 rounded-2xl shadow-[0_10px_30px_-10px_rgba(26,26,46,0.6)] hover:shadow-[0_20px_40px_-10px_rgba(26,26,46,0.7)] transition-all duration-300 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed" 
                type="submit" 
                disabled={loading}
              >
                <span className="relative z-10">{loading ? 'Signing in...' : 'Sign In'}</span>
                {!loading && (
                  <motion.div 
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"
                  />
                )}
              </motion.button>
            </form>

            <p className="text-center mt-8 text-gray-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold hover:text-yellow-500 font-bold transition-colors">
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
