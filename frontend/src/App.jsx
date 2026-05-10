import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TournamentPublic from './pages/TournamentPublic';
import AuctionWarRoom from './pages/AuctionWarRoom';
import StrategyRoom from './pages/StrategyRoom';

function App() {
  const location = useLocation();
  // Don't show navbar in war room or strategy room, they have their own custom top bars
  const hideNavbar = location.pathname.includes('/auction/live') || location.pathname.includes('/strategy-room');

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {!hideNavbar && <Navbar />}
      <main className={`flex-grow ${!hideNavbar ? 'pt-24' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/tournaments" element={<div className="p-8 text-center text-navy font-bold text-2xl">All Tournaments (Coming Soon)</div>} />
          <Route path="/tournaments/:id" element={<TournamentPublic />} />
          
          <Route path="/auction/live/:id" element={<AuctionWarRoom />} />
          <Route path="/strategy-room/:id" element={<StrategyRoom />} />
          
          {/* Catch all */}
          <Route path="*" element={<div className="p-20 text-center text-2xl font-bold text-navy">Page not found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
