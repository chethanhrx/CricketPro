import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
      else setUser(null);
    };
    
    checkUser();
    window.addEventListener('storage', checkUser);
    
    const handleScroll = () => {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏏</span>
            <span className="text-xl font-black text-navy tracking-tight">CricketPro</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/tournaments" className="font-bold text-navy hover:text-gold transition-colors">Tournaments</Link>
            <Link to="/players" className="font-bold text-navy hover:text-gold transition-colors">Players</Link>
            
            <Link to="/live" className="flex items-center gap-1.5 text-navy font-bold hover:text-gold transition-colors">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              Live Auctions
            </Link>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="hidden sm:block font-bold text-navy hover:text-gold transition-colors">
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-navy font-bold px-4 py-2 rounded-xl transition-all">
                    <span>{user.avatarIcon || '👤'}</span>
                    <span className="hidden sm:block">{user.name.split(' ')[0]}</span>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="p-2 border-b border-gray-100">
                      <div className="text-xs font-bold text-gray-500 uppercase">{user.role.replace('_', ' ')}</div>
                    </div>
                    <Link to="/dashboard" className="block px-4 py-2 text-navy font-medium hover:bg-gray-50">Dashboard</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 font-bold hover:bg-red-50 rounded-b-xl">
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="font-bold text-navy hover:text-gold transition-colors hidden sm:block">Log In</Link>
                <Link to="/register" className="bg-gold text-white font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-500 shadow-sm transition-all">
                  Sign Up
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
