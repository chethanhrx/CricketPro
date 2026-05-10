import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';

const ROLES = [
  { value: 'PLAYER', label: '🏏 Player', desc: 'Register for tournaments' },
  { value: 'TEAM_OWNER', label: '👑 Team Owner', desc: 'Buy teams, bid in auctions' },
  { value: 'ORGANIZER', label: '🎯 Organizer', desc: 'Create and manage tournaments' },
  { value: 'SCORER', label: '📋 Scorer', desc: 'Enter live match scores' },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'PLAYER', location: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg font-sans px-4 py-12">
      {/* Dynamic Glowing Backgrounds */}
      <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden fixed">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold/20 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-navy/10 blur-[100px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
        className="w-full max-w-[550px]"
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
              <h1 className="text-4xl font-black text-navy tracking-tight">Join CricketPro</h1>
              <p className="text-gray-500 font-medium mt-2">Create your cricket account</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-bold text-navy mb-2 block uppercase tracking-wide">Full Name</label>
                  <input 
                    required 
                    placeholder="Virat Kohli"
                    className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-gray-200 focus:border-gold focus:ring-4 focus:ring-gold/20 outline-none transition-all duration-300 font-medium text-navy placeholder:text-gray-400 shadow-inner"
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-bold text-navy mb-2 block uppercase tracking-wide">Password</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="Min 6 chars" 
                    minLength={6}
                    className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-gray-200 focus:border-gold focus:ring-4 focus:ring-gold/20 outline-none transition-all duration-300 font-medium text-navy placeholder:text-gray-400 shadow-inner"
                    value={form.password} 
                    onChange={(e) => setForm({ ...form, password: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-navy mb-2 block uppercase tracking-wide">Phone</label>
                  <input 
                    placeholder="+91 98765 43210"
                    className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-gray-200 focus:border-gold focus:ring-4 focus:ring-gold/20 outline-none transition-all duration-300 font-medium text-navy placeholder:text-gray-400 shadow-inner"
                    value={form.phone} 
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-navy mb-2 block uppercase tracking-wide">Location</label>
                <input 
                  placeholder="Bangalore, Karnataka"
                  className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-gray-200 focus:border-gold focus:ring-4 focus:ring-gold/20 outline-none transition-all duration-300 font-medium text-navy placeholder:text-gray-400 shadow-inner"
                  value={form.location} 
                  onChange={(e) => setForm({ ...form, location: e.target.value })} 
                />
              </div>

              {/* Role Selector */}
              <div>
                <label className="text-sm font-bold text-navy mb-3 block uppercase tracking-wide mt-2">I am a...</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROLES.map((role) => (
                    <motion.div 
                      key={role.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setForm({ ...form, role: role.value })}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                        form.role === role.value 
                          ? 'bg-gold/10 border-gold shadow-[0_5px_15px_-5px_rgba(245,166,35,0.3)]' 
                          : 'bg-white/50 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-bold text-navy text-sm mb-1">{role.label}</div>
                      <div className="text-xs text-gray-500 font-medium">{role.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 bg-navy text-white font-bold text-lg px-6 py-4 rounded-2xl shadow-[0_10px_30px_-10px_rgba(26,26,46,0.6)] hover:shadow-[0_20px_40px_-10px_rgba(26,26,46,0.7)] transition-all duration-300 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed" 
                type="submit" 
                disabled={loading}
              >
                <span className="relative z-10">{loading ? 'Creating account...' : 'Create Account'}</span>
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
              Already have an account?{' '}
              <Link to="/login" className="text-navy hover:text-gold font-black transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
