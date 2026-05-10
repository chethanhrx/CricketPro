import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-7xl font-black text-navy leading-tight mb-6 tracking-tight">
              Your Local Cricket.<br/>
              <span className="text-gold">IPL Experience.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
              Live auctions. Real-time scores. Player profiles. Built for Karnataka's cricket community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/tournaments" className="btn-primary text-center">
                Watch Live Auction
              </Link>
              <Link to="/register" className="btn-secondary text-center">
                Create Tournament
              </Link>
            </div>
          </motion.div>

          {/* Right: Animated Mock */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-md"
          >
            {/* The mock card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative">
              <div className="bg-navy p-4 text-white flex justify-between items-center">
                <div className="font-bold">Yelahanka T20 Cup</div>
                <div className="badge-live">LIVE</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl">👤</div>
                  <div>
                    <div className="font-black text-xl text-navy">Manjunath R.</div>
                    <div className="text-sm text-gray-500 font-bold">🏏 BATSMAN</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 text-center mb-6">
                  <div className="text-xs font-bold text-gray-500 mb-1">CURRENT BID</div>
                  <motion.div 
                    key="mock-bid"
                    initial={{ scale: 1.2, color: '#E63946' }}
                    animate={{ scale: 1, color: '#F5A623' }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
                    className="text-4xl font-black"
                  >
                    ₹5,500
                  </motion.div>
                  <div className="text-sm font-bold text-navy mt-1">ROYAL KINGS</div>
                </div>

                <div className="space-y-2">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                    className="flex justify-between bg-yellow-50 p-2 rounded-lg border border-yellow-200"
                  >
                    <span className="font-bold text-navy">▲ Royal Kings</span>
                    <span className="font-black text-gold">₹5,500</span>
                  </motion.div>
                  <div className="flex justify-between p-2 text-gray-500">
                    <span className="font-bold">Thunder XI</span>
                    <span className="font-black">₹5,000</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold/10 blur-3xl -z-10 rounded-full"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="border-y border-gray-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-bold text-navy tracking-wide">
            🏏 127 Tournaments <span className="text-gray-300 mx-2">|</span> 3,400 Players <span className="text-gray-300 mx-2">|</span> 48 Cities
          </p>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-bg py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-header text-4xl">Everything you need to run a pro tournament</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card hover:shadow-md transition-shadow">
              <div className="text-5xl mb-4">🔴</div>
              <h3 className="text-xl font-bold text-navy mb-3">Watch Auctions Live</h3>
              <p className="body-text">Every bid. Every team. Every moment. Watch your local auction like IPL — right from your phone.</p>
            </div>
            <div className="card hover:shadow-md transition-shadow">
              <div className="text-5xl mb-4">🪪</div>
              <h3 className="text-xl font-bold text-navy mb-3">Your Cricket Identity</h3>
              <p className="body-text">A permanent profile that grows with every tournament you play. Track your stats, share it, and own it.</p>
            </div>
            <div className="card hover:shadow-md transition-shadow">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-navy mb-3">Real-time Scores</h3>
              <p className="body-text">Live scores, auto commentary, and advanced match stats. Updated the moment the ball is bowled.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white py-24 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-gold text-5xl mb-6">"</div>
          <p className="text-3xl font-black text-navy leading-tight mb-8">
            We ran our first auction on CricketPro. Over 200 people watched live from their homes. It changed how we play cricket.
          </p>
          <div className="font-bold text-gray-500 uppercase tracking-widest text-sm">
            — Suresh K., Organizer, Yelahanka Cricket Club
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-bg py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-header text-4xl text-center mb-16">How it works</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-8 left-1/8 right-1/8 h-0.5 bg-gray-200 z-0"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto bg-navy text-white rounded-2xl flex items-center justify-center font-black text-2xl mb-4 shadow-lg">1</div>
              <h4 className="font-bold text-navy text-lg mb-2">Create Tournament</h4>
              <p className="text-gray-500 text-sm">Set your rules, budget, and teams.</p>
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto bg-navy text-white rounded-2xl flex items-center justify-center font-black text-2xl mb-4 shadow-lg">2</div>
              <h4 className="font-bold text-navy text-lg mb-2">Players Register</h4>
              <p className="text-gray-500 text-sm">Players create their passports and join.</p>
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto bg-gold text-white rounded-2xl flex items-center justify-center font-black text-2xl mb-4 shadow-lg">3</div>
              <h4 className="font-bold text-navy text-lg mb-2">Live Auction</h4>
              <p className="text-gray-500 text-sm">Teams battle it out in the War Room.</p>
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto bg-navy text-white rounded-2xl flex items-center justify-center font-black text-2xl mb-4 shadow-lg">4</div>
              <h4 className="font-bold text-navy text-lg mb-2">Play & Score</h4>
              <p className="text-gray-500 text-sm">Live ball-by-ball scoring on the app.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          <div className="text-3xl mb-6">🏏</div>
          <h2 className="text-2xl font-black mb-8 tracking-tight">CricketPro</h2>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12 font-bold text-gray-400">
            <Link to="#" className="hover:text-white transition-colors">About</Link>
            <Link to="/tournaments" className="hover:text-white transition-colors">Tournaments</Link>
            <Link to="/players" className="hover:text-white transition-colors">Players</Link>
            <Link to="#" className="hover:text-white transition-colors">Organizers</Link>
            <Link to="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
          
          <div className="text-gray-500 text-sm font-medium tracking-wide">
            Made in Karnataka 🇮🇳 for cricket lovers everywhere.
          </div>
        </div>
      </footer>
    </div>
  );
}
