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
    <div className="min-h-screen flex flex-col bg-bg font-sans pt-16">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-navy">Kolar Premium League</h1>
            <span className="badge-live">LIVE</span>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">T20</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-gray-500">
              <span className="mr-1">👁</span> 142 watching
            </div>
            <WhatsAppShare 
              text={`Watch our live auction! 🏏 \nCurrent Bid: ₹${highestBid.toLocaleString()} on ${currentPlayer?.name || 'Player'}`}
              url={window.location.href}
            />
            {!isConnected && (
              <span className="text-xs font-bold text-red-500 border border-red-200 bg-red-50 px-2 py-1 rounded">
                DISCONNECTED
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-grow max-w-[1400px] mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (30%) - Player Card */}
        <div className="lg:col-span-4 xl:col-span-3 order-1">
          <PlayerCard player={currentPlayer} />
        </div>

        {/* Center Column (40%) - Bidding Action */}
        <div className="lg:col-span-4 xl:col-span-6 order-2 flex flex-col gap-6">
          <div className="card text-center py-10 relative overflow-hidden flex-shrink-0">
            <div className="text-sm font-bold tracking-widest text-gray-400 mb-2">CURRENT HIGHEST BID</div>
            <motion.div 
              key={highestBid} // Animate on change
              initial={{ scale: 1.3, color: '#E63946' }}
              animate={{ scale: 1, color: '#F5A623' }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="text-6xl sm:text-7xl font-black mb-2"
            >
              ₹{highestBid.toLocaleString()}
            </motion.div>
            <div className="text-lg font-bold text-navy h-6">
              {winningTeam ? `by ${winningTeam.teamName}` : 'Awaiting Bids'}
            </div>
            
            <div className="mt-8 max-w-sm mx-auto">
              <Timer secondsRemaining={timerSeconds} />
            </div>
            
            {/* Status Overlay for setup/paused */}
            {auctionStatus !== 'ACTIVE' && auctionStatus !== 'SOLD' && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-2xl font-black text-navy">{auctionStatus || 'AWAITING PLAYERS'}</div>
              </div>
            )}
          </div>

          <div className="flex-grow min-h-[300px]">
            <BidFeed bids={recentBids} currentHighestBid={highestBid} />
          </div>
        </div>

        {/* Right Column (30%) - Teams & Sold */}
        <div className="lg:col-span-4 xl:col-span-3 order-3 flex flex-col gap-6 h-full">
          {/* Teams Budget */}
          <div className="card flex-1 overflow-hidden flex flex-col">
            <div className="text-xs font-bold tracking-widest text-gray-500 mb-4 border-b border-gray-100 pb-2">TEAMS BUDGET</div>
            <div className="overflow-y-auto pr-2 space-y-3 flex-grow">
              {teamBudgets.map(team => (
                <div key={team.teamId} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="font-bold text-navy truncate mr-2">{team.teamName}</div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-black text-green-600">₹{team.budgetRemaining?.toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Left</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sold History */}
          <div className="card flex-1 overflow-hidden flex flex-col">
            <div className="text-xs font-bold tracking-widest text-gray-500 mb-4 border-b border-gray-100 pb-2">SOLD PLAYERS</div>
            <div className="overflow-y-auto pr-2 space-y-3 flex-grow">
              {soldPlayers.map(p => (
                <div key={p.playerId} className="flex justify-between items-center p-3 rounded-lg border border-gray-100">
                  <div>
                    <div className="font-bold text-navy text-sm">{p.playerName}</div>
                    <div className="text-xs text-gray-500 font-medium">→ {p.teamName}</div>
                  </div>
                  <div className="font-black text-navy">₹{p.soldPrice?.toLocaleString()}</div>
                </div>
              ))}
              {soldPlayers.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-4">No players sold yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Coming Up */}
      <div className="bg-navy text-white py-3 px-6 overflow-hidden sticky bottom-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center whitespace-nowrap overflow-x-auto no-scrollbar gap-6 text-sm">
          <div className="font-bold text-gold tracking-widest mr-2 shrink-0">COMING UP:</div>
          {upcomingPlayers.slice(0, 5).map((q, i) => (
            <div key={q.playerId} className="flex items-center shrink-0">
              <span className={`font-bold ${i === 0 ? 'text-white' : 'text-gray-400'}`}>{q.playerName}</span>
              <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">Base: ₹{q.basePrice}</span>
              {i < upcomingPlayers.length - 1 && <span className="mx-4 text-gray-600">|</span>}
            </div>
          ))}
          {upcomingPlayers.length === 0 && <span className="text-gray-400">Queue is empty</span>}
        </div>
      </div>

      {/* Full Screen SOLD Overlay Animation */}
      <AnimatePresence>
        {soldAnimation && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-green-600 flex items-center justify-center z-[100]"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-white text-center"
            >
              <div className="text-8xl md:text-[150px] font-black tracking-tighter shadow-black drop-shadow-2xl mb-4">SOLD!</div>
              <div className="text-5xl md:text-7xl font-black text-gold drop-shadow-lg mb-2">
                ₹{soldAnimation.amount.toLocaleString()}
              </div>
              <div className="text-2xl md:text-4xl font-bold opacity-90 uppercase tracking-widest">
                To {soldAnimation.teamName}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
