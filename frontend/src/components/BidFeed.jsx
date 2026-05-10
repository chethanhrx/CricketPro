import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BidFeed({ bids, currentHighestBid }) {
  // Take only the last 8 bids
  const visibleBids = bids.slice(-8).reverse();

  return (
    <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">─── LIVE BID FEED ───</div>
      
      <div className="flex flex-col gap-2 relative h-64 overflow-hidden">
        <AnimatePresence>
          {visibleBids.map((bid, index) => {
            const isHighest = bid.amount === currentHighestBid;
            
            return (
              <motion.div
                key={bid.id || `${bid.teamId}-${bid.amount}`} // Fallback key if id missing
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: index > 4 ? 1 - (index - 4) * 0.2 : 1 }} // Fade out older bids
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                  isHighest ? 'bg-yellow-100 border border-yellow-300' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {isHighest && <span className="text-gold">▲</span>}
                  <span className={`font-bold ${isHighest ? 'text-navy' : 'text-gray-600'}`}>
                    {bid.teamName || 'Unknown Team'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-black ${isHighest ? 'text-gold' : 'text-gray-500'}`}>
                    ₹{bid.amount.toLocaleString()}
                  </span>
                  {isHighest && <span className="text-xs font-bold text-gray-500 bg-white px-2 py-0.5 rounded">NOW</span>}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {visibleBids.length === 0 && (
          <div className="text-center text-gray-400 font-medium py-8 italic">
            Waiting for first bid...
          </div>
        )}
      </div>
    </div>
  );
}
