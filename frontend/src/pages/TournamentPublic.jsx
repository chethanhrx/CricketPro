import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import WhatsAppShare from '../components/WhatsAppShare';

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

  if (!tournament) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gray-100 text-gray-700 font-bold px-3 py-1 rounded-full text-xs tracking-widest">{tournament.format}</span>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 font-bold px-3 py-1 rounded-full text-xs tracking-widest">{tournament.status.replace('_', ' ')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-navy mb-4 tracking-tight">{tournament.name}</h1>
            <div className="text-gray-500 font-medium flex flex-col sm:flex-row gap-2 sm:gap-6">
              <span className="flex items-center gap-2">📍 {tournament.location}</span>
              <span className="flex items-center gap-2">📅 {tournament.date}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 min-w-[200px]">
            {tournament.status === 'AUCTION_PHASE' && (
              <Link to={`/auction/live/${id}`} className="btn-primary text-center flex justify-center items-center gap-2 animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Watch Live Auction
              </Link>
            )}
            <WhatsAppShare 
              text={`Check out ${tournament.name} on CricketPro!`} 
              url={window.location.href} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Teams Grid */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="section-header">Participating Teams</h2>
              <span className="text-sm font-bold text-gray-400 uppercase">{teams.length} Teams</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teams.map(team => (
                <div key={team.id} className="card flex flex-col justify-between hover:border-gold/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-2xl">
                      {team.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-navy text-lg">{team.name}</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Owner: {team.owner}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Players</div>
                      <div className="font-bold text-navy">{team.players}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Spent</div>
                      <div className="font-bold text-gold">₹{team.spent.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Points Table */}
          <section>
            <h2 className="section-header mb-6">Points Table</h2>
            <div className="card !p-0 overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <th className="py-4 px-6">Team</th>
                    <th className="py-4 px-3 text-center">P</th>
                    <th className="py-4 px-3 text-center">W</th>
                    <th className="py-4 px-3 text-center">L</th>
                    <th className="py-4 px-3 text-center">Pts</th>
                    <th className="py-4 px-6 text-right">NRR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-bold text-navy flex items-center gap-3">
                      <span className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-xs">1</span>
                      Royal Kings
                    </td>
                    <td className="py-4 px-3 text-center text-gray-600">0</td>
                    <td className="py-4 px-3 text-center text-gray-600">0</td>
                    <td className="py-4 px-3 text-center text-gray-600">0</td>
                    <td className="py-4 px-3 text-center font-bold text-navy">0</td>
                    <td className="py-4 px-6 text-right font-medium text-gray-500">+0.000</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-bold text-navy flex items-center gap-3">
                      <span className="w-6 h-6 rounded bg-gray-100 text-gray-700 flex items-center justify-center text-xs">2</span>
                      Thunder Eleven
                    </td>
                    <td className="py-4 px-3 text-center text-gray-600">0</td>
                    <td className="py-4 px-3 text-center text-gray-600">0</td>
                    <td className="py-4 px-3 text-center text-gray-600">0</td>
                    <td className="py-4 px-3 text-center font-bold text-navy">0</td>
                    <td className="py-4 px-6 text-right font-medium text-gray-500">+0.000</td>
                  </tr>
                </tbody>
              </table>
              <div className="p-4 text-center text-xs font-bold text-gray-400 bg-gray-50">
                Tournament has not started yet
              </div>
            </div>
          </section>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
          
          {/* Auction Summary */}
          <div className="card bg-navy text-white border-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 rounded-full blur-2xl"></div>
            <h3 className="text-lg font-bold mb-6 relative z-10">Auction Summary</h3>
            
            <div className="mb-6 relative z-10">
              <div className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-1">Total Pot</div>
              <div className="text-3xl font-black text-gold">₹{tournament.totalPot.toLocaleString()}</div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="text-xs text-gray-400 font-bold tracking-widest uppercase border-b border-gray-700 pb-2">Top Buys</div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-sm">Manjunath R.</div>
                  <div className="text-xs text-gray-400">Royal Kings</div>
                </div>
                <div className="font-bold text-gold">₹14,500</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-sm">Rahul S.</div>
                  <div className="text-xs text-gray-400">Thunder XI</div>
                </div>
                <div className="font-bold text-gold">₹12,000</div>
              </div>
            </div>
          </div>

          {/* Upcoming Fixtures */}
          <div className="card">
            <h3 className="section-header text-lg mb-6">Upcoming Fixtures</h3>
            <div className="space-y-4">
              <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                <div className="text-xs font-bold text-gray-400 text-center mb-3">DEC 10 • 09:00 AM</div>
                <div className="flex justify-between items-center font-bold text-navy">
                  <span>Royal Kings</span>
                  <span className="text-gray-300 px-2">v</span>
                  <span>Thunder XI</span>
                </div>
              </div>
              <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                <div className="text-xs font-bold text-gray-400 text-center mb-3">DEC 10 • 02:00 PM</div>
                <div className="flex justify-between items-center font-bold text-navy">
                  <span>Blue Tigers</span>
                  <span className="text-gray-300 px-2">v</span>
                  <span>Yelahanka Bulls</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
