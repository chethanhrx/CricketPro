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
    <div className="min-h-screen flex flex-col bg-bg font-sans pt-16 pb-24 lg:pb-0">
      
      {/* Top Private Budget Panel */}
      {myTeam && (
        <div className="bg-navy text-white py-4 px-4 sm:px-6 sticky top-16 z-40 shadow-md border-b-4 border-gold">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl">👑</span>
              <div>
                <div className="text-xs text-gray-400 font-bold tracking-widest uppercase">My Team</div>
                <div className="text-xl font-black">{myTeam.teamName}</div>
              </div>
            </div>
            
            <div className="flex gap-8">
              <div>
                <div className="text-xs text-gray-400 font-bold tracking-widest uppercase">Budget Remaining</div>
                <div className="text-2xl font-black text-green-400">₹{myTeam.budgetRemaining?.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold tracking-widest uppercase">Players Bought</div>
                <div className="text-2xl font-black text-white">{myTeam.playersBought}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - 3 Column Layout (Similar to War Room but optimized for bidding) */}
      <div className="flex-grow max-w-[1400px] mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (30%) - Player Card & Watchlist Alert */}
        <div className="lg:col-span-4 xl:col-span-3 order-1 flex flex-col gap-4">
          {currentPlayer && currentPlayer.hypeScore > 80 && (
             <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded-xl flex items-start gap-3 shadow-sm animate-pulse">
               <span className="text-xl">🔔</span>
               <div>
                 <div className="font-bold text-sm">HIGH PRIORITY TARGET</div>
                 <div className="text-xs">This player matches your watchlist criteria.</div>
               </div>
             </div>
          )}
          <PlayerCard player={currentPlayer} />
        </div>

        {/* Center Column (40%) - Bidding Action */}
        <div className="lg:col-span-4 xl:col-span-6 order-2 flex flex-col gap-6">
          <div className={`card text-center py-8 relative overflow-hidden flex-shrink-0 transition-colors ${isMyHighestBid ? 'border-4 border-green-500 bg-green-50' : ''}`}>
            
            {isMyHighestBid && (
              <div className="absolute top-0 left-0 w-full bg-green-500 text-white text-xs font-bold py-1 tracking-widest uppercase">
                You hold the highest bid
              </div>
            )}

            <div className="text-sm font-bold tracking-widest text-gray-400 mb-2 mt-4">CURRENT HIGHEST BID</div>
            <motion.div 
              key={highestBid} 
              initial={{ scale: 1.2, color: '#E63946' }}
              animate={{ scale: 1, color: isMyHighestBid ? '#2D7A3A' : '#F5A623' }}
              className="text-6xl sm:text-7xl font-black mb-2"
            >
              ₹{highestBid.toLocaleString()}
            </motion.div>
            <div className="text-lg font-bold text-navy h-6 mb-6">
              {currentHighestTeam ? (isMyHighestBid ? 'by YOUR TEAM' : `by ${currentHighestTeam}`) : 'Awaiting Bids'}
            </div>
            
            <div className="max-w-sm mx-auto">
              <Timer secondsRemaining={timerSeconds} />
            </div>

            {auctionStatus !== 'ACTIVE' && auctionStatus !== 'SOLD' && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-2xl font-black text-navy">{auctionStatus || 'AWAITING PLAYERS'}</div>
              </div>
            )}
          </div>

          <div className="flex-grow min-h-[250px]">
            <BidFeed bids={recentBids} currentHighestBid={highestBid} />
          </div>
        </div>

        {/* Right Column (30%) - Competitor Tracker */}
        <div className="lg:col-span-4 xl:col-span-3 order-3 flex flex-col gap-6 h-full">
          <div className="card flex-1 overflow-hidden flex flex-col">
            <div className="text-xs font-bold tracking-widest text-gray-500 mb-4 border-b border-gray-100 pb-2">COMPETITOR TRACKER</div>
            <div className="overflow-y-auto pr-2 space-y-3 flex-grow">
              {teamBudgets.filter(t => t.teamId !== myTeam?.teamId).map(team => (
                <div key={team.teamId} className="flex justify-between items-center p-3 rounded-lg border border-gray-100">
                  <div>
                    <div className="font-bold text-navy text-sm truncate max-w-[120px]">{team.teamName}</div>
                    <div className="text-xs text-gray-500 font-medium">{team.playersBought} players</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-red-500 text-sm">₹{team.budgetRemaining?.toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Left</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Bid Buttons (Fixed at bottom) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 lg:sticky">
        <div className="max-w-4xl mx-auto">
          {auctionStatus === 'ACTIVE' && currentPlayer ? (
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <button 
                onClick={() => handleBid(100)}
                disabled={isMyHighestBid || !canAfford(highestBid + 100)}
                className="btn-primary flex-1 sm:flex-none text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + ₹100
              </button>
              <button 
                onClick={() => handleBid(500)}
                disabled={isMyHighestBid || !canAfford(highestBid + 500)}
                className="btn-primary flex-1 sm:flex-none text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + ₹500
              </button>
              <button 
                onClick={() => handleBid(1000)}
                disabled={isMyHighestBid || !canAfford(highestBid + 1000)}
                className="btn-primary flex-1 sm:flex-none text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + ₹1,000
              </button>
              <button 
                onClick={handleAllIn}
                disabled={isMyHighestBid || !canAfford(highestBid + 100)}
                className="btn-danger flex-1 sm:flex-none text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                Go All In
              </button>
            </div>
          ) : (
            <div className="text-center font-bold text-gray-400 py-4">
              Bidding is currently closed
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
