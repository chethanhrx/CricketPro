import { useEffect, useState } from 'react';
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>🏏 CricketPro</h1>
            <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user.name}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className="badge badge-gold">{user.role}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Organizer actions */}
          {(user.role === 'ORGANIZER' || user.role === 'ADMIN') && (
            <>
              <ActionCard
                icon="🏆" title="Create Tournament" desc="Set up a new cricket tournament"
                onClick={() => {}} accent="gold"
              />
              <ActionCard
                icon="🔨" title="Manage Auctions" desc="Start and control player auctions"
                onClick={() => {}} accent="purple"
              />
            </>
          )}

          {/* Team Owner actions */}
          {(user.role === 'TEAM_OWNER' || user.role === 'ADMIN') && (
            <>
              <ActionCard
                icon="👑" title="My Teams" desc="View your teams across tournaments"
                onClick={() => {}} accent="gold"
              />
              <ActionCard
                icon="📋" title="Strategy Room" desc="Private auction view with AI suggestions"
                onClick={() => {}} accent="blue"
              />
            </>
          )}

          {/* Player actions */}
          {(user.role === 'PLAYER' || user.role === 'ADMIN') && (
            <ActionCard
              icon="🏏" title="My Profile" desc="View your Player Passport and stats"
              onClick={() => {}} accent="green"
            />
          )}

          {/* Common actions */}
          <ActionCard
            icon="📡" title="Live Auctions" desc="Watch ongoing auctions in real-time"
            onClick={() => {}} accent="red"
          />
          <ActionCard
            icon="📊" title="Tournaments" desc="Browse all public tournaments"
            onClick={() => {}} accent="blue"
          />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick, accent = 'gold' }) {
  const accentColors = {
    gold: 'rgba(245, 158, 11, 0.1)',
    blue: 'rgba(59, 130, 246, 0.1)',
    green: 'rgba(16, 185, 129, 0.1)',
    purple: 'rgba(139, 92, 246, 0.1)',
    red: 'rgba(239, 68, 68, 0.1)',
  };

  return (
    <div className="glass-card" onClick={onClick}
      style={{ cursor: 'pointer', background: accentColors[accent] || accentColors.gold }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{desc}</p>
    </div>
  );
}
