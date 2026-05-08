import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tournamentAPI } from '../services/api';

export default function TournamentPublic() {
  const { slug } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await tournamentAPI.getBySlug(slug);
        setTournament(res.data);
      } catch {
        // Not found
      }
      setLoading(false);
    }
    fetch();
  }, [slug]);

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = `Check out ${tournament?.name} on CricketPro! 🏏\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: 'var(--text-muted)' }}>Loading tournament...</p>
    </div>
  );

  if (!tournament) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>🏏</div>
        <h2>Tournament not found</h2>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Hero */}
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', marginBottom: '1.5rem' }}>
          <span className={`badge ${tournament.status === 'IN_PROGRESS' ? 'badge-green' : 'badge-gold'}`}>
            {tournament.status}
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', margin: '1rem 0 0.5rem' }}>
            {tournament.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            📍 {tournament.location || 'Location TBA'}
          </p>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Organized by {tournament.organizerName}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={shareOnWhatsApp}>
              📱 Share on WhatsApp
            </button>
            {tournament.status === 'AUCTION_PHASE' && (
              <a href={`/auction/live/${tournament.id}`} className="btn btn-success" style={{ textDecoration: 'none' }}>
                🔴 Watch Live Auction
              </a>
            )}
          </div>
        </div>

        {/* Tournament Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <StatBox label="Teams" value={tournament.teamCount} icon="👥" />
          <StatBox label="Players/Team" value={tournament.playersPerTeam} icon="🏏" />
          <StatBox label="Budget/Team" value={`₹${(tournament.budgetPerTeam || 0).toLocaleString('en-IN')}`} icon="💰" />
          <StatBox label="Format" value={`T${tournament.oversPerMatch}`} icon="📋" />
          <StatBox label="Ownership Fee" value={`₹${(tournament.teamOwnershipFee || 0).toLocaleString('en-IN')}`} icon="🎫" />
          <StatBox label="Start Date" value={tournament.startDate || 'TBA'} icon="📅" />
        </div>

        {tournament.description && (
          <div className="glass-card" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>About this Tournament</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{tournament.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div className="glass-card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700 }}>{value}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}
