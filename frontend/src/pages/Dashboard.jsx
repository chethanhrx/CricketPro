import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight">Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-navy text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-widest uppercase">
            {user.role.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Organizer / Admin View */}
      {(user.role === 'ORGANIZER' || user.role === 'ADMIN') && (
        <div className="space-y-10">
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Active Tournaments" value="1" icon="🏆" />
            <StatCard title="Total Teams" value="8" icon="🛡️" />
            <StatCard title="Players Registered" value="124" icon="👥" />
            <StatCard title="Auction Revenue" value="₹4.2L" icon="💰" />
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="section-header mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ActionCard 
                title="Create Tournament" 
                desc="Setup a new tournament and set rules" 
                icon="➕" 
                to="/tournaments/create"
                accent="border-l-4 border-gold"
              />
              <ActionCard 
                title="Manage Teams" 
                desc="Add teams and assign owners" 
                icon="🛡️" 
                to="#"
                accent="border-l-4 border-blue-500"
              />
              <ActionCard 
                title="Auction Control Panel" 
                desc="Start sessions and manage the queue" 
                icon="🔨" 
                to="#"
                accent="border-l-4 border-red-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Team Owner View */}
      {(user.role === 'TEAM_OWNER') && (
        <div className="space-y-10">
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard title="My Teams" value="2" icon="👑" />
            <StatCard title="Players Bought" value="14" icon="👥" />
            <StatCard title="Total Budget Spent" value="₹42,500" icon="💸" />
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="section-header mb-6">Action Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ActionCard 
                title="Strategy Room (Live)" 
                desc="Enter the private bidding room for your active auctions" 
                icon="🔥" 
                to="/strategy-room/1"
                accent="border-l-4 border-red-500"
              />
              <ActionCard 
                title="My Squad" 
                desc="View your bought players and stats" 
                icon="📋" 
                to="#"
                accent="border-l-4 border-navy"
              />
            </div>
          </div>
        </div>
      )}

      {/* Player View */}
      {(user.role === 'PLAYER') && (
        <div className="space-y-10">
          <div className="card max-w-2xl">
            <div className="flex items-center gap-6 mb-6 border-b border-gray-100 pb-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-4xl shadow-inner">
                {user.avatarIcon || '👤'}
              </div>
              <div>
                <h2 className="text-2xl font-black text-navy">{user.name}</h2>
                <p className="text-gray-500 font-medium">🏏 Batsman • Base Price: ₹2,000</p>
                <div className="mt-2 flex gap-2">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">HYPE: 84/100</span>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">UNSOLD</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-400 font-bold tracking-widest">MATCHES</div>
                <div className="text-xl font-black text-navy">24</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold tracking-widest">RUNS</div>
                <div className="text-xl font-black text-navy">642</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-bold tracking-widest">WICKETS</div>
                <div className="text-xl font-black text-navy">5</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="card flex items-center gap-4">
      <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-2xl border border-gray-100">
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">{title}</div>
        <div className="text-2xl font-black text-navy">{value}</div>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, icon, to, accent }) {
  return (
    <Link to={to} className={`card hover:-translate-y-1 transition-transform cursor-pointer ${accent}`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-navy mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </Link>
  );
}
