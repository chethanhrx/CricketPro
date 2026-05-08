import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ROLES = [
  { value: 'PLAYER', label: '🏏 Player', desc: 'Register for tournaments' },
  { value: 'TEAM_OWNER', label: '👑 Team Owner', desc: 'Buy teams, bid in auctions' },
  { value: 'ORGANIZER', label: '🎯 Organizer', desc: 'Create and manage tournaments' },
  { value: 'SCORER', label: '📋 Scorer', desc: 'Enter live match scores' },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'PLAYER', location: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-card" style={{ maxWidth: 500, width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏏</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Join CricketPro</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem' }}>Create your cricket account</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '1rem',
            color: 'var(--accent-danger)', fontSize: '0.9rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block' }}>Full Name</label>
            <input className="input-field" required placeholder="Virat Kohli"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block' }}>Email</label>
            <input className="input-field" type="email" required placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block' }}>Password</label>
            <input className="input-field" type="password" required placeholder="Min 6 characters" minLength={6}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block' }}>Phone</label>
            <input className="input-field" placeholder="+91 98765 43210"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block' }}>Location</label>
            <input className="input-field" placeholder="Bangalore, Karnataka"
              value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>

          {/* Role Selector */}
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>I am a...</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {ROLES.map((role) => (
                <div key={role.value}
                  onClick={() => setForm({ ...form, role: role.value })}
                  style={{
                    padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    background: form.role === role.value ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-secondary)',
                    border: `1px solid ${form.role === role.value ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    transition: 'all 0.2s',
                  }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{role.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{role.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
