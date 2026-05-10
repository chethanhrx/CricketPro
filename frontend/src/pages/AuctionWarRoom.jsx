import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuctionStore } from '../stores/auctionStore';
import { connectWebSocket, disconnectWebSocket, sendBid } from '../services/websocket';
import PlayerCard from '../components/PlayerCard';
import Timer from '../components/Timer';
import BidFeed from '../components/BidFeed';
import WhatsAppShare from '../components/WhatsAppShare';

export default function AuctionWarRoom() {
  const { id } = useParams();
  const [soldAnimation, setSoldAnimation] = useState(null);
  
  const { 
    auctionStatus, 
    recentBids, 
    currentPlayer, 
    teamBudgets,
    soldPlayers,
    upcomingPlayers,
    timerSeconds, 
    isConnected,
    currentHighestBid,
    currentHighestTeam
  } = useAuctionStore();

  useEffect(() => {
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
  }, [id]);

  // Listen for SOLD event to trigger animation
  useEffect(() => {
    if (auctionStatus === 'SOLD' && currentPlayer) {
      const winningTeam = teamBudgets.find(t => t.teamName === currentHighestTeam);
      setSoldAnimation({
        amount: currentHighestBid,
        teamName: winningTeam ? winningTeam.teamName : currentHighestTeam || 'Unknown Team',
      });
      
      // Hide after 3 seconds
      const timeout = setTimeout(() => setSoldAnimation(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [auctionStatus, currentHighestBid, currentPlayer, currentHighestTeam, teamBudgets]);

  // Determine current highest bid amount
  const highestBid = currentHighestBid || currentPlayer?.basePrice || 0;
  const winningTeam = teamBudgets.find(t => t.teamName === currentHighestTeam);

  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans pt-16 relative overflow-hidden">
      
      {/* Dynamic Glowing Backgrounds */}
      <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden fixed">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold/20 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-navy/10 blur-[100px]"
        />
      </div>

      {/* Top Bar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/50 py-3 px-4 sm:px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-navy drop-shadow-sm">Kolar Premium League</h1>
            <span className="badge-live animate-pulse shadow-[0_0_10px_rgba(230,57,70,0.5)]">LIVE</span>
            <span className="text-xs font-bold text-gray-500 bg-white/50 border border-gray-200 px-3 py-1 rounded-full shadow-sm">T20</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-gray-500 flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              142 watching
            </div>
            <WhatsAppShare 
              text={`Watch our live auction! 🏏 \nCurrent Bid: ₹${highestBid.toLocaleString()} on ${currentPlayer?.name || 'Player'}`}
              url={window.location.href}
            />
            {!isConnected && (
              <span className="text-xs font-bold text-red-500 border border-red-200 bg-red-50 px-3 py-1.5 rounded-full shadow-sm">
                DISCONNECTED
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-grow max-w-[1400px] mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column (30%) - Player Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 xl:col-span-3 order-1"
        >
          <PlayerCard player={currentPlayer} />
        </motion.div>

        {/* Center Column (40%) - Bidding Action */}
        <div className="lg:col-span-4 xl:col-span-6 order-2 flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white shadow-[0_20px_40px_-15px_rgba(26,26,46,0.1)] text-center py-10 relative overflow-hidden flex-shrink-0"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl"></div>
            
            <div className="text-sm font-bold tracking-widest text-gray-400 mb-2 relative z-10">CURRENT HIGHEST BID</div>
            <motion.div 
              key={highestBid} // Animate on change
              initial={{ scale: 1.3, color: '#E63946' }}
              animate={{ scale: 1, color: '#F5A623' }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="text-6xl sm:text-7xl font-black mb-2 drop-shadow-sm relative z-10"
            >
              ₹{highestBid.toLocaleString()}
            </motion.div>
            <div className="text-lg font-bold text-navy h-6 relative z-10">
              {winningTeam ? `by ${winningTeam.teamName}` : 'Awaiting Bids'}
            </div>
            
            <div className="mt-8 max-w-sm mx-auto relative z-10">
              <Timer secondsRemaining={timerSeconds} />
            </div>
            
            {/* Status Overlay for setup/paused */}
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
            className="flex-grow min-h-[300px]"
          >
            <BidFeed bids={recentBids} currentHighestBid={highestBid} />
          </motion.div>
        </div>

        {/* Right Column (30%) - Teams & Sold */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 xl:col-span-3 order-3 flex flex-col gap-8 h-full"
        >
          {/* Teams Budget */}
          <div className="bg-white/60 backdrop-blur-md rounded-[2rem] border border-white shadow-sm p-6 flex-1 overflow-hidden flex flex-col relative">
            <div className="text-xs font-bold tracking-widest text-gray-500 mb-4 pb-2 border-b border-gray-200 uppercase">Teams Budget</div>
            <div className="overflow-y-auto pr-2 space-y-3 flex-grow custom-scrollbar">
              {teamBudgets.map(team => (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  key={team.teamId} 
                  className="flex justify-between items-center p-4 rounded-xl bg-white border border-gray-100 shadow-[0_4px_10px_-5px_rgba(0,0,0,0.05)] cursor-default"
                >
                  <div className="font-bold text-navy truncate mr-2">{team.teamName}</div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-black text-green-600 text-lg">₹{team.budgetRemaining?.toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Left</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sold History */}
          <div className="bg-white/60 backdrop-blur-md rounded-[2rem] border border-white shadow-sm p-6 flex-1 overflow-hidden flex flex-col relative">
            <div className="text-xs font-bold tracking-widest text-gray-500 mb-4 pb-2 border-b border-gray-200 uppercase">Sold Players</div>
            <div className="overflow-y-auto pr-2 space-y-3 flex-grow custom-scrollbar">
              {soldPlayers.map(p => (
                <div key={p.playerId} className="flex justify-between items-center p-4 rounded-xl bg-white border border-gray-100 shadow-[0_4px_10px_-5px_rgba(0,0,0,0.05)]">
                  <div>
                    <div className="font-bold text-navy text-sm">{p.playerName}</div>
                    <div className="text-xs text-gold font-bold tracking-wider mt-1">→ {p.teamName}</div>
                  </div>
                  <div className="font-black text-navy">₹{p.soldPrice?.toLocaleString()}</div>
                </div>
              ))}
              {soldPlayers.length === 0 && (
                <div className="text-center text-gray-400 text-sm font-bold tracking-widest mt-8">NO PLAYERS SOLD YET</div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar - Coming Up */}
      <div className="bg-navy/95 backdrop-blur-xl text-white py-4 px-6 overflow-hidden sticky bottom-0 z-50 border-t border-white/10 shadow-[0_-10px_30px_rgba(26,26,46,0.3)]">
        <div className="max-w-7xl mx-auto flex items-center whitespace-nowrap overflow-x-auto no-scrollbar gap-8 text-sm">
          <div className="font-black text-gold tracking-widest mr-2 shrink-0 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            COMING UP
          </div>
          {upcomingPlayers.slice(0, 5).map((q, i) => (
            <div key={q.playerId} className="flex items-center shrink-0">
              <span className={`font-bold ${i === 0 ? 'text-white' : 'text-gray-400'}`}>{q.playerName}</span>
              <span className="ml-3 text-xs bg-white/10 px-3 py-1 rounded-full text-gray-300 font-bold tracking-widest">Base: ₹{q.basePrice}</span>
              {i < upcomingPlayers.length - 1 && <span className="mx-6 text-gray-600">|</span>}
            </div>
          ))}
          {upcomingPlayers.length === 0 && <span className="text-gray-400 font-bold tracking-widest">QUEUE IS EMPTY</span>}
        </div>
      </div>

      {/* Full Screen SOLD Overlay Animation */}
      <AnimatePresence>
        {soldAnimation && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-green-600/90 backdrop-blur-lg flex items-center justify-center z-[100]"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-white text-center"
            >
              <div className="text-8xl md:text-[150px] font-black tracking-tighter drop-shadow-2xl mb-4">SOLD!</div>
              <div className="text-5xl md:text-7xl font-black text-gold drop-shadow-lg mb-4">
                ₹{soldAnimation.amount.toLocaleString()}
              </div>
              <div className="text-2xl md:text-4xl font-bold opacity-90 uppercase tracking-widest bg-white/20 px-8 py-4 rounded-3xl inline-block backdrop-blur-md">
                To {soldAnimation.teamName}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
