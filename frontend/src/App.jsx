import { Routes, Route } from 'react-router-dom';
import AuctionWarRoom from './pages/AuctionWarRoom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TournamentPublic from './pages/TournamentPublic';

function App() {
  return (
    <Routes>
      {/* Public — no login needed */}
      <Route path="/auction/live/:tournamentId" element={<AuctionWarRoom />} />
      <Route path="/t/:slug" element={<TournamentPublic />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Default */}
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
