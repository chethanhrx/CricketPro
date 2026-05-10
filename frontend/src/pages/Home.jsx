import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [15, -15]);
  const rotateY = useTransform(x, [-200, 200], [-15, 15]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div className="w-full overflow-hidden bg-bg relative font-sans">
      {/* 3D Animated Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-32 overflow-hidden" style={{ perspective: 1500 }}>
        {/* Dynamic Glowing Backgrounds */}
        <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gold/20 blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-navy/10 blur-[100px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-block px-5 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm mb-6"
              >
                <span className="text-navy font-bold text-sm tracking-widest uppercase">
                  Next-Gen Cricket Platform
                </span>
              </motion.div>
              
              <h1 className="text-6xl lg:text-7xl font-black text-navy leading-[1.1] mb-6 tracking-tight drop-shadow-sm">
                Your Local Cricket.<br/>
                <span className="text-gold">
                  IPL Experience.
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed font-medium">
                Experience real-time 3D auctions, live scoring, and immersive player profiles. Built to make every local match feel like a pro league.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link to="/tournaments" className="btn-primary text-center relative overflow-hidden group shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <span className="relative z-10 text-lg">Watch Live Auction</span>
                  <motion.div 
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </Link>
                <Link to="/register" className="btn-secondary text-center text-lg bg-white shadow-lg hover:-translate-y-1 transition-all duration-300">
                  Create Tournament
                </Link>
              </div>
            </motion.div>

            {/* Right: 3D Interactive Card */}
            <div 
              className="relative lg:ml-auto w-full max-w-[500px] h-[600px] flex items-center justify-center"
              style={{ perspective: 1200 }}
              onMouseMove={handleMouse}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div 
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                initial={{ opacity: 0, scale: 0.8, rotateY: -30, rotateX: 20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
                transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                className="w-full h-full absolute flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                {/* Main 3D Card Container */}
                <div 
                  style={{ transform: "translateZ(50px)" }}
                  className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(26,26,46,0.3)] border border-white overflow-hidden relative"
                >
                  {/* Glossy Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/20 to-transparent pointer-events-none z-10 rounded-[2.5rem]"></div>
                  
                  <div className="bg-navy/95 backdrop-blur-md p-6 text-white flex justify-between items-center relative z-20 border-b border-white/20">
                    <div className="font-bold tracking-widest text-lg">YELAHANKA T20</div>
                    <motion.div 
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="bg-red text-white text-xs font-black px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(230,57,70,0.6)]"
                    >
                      LIVE
                    </motion.div>
                  </div>
                  
                  <div className="p-8 relative z-20">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl shadow-[inset_0_-4px_10px_rgba(0,0,0,0.1)] border-4 border-white relative overflow-hidden">
                        👤
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/60"></div>
                      </div>
                      <div>
                        <div className="font-black text-2xl text-navy">Manjunath R.</div>
                        <div className="text-sm text-gold font-black tracking-widest mt-1">🏏 BATSMAN</div>
                      </div>
                    </div>
                    
                    {/* Floating Bid Box */}
                    <motion.div 
                      style={{ transform: "translateZ(40px)" }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-3xl p-6 text-center mb-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/20 transition-all duration-500"></div>
                      <div className="text-xs font-bold text-gray-400 mb-2 tracking-[0.2em]">CURRENT BID</div>
                      <motion.div 
                        key="mock-bid"
                        initial={{ scale: 1.2, color: '#E63946' }}
                        animate={{ scale: 1, color: '#F5A623' }}
                        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                        className="text-6xl font-black tracking-tighter drop-shadow-md"
                      >
                        ₹5,500
                      </motion.div>
                      <div className="text-base font-black text-navy mt-3 uppercase tracking-widest">ROYAL KINGS</div>
                    </motion.div>

                    <div className="space-y-4" style={{ transform: "translateZ(30px)" }}>
                      <motion.div 
                        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }}
                        className="flex justify-between items-center bg-yellow-50/80 p-5 rounded-2xl border border-yellow-200 shadow-sm"
                      >
                        <span className="font-bold text-navy flex items-center gap-3 text-lg">
                          <span className="text-green-500 animate-bounce">▲</span> Royal Kings
                        </span>
                        <span className="font-black text-2xl text-gold">₹5,500</span>
                      </motion.div>
                      <div className="flex justify-between items-center p-5 text-gray-500 bg-gray-50/80 rounded-2xl border border-gray-100">
                        <span className="font-bold text-lg">Thunder XI</span>
                        <span className="font-black text-xl">₹5,000</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements Around the Card */}
                <motion.div 
                  style={{ transform: "translateZ(90px)" }}
                  animate={{ y: [0, -20, 0], rotateZ: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-10 top-1/3 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] border border-white flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-red/10 text-red flex items-center justify-center text-2xl shadow-inner border border-white">🔥</div>
                  <div>
                    <div className="text-xs text-red font-bold tracking-widest mb-1">HOT BID</div>
                    <div className="font-black text-navy text-sm">+₹500 raise</div>
                  </div>
                </motion.div>

                <motion.div 
                  style={{ transform: "translateZ(70px)" }}
                  animate={{ y: [0, 20, 0], rotateZ: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -left-10 bottom-1/4 bg-navy/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(26,26,46,0.4)] border border-white/20 flex items-center gap-3"
                >
                  <motion.div 
                    animate={{ rotate: [0, -20, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl"
                  >
                    🔨
                  </motion.div>
                  <div>
                    <div className="text-xs text-blue-200 font-bold tracking-widest mb-1">GOING ONCE...</div>
                    <div className="font-black text-gold text-sm">Royal Kings</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="relative z-10 border-y border-white bg-white/60 backdrop-blur-xl py-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 text-center">
            <div>
              <div className="text-5xl font-black text-navy mb-2">127+</div>
              <div className="text-sm font-bold text-gray-500 tracking-widest uppercase">Tournaments</div>
            </div>
            <div className="hidden md:block w-px bg-gray-300"></div>
            <div>
              <div className="text-5xl font-black text-gold mb-2">3,400+</div>
              <div className="text-sm font-bold text-gray-500 tracking-widest uppercase">Players</div>
            </div>
            <div className="hidden md:block w-px bg-gray-300"></div>
            <div>
              <div className="text-5xl font-black text-navy mb-2">48</div>
              <div className="text-sm font-bold text-gray-500 tracking-widest uppercase">Cities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-32 relative bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-navy mb-6">Pro Level, <span className="text-gold">Local Match</span></h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Everything you need to organize, manage, and experience cricket like never before.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: "🔴", title: "Watch Auctions Live", desc: "Every bid. Every team. Every moment. Watch your local auction like IPL — right from your phone." },
              { icon: "🪪", title: "Your Cricket Identity", desc: "A permanent profile that grows with every tournament you play. Track your stats, share it, and own it." },
              { icon: "📊", title: "Real-time Scores", desc: "Live scores, auto commentary, and advanced match stats. Updated the moment the ball is bowled." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-card p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-border hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-300"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl mb-8 shadow-inner">{feature.icon}</div>
                <h3 className="text-2xl font-black text-navy mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-navy text-white py-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gold/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="text-gold text-7xl mb-8 font-serif leading-none">"</div>
          <p className="text-4xl md:text-5xl font-black leading-tight mb-12 text-white/90">
            We ran our first auction on CricketPro. Over 200 people watched live from their homes. <span className="text-gold">It changed how we play cricket.</span>
          </p>
          <div className="font-bold text-gray-400 uppercase tracking-[0.2em] text-sm">
            — Suresh K., Organizer, Yelahanka Cricket Club
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner border border-white/10">🏏</div>
          <h2 className="text-3xl font-black mb-10 tracking-tight">CricketPro</h2>
          
          <div className="flex flex-wrap justify-center gap-8 mb-16 font-bold text-gray-400">
            <Link to="#" className="hover:text-white transition-colors">About</Link>
            <Link to="/tournaments" className="hover:text-white transition-colors">Tournaments</Link>
            <Link to="/players" className="hover:text-white transition-colors">Players</Link>
            <Link to="#" className="hover:text-white transition-colors">Organizers</Link>
            <Link to="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
          
          <div className="text-gray-500 text-sm font-bold tracking-widest uppercase">
            Made in Karnataka 🇮🇳 for cricket lovers everywhere.
          </div>
        </div>
      </footer>
    </div>
  );
}
