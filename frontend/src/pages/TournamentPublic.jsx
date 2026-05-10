import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import WhatsAppShare from '../components/WhatsAppShare';
import { motion } from 'framer-motion';

export default function TournamentPublic() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Mock fetch for now
    setTournament({
      id: id,
      name: 'Kolar Premium League 2026',
      format: 'T20',
      status: 'AUCTION_PHASE',
      location: 'Kolar District Grounds, Karnataka',
      date: 'Dec 10 - Dec 25, 2026',
      totalPot: 400000
    });

    setTeams([
      { id: 1, name: 'Royal Kings', owner: 'Owner 1', players: 14, spent: 42500, avatar: '👑' },
      { id: 2, name: 'Thunder Eleven', owner: 'Owner 2', players: 12, spent: 38000, avatar: '⚡' },
      { id: 3, name: 'Blue Tigers', owner: 'Suresh K', players: 15, spent: 48000, avatar: '🐅' },
      { id: 4, name: 'Yelahanka Bulls', owner: 'Ramesh', players: 13, spent: 41000, avatar: '🐂' },
    ]);
  }, [id]);

  if (!tournament) return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="text-4xl">🏏</motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden font-sans pb-20">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-[0_20px_40px_-15px_rgba(26,26,46,0.1)] border border-white mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
            <div>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-white/80 border border-gray-200 text-navy font-bold px-4 py-1.5 rounded-full text-xs tracking-widest shadow-sm uppercase">{tournament.format}</span>
                <span className="bg-red/10 border border-red/20 text-red font-black px-4 py-1.5 rounded-full text-xs tracking-widest shadow-sm uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red animate-pulse"></span>
                  {tournament.status.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-navy mb-4 tracking-tight drop-shadow-sm">{tournament.name}</h1>
              <div className="text-gray-500 font-medium flex flex-col sm:flex-row gap-2 sm:gap-8 text-lg">
                <span className="flex items-center gap-2">📍 {tournament.location}</span>
                <span className="flex items-center gap-2">📅 {tournament.date}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 min-w-[250px]">
              {tournament.status === 'AUCTION_PHASE' && (
                <Link to={`/auction/live/${id}`} className="bg-navy text-white text-center font-bold text-lg px-8 py-4 rounded-2xl shadow-[0_10px_30px_-10px_rgba(26,26,46,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(26,26,46,0.6)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <span className="w-3 h-3 bg-red rounded-full animate-pulse shadow-[0_0_10px_rgba(230,57,70,0.8)]"></span>
                    Watch Live
                  </span>
                  <motion.div 
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"
                  />
                </Link>
              )}
              <WhatsAppShare 
                text={`Check out ${tournament.name} on CricketPro!`} 
                url={window.location.href} 
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Teams Grid */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-black text-navy tracking-tight">Participating Teams</h2>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{teams.length} Teams</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {teams.map(team => (
                  <motion.div 
                    key={team.id} 
                    whileHover={{ scale: 1.02, translateY: -4 }}
                    className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border border-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-gold/30 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-200 border border-white flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                        {team.avatar}
                      </div>
                      <div>
                        <h3 className="font-black text-navy text-xl">{team.name}</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Owner: {team.owner}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-5 border-t border-gray-100">
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Players</div>
                        <div className="font-black text-navy text-lg">{team.players}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Spent</div>
                        <div className="font-black text-gold text-lg">₹{team.spent.toLocaleString()}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Points Table */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-black text-navy tracking-tight mb-8">Points Table</h2>
              <div className="bg-white/60 backdrop-blur-md rounded-[2rem] shadow-sm border border-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <th className="py-5 px-8">Team</th>
                        <th className="py-5 px-4 text-center">P</th>
                        <th className="py-5 px-4 text-center">W</th>
                        <th className="py-5 px-4 text-center">L</th>
                        <th className="py-5 px-4 text-center">Pts</th>
                        <th className="py-5 px-8 text-right">NRR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      <tr className="hover:bg-white transition-colors">
                        <td className="py-5 px-8 font-black text-navy flex items-center gap-4 text-base">
                          <span className="w-8 h-8 rounded-xl bg-gold/20 text-gold border border-gold/30 flex items-center justify-center text-xs shadow-inner">1</span>
                          Royal Kings
                        </td>
                        <td className="py-5 px-4 text-center text-gray-500 font-medium">0</td>
                        <td className="py-5 px-4 text-center text-gray-500 font-medium">0</td>
                        <td className="py-5 px-4 text-center text-gray-500 font-medium">0</td>
                        <td className="py-5 px-4 text-center font-black text-navy text-base">0</td>
                        <td className="py-5 px-8 text-right font-bold text-gray-400">+0.000</td>
                      </tr>
                      <tr className="hover:bg-white transition-colors">
                        <td className="py-5 px-8 font-black text-navy flex items-center gap-4 text-base">
                          <span className="w-8 h-8 rounded-xl bg-gray-100 text-gray-500 border border-gray-200 flex items-center justify-center text-xs shadow-inner">2</span>
                          Thunder Eleven
                        </td>
                        <td className="py-5 px-4 text-center text-gray-500 font-medium">0</td>
                        <td className="py-5 px-4 text-center text-gray-500 font-medium">0</td>
                        <td className="py-5 px-4 text-center text-gray-500 font-medium">0</td>
                        <td className="py-5 px-4 text-center font-black text-navy text-base">0</td>
                        <td className="py-5 px-8 text-right font-bold text-gray-400">+0.000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-6 text-center text-sm font-bold text-gray-400 bg-gray-50/50 uppercase tracking-widest">
                  Tournament has not started yet
                </div>
              </div>
            </motion.section>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-10">
            
            {/* Auction Summary */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-navy/95 backdrop-blur-xl text-white rounded-[2.5rem] p-8 shadow-[0_20px_40px_-15px_rgba(26,26,46,0.4)] border border-white/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              <h3 className="text-xl font-black mb-8 relative z-10 tracking-tight">Auction Summary</h3>
              
              <div className="mb-8 relative z-10 bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="text-xs text-blue-200 font-bold tracking-widest uppercase mb-2">Total Pot</div>
                <div className="text-4xl font-black text-gold drop-shadow-md">₹{tournament.totalPot.toLocaleString()}</div>
              </div>

              <div className="space-y-5 relative z-10">
                <div className="text-xs text-gray-400 font-bold tracking-widest uppercase border-b border-white/10 pb-3">Top Buys</div>
                <div className="flex justify-between items-center bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <div className="font-black text-base text-white">Manjunath R.</div>
                    <div className="text-xs text-gold font-bold tracking-wider mt-1">Royal Kings</div>
                  </div>
                  <div className="font-black text-xl text-white">₹14,500</div>
                </div>
                <div className="flex justify-between items-center bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <div className="font-black text-base text-white">Rahul S.</div>
                    <div className="text-xs text-gold font-bold tracking-wider mt-1">Thunder XI</div>
                  </div>
                  <div className="font-black text-xl text-white">₹12,000</div>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Fixtures */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm border border-white"
            >
              <h3 className="text-xl font-black text-navy mb-8 tracking-tight">Upcoming Fixtures</h3>
              <div className="space-y-5">
                <div className="bg-white rounded-2xl p-5 shadow-[0_5px_15px_-5px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)] hover:border-gold/30 transition-all cursor-pointer">
                  <div className="text-[10px] font-bold text-gray-400 text-center mb-4 tracking-widest uppercase bg-gray-50 py-1 rounded-lg">DEC 10 • 09:00 AM</div>
                  <div className="flex justify-between items-center font-black text-navy text-sm sm:text-base">
                    <span>Royal Kings</span>
                    <span className="text-gray-300 px-2 font-medium">v</span>
                    <span>Thunder XI</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-[0_5px_15px_-5px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.1)] hover:border-gold/30 transition-all cursor-pointer">
                  <div className="text-[10px] font-bold text-gray-400 text-center mb-4 tracking-widest uppercase bg-gray-50 py-1 rounded-lg">DEC 10 • 02:00 PM</div>
                  <div className="flex justify-between items-center font-black text-navy text-sm sm:text-base">
                    <span>Blue Tigers</span>
                    <span className="text-gray-300 px-2 font-medium">v</span>
                    <span>Yelahanka Bulls</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
