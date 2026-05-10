import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Player Profile State
  const [avatar, setAvatar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [jerseyNum, setJerseyNum] = useState("17");
  const [jerseyName, setJerseyName] = useState("MANJU");
  const [basePrice, setBasePrice] = useState("2,000");

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight">Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-navy text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-widest uppercase">
            {user.role.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Organizer / Admin View */}
      {(user.role === 'ORGANIZER' || user.role === 'ADMIN') && (
        <div className="space-y-8 animate-fade-in pb-10">
          
          {/* Admin Hero Banner */}
          <div className="relative w-full rounded-[2rem] bg-gradient-to-r from-navy via-[#1a2942] to-navy overflow-hidden shadow-2xl border border-navy/20 p-8 md:p-10">
            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <div className="absolute right-0 top-0 w-64 h-64 bg-gold/10 rounded-full blur-[60px] transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <span className="inline-block bg-white/10 backdrop-blur-md text-gold text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full mb-4 border border-white/10">
                  Command Center
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">Platform Overview</h2>
                <p className="text-gray-300 text-lg">Manage tournaments, oversee live auctions, and monitor platform health.</p>
              </div>
              <div className="text-6xl animate-pulse">⚙️</div>
            </div>
          </div>

          {/* Premium Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-gray-400 tracking-widest uppercase mb-1">Active Tournaments</div>
                  <div className="text-4xl font-black text-navy">1</div>
                </div>
                <div className="text-4xl">🏆</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-gray-400 tracking-widest uppercase mb-1">Total Franchises</div>
                  <div className="text-4xl font-black text-navy">8</div>
                </div>
                <div className="text-4xl">🛡️</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-gray-400 tracking-widest uppercase mb-1">Players Registered</div>
                  <div className="text-4xl font-black text-navy">124</div>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gold to-yellow-500 p-6 rounded-3xl shadow-lg border border-yellow-400 hover:shadow-xl hover:scale-105 transition-all text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-yellow-900 tracking-widest uppercase mb-1">Total Revenue Pool</div>
                  <div className="text-4xl font-black text-navy drop-shadow-sm">₹4.2L</div>
                </div>
                <div className="text-4xl drop-shadow-md">💰</div>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h2 className="text-xl font-black text-navy mb-6 tracking-tight">System Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/tournaments/create" className="group relative bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl mb-6 shadow-inner">➕</div>
                  <h3 className="text-xl font-black text-navy mb-2">Create Tournament</h3>
                  <p className="text-gray-500 text-sm font-medium">Initialize a new league, set budget caps, and establish bidding rules.</p>
                </div>
              </Link>
              
              <Link to="#" className="group relative bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-3xl mb-6 shadow-inner">🛡️</div>
                  <h3 className="text-xl font-black text-navy mb-2">Manage Teams</h3>
                  <p className="text-gray-500 text-sm font-medium">Review franchise registrations, assign team owners, and approve logos.</p>
                </div>
              </Link>

              <Link to="/auction/live/1" className="group relative bg-navy p-8 rounded-[2rem] border border-navy shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(26,26,46,0.5)] hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-[30px] group-hover:bg-red-500/40 transition-colors"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center text-3xl mb-6 border border-white/20">🔨</div>
                  <h3 className="text-xl font-black text-white mb-2">War Room Console</h3>
                  <p className="text-gray-300 text-sm font-medium">Enter the master control room to officially start the live auction session.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Team Owner View */}
      {(user.role === 'TEAM_OWNER') && (
        <div className="space-y-8 animate-fade-in pb-10">
          
          {/* Franchise Hero Banner */}
          <div className="relative w-full rounded-[2.5rem] bg-gradient-to-br from-gray-900 via-navy to-black overflow-hidden shadow-2xl p-8 md:p-12 border border-gray-800">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(255,50,50,0.15),transparent_70%)]"></div>
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-red-500 to-red-800 p-1 shadow-[0_0_30px_rgba(239,68,68,0.4)] transform -rotate-3 hover:rotate-0 transition-transform">
                  <div className="w-full h-full bg-gray-900 rounded-[1.8rem] flex items-center justify-center text-6xl shadow-inner relative overflow-hidden">
                    <span className="relative z-10">👑</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent"></div>
                  </div>
                </div>
                <div>
                  <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full mb-3 inline-block">
                    Franchise Owner
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg mb-2">Royal Kings</h2>
                  <p className="text-gray-400 text-lg font-medium">Leading the charge in the Kolar Premium League</p>
                </div>
              </div>

              {/* Live Purse Display */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shrink-0 w-full md:w-auto flex flex-col items-center">
                <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">Available Purse</div>
                <div className="text-4xl font-black text-gold drop-shadow-[0_0_15px_rgba(245,166,35,0.3)]">₹1,57,500</div>
                <div className="w-full bg-gray-800 rounded-full h-2 mt-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-gold h-2 rounded-full w-[70%]"></div>
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 w-full text-right">70% Remaining</div>
              </div>
            </div>
          </div>

          {/* Squad Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center text-3xl border border-orange-100">🏏</div>
              <div>
                <div className="text-xs font-black text-gray-400 tracking-widest uppercase mb-1">Squad Size</div>
                <div className="text-3xl font-black text-navy">14<span className="text-lg text-gray-400 font-bold">/22</span></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center text-3xl border border-purple-100">🌟</div>
              <div>
                <div className="text-xs font-black text-gray-400 tracking-widest uppercase mb-1">Icon Players</div>
                <div className="text-3xl font-black text-navy">2</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center text-3xl border border-green-100">💸</div>
              <div>
                <div className="text-xs font-black text-gray-400 tracking-widest uppercase mb-1">Total Spent</div>
                <div className="text-3xl font-black text-navy">₹42,500</div>
              </div>
            </div>
          </div>

          {/* Strategy Center */}
          <div>
            <h2 className="text-xl font-black text-navy mb-6 tracking-tight">Franchise Action Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/strategy-room/1" className="group relative bg-navy p-8 rounded-[2rem] border border-navy shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(26,26,46,0.6)] hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold/20 rounded-full blur-[40px] group-hover:bg-gold/40 transition-colors"></div>
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-white/10 backdrop-blur-md text-white flex items-center justify-center text-4xl border border-white/20 shrink-0">🔥</div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">Strategy Room</h3>
                    <p className="text-gray-300 text-sm font-medium">Enter the live bidding war room to compete for players in real-time.</p>
                  </div>
                </div>
              </Link>
              
              <Link to="#" className="group relative bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[40px] group-hover:bg-blue-500/20 transition-colors"></div>
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-gray-50 text-navy flex items-center justify-center text-4xl border border-gray-100 shrink-0 shadow-inner">📋</div>
                  <div>
                    <h3 className="text-2xl font-black text-navy mb-2">My Squad</h3>
                    <p className="text-gray-500 text-sm font-medium">Review your purchased players, analyze team balance, and view stats.</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Player View - Premium Profile Dashboard */}
      {(user.role === 'PLAYER') && (
        <div className="space-y-8 animate-fade-in pb-10">
          {/* Hero Banner Area */}
          <div className="relative w-full rounded-[2.5rem] bg-navy overflow-hidden shadow-2xl border border-navy/20">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/20 rounded-full blur-[100px] mix-blend-screen transform translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[80px] mix-blend-screen transform -translate-x-1/3 translate-y-1/3"></div>
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar / Photo */}
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-gold via-yellow-400 to-orange-500 p-1.5 shadow-[0_0_30px_rgba(245,166,35,0.4)]">
                  <div className="w-full h-full rounded-full bg-navy border-4 border-navy flex items-center justify-center overflow-hidden relative">
                    {avatar ? (
                      <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl md:text-7xl absolute top-4">👤</span>
                    )}
                  </div>
                </div>
                <label className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full text-navy shadow-lg flex items-center justify-center hover:scale-110 transition-transform font-bold border border-gray-100 cursor-pointer">
                  📷
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>

              {/* Player Main Info */}
              <div className="flex-1 text-center md:text-left text-white">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-md">Manjunath H R</h2>
                  <div className="flex gap-2 justify-center md:justify-start">
                    <span className="bg-gold text-navy text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(245,166,35,0.5)]">
                      ⭐️ Iconic Player
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-300 text-lg font-medium mb-6">player1@cricketpro.in • <span className="text-white">Right-Handed Batsman</span></p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2">
                    <span className="text-gold">🔥</span> HYPE SCORE: 98/100
                  </span>
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2">
                    <span className="text-green-400">💰</span> BASE PRICE: ₹{basePrice}
                  </span>
                  <span className="bg-green-500/20 border border-green-500/50 text-green-400 text-sm font-black px-4 py-2 rounded-xl">
                    IN AUCTION QUEUE
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 shrink-0">
                <button onClick={() => setIsEditing(true)} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-lg flex items-center gap-2">
                  <span>✏️</span> Edit Profile
                </button>
                <div onClick={() => setIsEditing(true)} className="w-24 h-28 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest absolute top-2">Jersey</div>
                  <div className="text-4xl font-black text-gold mt-3 drop-shadow-md">{jerseyNum}</div>
                  <div className="text-[10px] font-black text-white tracking-widest mt-1 uppercase truncate w-full text-center px-1">{jerseyName}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Stats & Performance */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Stats Grid */}
              <div>
                <h3 className="text-xl font-black text-navy mb-4 flex items-center gap-2">
                  <span>📊</span> Career Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
                    <div className="text-xs font-bold text-gray-400 tracking-widest mb-1">MATCHES</div>
                    <div className="text-3xl font-black text-navy">42</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform border-b-4 border-b-brandRed">
                    <div className="text-xs font-bold text-gray-400 tracking-widest mb-1">RUNS</div>
                    <div className="text-3xl font-black text-navy">1,245</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
                    <div className="text-xs font-bold text-gray-400 tracking-widest mb-1">STRIKE RATE</div>
                    <div className="text-3xl font-black text-navy">154.8</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
                    <div className="text-xs font-bold text-gray-400 tracking-widest mb-1">WICKETS</div>
                    <div className="text-3xl font-black text-navy">12</div>
                  </div>
                </div>
              </div>

              {/* Special Achievements/Trophies */}
              <div>
                <h3 className="text-xl font-black text-navy mb-4 flex items-center gap-2">
                  <span>🏆</span> Trophy Cabinet
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200 relative overflow-hidden group">
                    <div className="absolute right-[-10px] bottom-[-10px] text-7xl opacity-20 transform group-hover:scale-110 transition-transform">🏆</div>
                    <div className="text-3xl mb-3 relative z-10">🥇</div>
                    <h4 className="font-black text-navy relative z-10">Best Batsman</h4>
                    <p className="text-xs font-bold text-gray-500 mt-1 relative z-10">Yelahanka Cup 2025</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 relative overflow-hidden group">
                    <div className="absolute right-[-10px] bottom-[-10px] text-7xl opacity-20 transform group-hover:scale-110 transition-transform">⭐</div>
                    <div className="text-3xl mb-3 relative z-10">🚀</div>
                    <h4 className="font-black text-navy relative z-10">Maximum Sixes</h4>
                    <p className="text-xs font-bold text-gray-500 mt-1 relative z-10">24 Sixes • State T20</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 relative overflow-hidden group">
                    <div className="absolute right-[-10px] bottom-[-10px] text-7xl opacity-20 transform group-hover:scale-110 transition-transform">🎖️</div>
                    <div className="text-3xl mb-3 relative z-10">👑</div>
                    <h4 className="font-black text-navy relative z-10">Man of the Series</h4>
                    <p className="text-xs font-bold text-gray-500 mt-1 relative z-10">Kolar Premiere League</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Badges & Traits */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Player Badges */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-5 border-b border-gray-100 pb-3">Player Traits & Badges</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-lg shadow-sm border border-red-200">🔥</div>
                    <div>
                      <div className="font-bold text-navy text-sm">Aggressive Opener</div>
                      <div className="text-xs text-gray-500">Powerplay specialist</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-lg shadow-sm border border-blue-200">🛡️</div>
                    <div>
                      <div className="font-bold text-navy text-sm">Reliable Fielder</div>
                      <div className="text-xs text-gray-500">18 Catches taken</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg shadow-sm border border-green-200">🎯</div>
                    <div>
                      <div className="font-bold text-navy text-sm">Match Finisher</div>
                      <div className="text-xs text-gray-500">Not out in 12 chases</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auction History */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-5 border-b border-gray-100 pb-3">Auction Status</h3>
                <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-1">Most Popular Queue</div>
                  <div className="text-sm text-gray-600 font-medium">You are marked as an <span className="font-bold text-navy">Iconic Player</span> for the upcoming Yelahanka T20 Auction.</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative animate-fade-in border border-gray-100">
            <button 
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold transition-colors"
            >
              ✕
            </button>
            <h3 className="text-2xl font-black text-navy mb-6">Edit Profile</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 tracking-widest uppercase block mb-1">Jersey Name</label>
                <input 
                  type="text" 
                  value={jerseyName} 
                  onChange={(e) => setJerseyName(e.target.value.toUpperCase())}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-bold text-navy"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 tracking-widest uppercase block mb-1">Jersey Number</label>
                <input 
                  type="text" 
                  value={jerseyNum} 
                  onChange={(e) => setJerseyNum(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-bold text-navy"
                  maxLength={3}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 tracking-widest uppercase block mb-1">Base Price (₹)</label>
                <input 
                  type="text" 
                  value={basePrice} 
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-bold text-navy"
                />
              </div>
            </div>

            <button 
              onClick={() => setIsEditing(false)}
              className="w-full mt-8 bg-navy hover:bg-navy/90 text-white font-bold py-4 rounded-xl transition-transform hover:-translate-y-1 shadow-[0_10px_20px_-10px_rgba(26,26,46,0.5)]"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="card flex items-center gap-4">
      <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-2xl border border-gray-100">
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">{title}</div>
        <div className="text-2xl font-black text-navy">{value}</div>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, icon, to, accent }) {
  return (
    <Link to={to} className={`card hover:-translate-y-1 transition-transform cursor-pointer ${accent}`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-navy mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </Link>
  );
}
