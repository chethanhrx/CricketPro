import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuctionStore } from '../stores/auctionStore';
import { connectWebSocket, disconnectWebSocket, sendBid } from '../services/websocket';
import PlayerCard from '../components/PlayerCard';
import Timer from '../components/Timer';
import BidFeed from '../components/BidFeed';

export default function StrategyRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const { 
    auctionStatus, 
    recentBids, 
    currentPlayer, 
    teamBudgets,
    soldPlayers,
    upcomingPlayers,
    timerSeconds,
    currentHighestBid,
    currentHighestTeam
  } = useAuctionStore();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'TEAM_OWNER' && parsedUser.role !== 'ADMIN') {
      navigate(`/auction/live/${id}`); // Redirect non-owners to public War Room
      return;
    }
    setUser(parsedUser);

    // 1. Fetch initial state
    fetch(`/api/auction/${id}/warroom`)
      .then(res => res.json())
      .then(data => {
        useAuctionStore.getState().initWarRoom(data);
      })
      .catch(err => console.error("Failed to fetch war room data:", err));

    // 2. Connect WebSocket
    const client = connectWebSocket(() => {
      useAuctionStore.getState().setConnected(true);
      
      // Subscriptions
      client.subscribe(`/topic/auction/${id}/bids`, (msg) => {
        useAuctionStore.getState().addBid(JSON.parse(msg.body));
      });
      client.subscribe(`/topic/auction/${id}/timer`, (msg) => {
        useAuctionStore.getState().updateTimer(JSON.parse(msg.body));
      });
      client.subscribe(`/topic/auction/${id}/player`, (msg) => {
        useAuctionStore.getState().setPlayerIntro(JSON.parse(msg.body));
      });
      client.subscribe(`/topic/auction/${id}/sold`, (msg) => {
        useAuctionStore.getState().processSold(JSON.parse(msg.body));
      });
    }, () => {
      useAuctionStore.getState().setConnected(false);
    });

    return () => disconnectWebSocket();
  }, [id, navigate]);

  if (!user) return null;

  // Find the owner's team in this tournament
  const myTeam = teamBudgets.find(t => t.ownerId === user.id);
  const highestBid = currentHighestBid || currentPlayer?.basePrice || 0;
  const isMyHighestBid = currentHighestTeam === myTeam?.teamName;
  const canAfford = (amount) => myTeam && myTeam.budgetRemaining >= amount;

  const handleBid = (increment) => {
    if (!myTeam || auctionStatus !== 'ACTIVE') return;
    const newBidAmount = highestBid + increment;
    
    if (canAfford(newBidAmount)) {
      sendBid(id, currentPlayer.playerId, myTeam.teamId, newBidAmount);
    } else {
      alert("Insufficient budget!");
    }
  };

  const handleAllIn = () => {
    if (!myTeam || auctionStatus !== 'ACTIVE') return;
    if (myTeam.budgetRemaining > highestBid) {
      sendBid(id, currentPlayer.playerId, myTeam.teamId, myTeam.budgetRemaining);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans pt-16 pb-24 lg:pb-0 relative overflow-hidden">
      
      {/* Dynamic Glowing Backgrounds */}
      <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden fixed">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brandRed/20 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-navy/20 blur-[100px]"
        />
      </div>

      {/* Top Private Budget Panel */}
      {myTeam && (
        <div className="bg-navy/95 backdrop-blur-xl text-white py-4 px-4 sm:px-6 sticky top-16 z-40 shadow-[0_10px_30px_rgba(26,26,46,0.5)] border-b border-gold/50">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-3xl drop-shadow-[0_0_10px_rgba(245,166,35,0.8)]">👑</span>
              <div>
                <div className="text-xs text-gold font-bold tracking-widest uppercase mb-1">My Strategy Room</div>
                <div className="text-2xl font-black drop-shadow-sm">{myTeam.teamName}</div>
              </div>
            </div>
            
            <div className="flex gap-8 bg-white/5 px-6 py-2 rounded-2xl border border-white/10">
              <div>
                <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Budget Remaining</div>
                <div className="text-2xl font-black text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">₹{myTeam.budgetRemaining?.toLocaleString()}</div>
              </div>
              <div className="w-px bg-white/10 mx-2"></div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Players Bought</div>
                <div className="text-2xl font-black text-white text-center">{myTeam.playersBought}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - 3 Column Layout */}
      <div className="flex-grow max-w-[1400px] mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column (30%) - Player Card & Watchlist Alert */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 xl:col-span-3 order-1 flex flex-col gap-6"
        >
          {currentPlayer && currentPlayer.hypeScore > 80 && (
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-yellow-100/90 backdrop-blur-md border border-yellow-300 text-yellow-800 p-4 rounded-2xl flex items-start gap-4 shadow-lg animate-pulse"
             >
               <span className="text-2xl mt-1">🔔</span>
               <div>
                 <div className="font-black text-sm tracking-wide">HIGH PRIORITY TARGET</div>
                 <div className="text-xs font-medium mt-1 opacity-80">This player matches your watchlist criteria.</div>
               </div>
             </motion.div>
          )}
          <PlayerCard player={currentPlayer} />
        </motion.div>

        {/* Center Column (40%) - Bidding Action */}
        <div className="lg:col-span-4 xl:col-span-6 order-2 flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white shadow-[0_20px_40px_-15px_rgba(26,26,46,0.1)] text-center py-10 relative overflow-hidden flex-shrink-0 transition-all duration-500 ${isMyHighestBid ? 'shadow-[0_0_30px_rgba(74,222,128,0.3)] border-green-400' : ''}`}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-navy/5 rounded-full blur-3xl"></div>
            
            {isMyHighestBid && (
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute top-0 left-0 w-full bg-green-500/90 backdrop-blur-sm text-white text-xs font-black py-2 tracking-widest uppercase shadow-sm"
              >
                You hold the highest bid
              </motion.div>
            )}

            <div className="text-sm font-bold tracking-widest text-gray-400 mb-2 mt-6 relative z-10">CURRENT HIGHEST BID</div>
            <motion.div 
              key={highestBid} 
              initial={{ scale: 1.2, color: '#E63946' }}
              animate={{ scale: 1, color: isMyHighestBid ? '#22c55e' : '#F5A623' }}
              className="text-6xl sm:text-7xl font-black mb-2 drop-shadow-sm relative z-10"
            >
              ₹{highestBid.toLocaleString()}
            </motion.div>
            <div className="text-lg font-bold text-navy h-6 mb-8 relative z-10">
              {currentHighestTeam ? (isMyHighestBid ? 'by YOUR TEAM' : `by ${currentHighestTeam}`) : 'Awaiting Bids'}
            </div>
            
            <div className="max-w-sm mx-auto relative z-10">
              <Timer secondsRemaining={timerSeconds} />
            </div>

            {auctionStatus !== 'ACTIVE' && auctionStatus !== 'SOLD' && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-20">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl font-black text-navy drop-shadow-sm tracking-tight"
                >
                  {auctionStatus || 'AWAITING PLAYERS'}
                </motion.div>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-grow min-h-[250px]"
          >
            <BidFeed bids={recentBids} currentHighestBid={highestBid} />
          </motion.div>
        </div>

        {/* Right Column (30%) - Competitor Tracker */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 xl:col-span-3 order-3 flex flex-col gap-8 h-full"
        >
          <div className="bg-white/60 backdrop-blur-md rounded-[2rem] border border-white shadow-sm p-6 flex-1 overflow-hidden flex flex-col relative">
            <div className="text-xs font-bold tracking-widest text-gray-500 mb-4 pb-2 border-b border-gray-200 uppercase">Competitor Tracker</div>
            <div className="overflow-y-auto pr-2 space-y-3 flex-grow custom-scrollbar">
              {teamBudgets.filter(t => t.teamId !== myTeam?.teamId).map(team => (
                <div key={team.teamId} className="flex justify-between items-center p-4 rounded-xl bg-white border border-gray-100 shadow-[0_4px_10px_-5px_rgba(0,0,0,0.05)]">
                  <div>
                    <div className="font-bold text-navy text-sm truncate max-w-[120px]">{team.teamName}</div>
                    <div className="text-xs text-gray-500 font-bold mt-1 tracking-wider">{team.playersBought} PLAYERS</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-red-500 text-lg drop-shadow-[0_0_2px_rgba(239,68,68,0.2)]">₹{team.budgetRemaining?.toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Left</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Bid Buttons (Fixed at bottom) */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-white p-4 shadow-[0_-20px_40px_rgba(26,26,46,0.15)] z-50 lg:sticky"
      >
        <div className="max-w-4xl mx-auto">
          {auctionStatus === 'ACTIVE' && currentPlayer ? (
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              <button 
                onClick={() => handleBid(100)}
                disabled={isMyHighestBid || !canAfford(highestBid + 100)}
                className="bg-navy hover:bg-navy/90 text-white font-black rounded-2xl shadow-[0_10px_20px_-10px_rgba(26,26,46,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(26,26,46,0.6)] hover:-translate-y-1 transition-all flex-1 sm:flex-none text-lg py-4 px-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none relative overflow-hidden group"
              >
                <span className="relative z-10">+ ₹100</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              </button>
              <button 
                onClick={() => handleBid(500)}
                disabled={isMyHighestBid || !canAfford(highestBid + 500)}
                className="bg-navy hover:bg-navy/90 text-white font-black rounded-2xl shadow-[0_10px_20px_-10px_rgba(26,26,46,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(26,26,46,0.6)] hover:-translate-y-1 transition-all flex-1 sm:flex-none text-lg py-4 px-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none relative overflow-hidden group"
              >
                <span className="relative z-10">+ ₹500</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              </button>
              <button 
                onClick={() => handleBid(1000)}
                disabled={isMyHighestBid || !canAfford(highestBid + 1000)}
                className="bg-navy hover:bg-navy/90 text-white font-black rounded-2xl shadow-[0_10px_20px_-10px_rgba(26,26,46,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(26,26,46,0.6)] hover:-translate-y-1 transition-all flex-1 sm:flex-none text-lg py-4 px-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none relative overflow-hidden group"
              >
                <span className="relative z-10">+ ₹1,000</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              </button>
              <button 
                onClick={handleAllIn}
                disabled={isMyHighestBid || !canAfford(highestBid + 100)}
                className="bg-brandRed hover:bg-brandRed/90 text-white font-black rounded-2xl shadow-[0_10px_20px_-10px_rgba(230,57,70,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(230,57,70,0.6)] hover:-translate-y-1 transition-all flex-1 sm:flex-none text-lg py-4 px-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none uppercase tracking-widest relative overflow-hidden group"
              >
                <span className="relative z-10">Go All In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              </button>
            </div>
          ) : (
            <div className="text-center font-black tracking-widest text-gray-400 py-6 uppercase">
              Bidding is currently closed
            </div>
          )}
        </div>
      </motion.div>

    </div>
  );
}
