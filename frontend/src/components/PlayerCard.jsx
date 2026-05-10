import React from 'react';
import { motion } from 'framer-motion';

export default function PlayerCard({ player }) {
  if (!player) return <div className="card h-full flex items-center justify-center text-gray-400">No player active</div>;

  const getRoleIcon = (role) => {
    switch(role) {
      case 'BATSMAN': return '🏏';
      case 'BOWLER': return '⚾';
      case 'WICKET_KEEPER': return '🧤';
      case 'ALL_ROUNDER': return '⚔️';
      default: return '🏏';
    }
  };

  // Mock data for the UI since we don't have deep stats in the backend yet
  const hypeScore = player.hypeScore || Math.floor(Math.random() * 30) + 60; // 60-90
  const basePrice = player.basePrice || 2000;

  return (
    <div className="card h-full flex flex-col justify-between overflow-hidden relative">
      {/* Avatar & Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-4xl shadow-sm">
          {player.avatarIcon || '👤'}
        </div>
        <div>
          <h2 className="text-2xl font-black text-navy">{player.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-md border border-gray-200">
              #{player.jerseyNumber || '00'}
            </span>
            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md border border-blue-200">
              {getRoleIcon(player.playerRole)} {player.playerRole?.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Hype Score */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-1">
          <span className="text-xs font-bold text-gray-500 tracking-wider">HYPE SCORE</span>
          <span className="font-black text-navy">{hypeScore}/100</span>
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${hypeScore}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-full ${hypeScore > 80 ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`}
          />
        </div>
      </div>

      {/* Mock Form/Stats */}
      <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600 border-b border-gray-200">
          LAST 3 TOURNAMENTS
        </div>
        <div className="divide-y divide-gray-100 text-sm">
          <div className="flex justify-between px-3 py-2">
            <span className="text-navy font-medium">Kolar Cup</span>
            <span className="text-gray-600">67 runs <span className="text-gold">★</span></span>
          </div>
          <div className="flex justify-between px-3 py-2">
            <span className="text-navy font-medium">Nelamangala T20</span>
            <span className="text-gray-600">112 runs <span className="text-gold">★★</span></span>
          </div>
          <div className="flex justify-between px-3 py-2">
            <span className="text-navy font-medium">Yelahanka Open</span>
            <span className="text-gray-600">34 runs</span>
          </div>
        </div>
      </div>

      {/* Career Stats */}
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 mb-6 flex justify-between text-center">
        <div>
          <div className="text-xs text-gray-500 font-bold">CAREER</div>
          <div className="font-bold text-navy">{player.totalRuns || 487} <span className="text-xs font-normal">runs</span></div>
        </div>
        <div>
          <div className="text-xs text-gray-500 font-bold">AVG</div>
          <div className="font-bold text-navy">42.3</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 font-bold">SR</div>
          <div className="font-bold text-navy">138.4</div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-2 mb-6">
        <span className="text-xl" title="Centurion">💯</span>
        <span className="text-xl" title="Power Hitter">🏏</span>
        <span className="text-xl" title="Star Player">⭐</span>
      </div>

      {/* Base Price */}
      <div className="bg-navy rounded-xl p-4 flex justify-between items-center text-white mt-auto">
        <span className="text-sm font-bold tracking-wider text-gray-300">BASE PRICE</span>
        <span className="text-2xl font-black text-gold">₹{basePrice.toLocaleString()}</span>
      </div>
    </div>
  );
}
