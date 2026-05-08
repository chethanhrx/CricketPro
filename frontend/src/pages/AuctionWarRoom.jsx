import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuctionStore } from '../stores/auctionStore';
import { connectWebSocket, disconnectWebSocket } from '../services/websocket';
import { auctionAPI } from '../services/api';

export default function AuctionWarRoom() {
  const { tournamentId } = useParams();
  const store = useAuctionStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial War Room state from REST API
  useEffect(() => {
    async function fetchState() {
      try {
        const res = await auctionAPI.getWarRoom(tournamentId);
        store.initWarRoom(res.data);
        setLoading(false);
      } catch (err) {
        setError('Auction not found or not started yet');
        setLoading(false);
      }
    }
    fetchState();
  }, [tournamentId]);

  // Connect WebSocket and subscribe to channels
  useEffect(() => {
    const client = connectWebSocket((stompClient) => {
      store.setConnected(true);

      // Public auction channel — timer, sold, unsold, completed events
      stompClient.subscribe(`/topic/auction/${tournamentId}`, (message) => {
        const data = JSON.parse(message.body);

        if (data.type === 'SOLD') {
          store.processSold(data.data);
          // Auto-hide SOLD overlay after 3 seconds
          setTimeout(() => store.hideSoldOverlay(), 3000);
        } else if (data.type === 'UNSOLD') {
          // Brief unsold notification
          store.setPlayerIntro(null);
        } else if (data.type === 'PLAYER_INTRO') {
          store.setPlayerIntro(data.data);
        } else if (data.type === 'BIDDING_START') {
          // Timer starts
        } else if (data.type === 'COMPLETED') {
          store.initWarRoom({ ...store, auctionStatus: 'COMPLETED' });
        } else if (data.secondsRemaining !== undefined) {
          store.updateTimer(data);
        }
      });

      // Bid feed channel
      stompClient.subscribe(`/topic/auction/${tournamentId}/feed`, (message) => {
        const bid = JSON.parse(message.body);
        store.addBid(bid);
      });
    });

    return () => {
      disconnectWebSocket();
      store.setConnected(false);
    };
  }, [tournamentId]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="warroom">
      {/* SOLD Overlay Animation */}
      <AnimatePresence>
        {store.showSoldOverlay && store.soldData && (
          <SoldOverlay data={store.soldData} onClose={() => store.hideSoldOverlay()} />
        )}
      </AnimatePresence>

      {/* Floating Reactions */}
      {store.reactions.map((r) => (
        <span key={r.id} className="floating-reaction" style={{ left: `${r.x}%`, bottom: '20%' }}>
          {r.emoji}
        </span>
      ))}

      {/* Main Content */}
      <div className="warroom-main">
        {/* Header */}
        <WarRoomHeader
          status={store.auctionStatus}
          isConnected={store.isConnected}
          totalPot={store.totalAuctionPot}
        />

        {/* Current Player Card */}
        {store.currentPlayer && (
          <PlayerFormCard player={store.currentPlayer} />
        )}

        {/* Bid Action Area */}
        <BidActionArea
          currentBid={store.currentHighestBid}
          currentTeam={store.currentHighestTeam}
          timerSeconds={store.timerSeconds}
        />

        {/* Live Bid Feed */}
        <BidFeed bids={store.recentBids} />

        {/* Team Budgets */}
        <TeamBudgets teams={store.teamBudgets} />

        {/* Reaction Bar */}
        <ReactionBar onReact={(emoji) => store.addReaction(emoji)} />
      </div>

      {/* Sidebar */}
      <div className="warroom-sidebar">
        <SoldHistory players={store.soldPlayers} />
        <UpcomingPlayers players={store.upcomingPlayers} />
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function WarRoomHeader({ status, isConnected, totalPot }) {
  return (
    <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '-0.5px' }}>
          🏏 Auction War Room
        </h1>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem' }}>
          <span className={`badge ${status === 'ACTIVE' ? 'badge-green' : 'badge-gold'}`}>
            {status}
          </span>
          <span className={`badge ${isConnected ? 'badge-green' : 'badge-red'}`}>
            {isConnected ? '● LIVE' : '○ CONNECTING...'}
          </span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total Pot</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
          ₹{(totalPot || 0).toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
}

function PlayerFormCard({ player }) {
  if (!player) return null;

  const hypePercent = player.hypeScore || 0;

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ borderColor: 'var(--border-accent)' }}
    >
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {/* Avatar */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--gradient-premium)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', fontWeight: 800, color: 'white',
          fontFamily: 'var(--font-display)',
        }}>
          {player.jerseyNumber || '?'}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>
            {player.playerName}
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '1rem', marginLeft: '0.5rem' }}>
              #{player.jerseyNumber}
            </span>
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <span className="badge badge-blue">{player.playerRole || 'ALL ROUNDER'}</span>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span><strong style={{ color: 'var(--text-primary)' }}>{player.totalRuns || 0}</strong> runs</span>
            <span><strong style={{ color: 'var(--text-primary)' }}>{player.totalWickets || 0}</strong> wickets</span>
            <span><strong style={{ color: 'var(--text-primary)' }}>{player.totalMatches || 0}</strong> matches</span>
            {player.battingAverage && (
              <span>Avg: <strong style={{ color: 'var(--text-primary)' }}>{player.battingAverage.toFixed(1)}</strong></span>
            )}
          </div>
        </div>

        {/* Base Price */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Base Price</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800,
            color: 'var(--accent-primary)',
          }}>
            ₹{(player.basePrice || 0).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Hype Score */}
      <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Hype Score
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {hypePercent > 0 ? `${hypePercent} / 100` : 'Unproven ✨'}
          </span>
        </div>
        <div className="hype-bar">
          <div className="hype-bar-fill" style={{ width: `${hypePercent}%` }} />
        </div>
      </div>
    </motion.div>
  );
}

function BidActionArea({ currentBid, currentTeam, timerSeconds }) {
  const isUrgent = timerSeconds <= 5;

  return (
    <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
      {/* Current Highest Bid */}
      {currentBid > 0 ? (
        <>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Current Highest Bid
          </div>
          <motion.div
            key={currentBid}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            style={{
              fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 900,
              color: 'var(--accent-primary)', margin: '0.5rem 0',
            }}
          >
            ₹{currentBid.toLocaleString('en-IN')}
          </motion.div>
          <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            by <strong style={{ color: 'var(--text-primary)' }}>{currentTeam}</strong>
          </div>
        </>
      ) : (
        <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Waiting for bids...</div>
      )}

      {/* Timer */}
      <div style={{ marginTop: '1.5rem' }}>
        <div className={`timer-display ${isUrgent ? 'timer-urgent' : ''}`}
             style={{ color: isUrgent ? 'var(--accent-danger)' : 'var(--accent-secondary)' }}>
          {timerSeconds}s
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{
            width: '100%', height: 6, background: 'var(--bg-secondary)',
            borderRadius: 100, overflow: 'hidden',
          }}>
            <motion.div
              style={{
                height: '100%', borderRadius: 100,
                background: isUrgent ? 'var(--gradient-fire)' : 'var(--gradient-emerald)',
              }}
              animate={{ width: `${(timerSeconds / 15) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BidFeed({ bids }) {
  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Live Bid Feed
      </h3>
      <div className="bid-feed">
        <AnimatePresence>
          {bids.map((bid, i) => (
            <motion.div
              key={`${bid.bidTime}-${bid.amount}-${i}`}
              className={`bid-entry ${i === 0 ? 'highest' : ''}`}
              initial={{ opacity: 0, x: -30, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                {i === 0 && <span style={{ color: 'var(--accent-secondary)', marginRight: '0.5rem' }}>▲</span>}
                <span className="bid-team">{bid.teamName}</span>
              </div>
              <span className="bid-amount">₹{(bid.amount || 0).toLocaleString('en-IN')}</span>
              <span className="bid-time">{bid.bidTime}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {bids.length === 0 && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
            No bids yet — waiting for the action to begin...
          </div>
        )}
      </div>
    </div>
  );
}

function TeamBudgets({ teams }) {
  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Team Budgets
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {teams.map((team) => (
          <div key={team.teamId} className="team-budget-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>{team.teamIcon || '🏏'}</span>
              <span style={{ fontWeight: 600 }}>{team.teamName}</span>
            </div>
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {team.playersBought} bought
              </span>
              <span className="budget">₹{(team.budgetRemaining || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SoldHistory({ players }) {
  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        🔨 Sold Players
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
        {players.map((p, i) => (
          <motion.div
            key={`sold-${i}`}
            className="team-budget-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span style={{ fontWeight: 600 }}>{p.playerName}</span>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>→ {p.teamName}</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-primary)', marginLeft: '0.5rem' }}>
                ₹{(p.soldPrice || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </motion.div>
        ))}
        {players.length === 0 && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem', fontSize: '0.85rem' }}>
            No players sold yet
          </div>
        )}
      </div>
    </div>
  );
}

function UpcomingPlayers({ players }) {
  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Coming Up Next
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {players.map((p, i) => (
          <div key={`next-${i}`} className="team-budget-row">
            <div>
              <span style={{ fontWeight: 600 }}>{p.playerName}</span>
              <span className="badge badge-blue" style={{ marginLeft: '0.5rem' }}>{p.playerRole}</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>
              Hype {p.hypeScore || '?'}
            </span>
          </div>
        ))}
        {players.length === 0 && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem', fontSize: '0.85rem' }}>
            Queue empty
          </div>
        )}
      </div>
    </div>
  );
}

function ReactionBar({ onReact }) {
  const emojis = ['🔥', '😮', '👏', '💪', '😂', '🏏'];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', padding: '0.5rem' }}>
      {emojis.map((emoji) => (
        <button key={emoji} className="reaction-btn" onClick={() => onReact(emoji)}>
          {emoji}
        </button>
      ))}
    </div>
  );
}

function SoldOverlay({ data, onClose }) {
  return (
    <motion.div
      className="sold-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="sold-card"
        initial={{ scale: 0.3, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0.3, opacity: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
      >
        <div className="sold-text">SOLD!</div>
        <div style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginTop: '1rem' }}>
          {data.playerName}
        </div>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          goes to <strong style={{ color: 'var(--accent-secondary)' }}>{data.teamName}</strong>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900,
          color: 'var(--accent-primary)', marginTop: '1rem',
        }}>
          ₹{(data.soldPrice || 0).toLocaleString('en-IN')}
        </div>
      </motion.div>
    </motion.div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏏</div>
        <h2 style={{ fontFamily: 'var(--font-display)' }}>Loading War Room...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Connecting to live auction</p>
      </div>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📡</div>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>War Room Unavailable</h2>
        <p style={{ color: 'var(--text-muted)' }}>{message}</p>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
          Share this link and come back when the auction starts!
        </p>
      </div>
    </div>
  );
}
