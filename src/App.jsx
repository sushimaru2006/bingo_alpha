import { useEffect, useState, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Maximize, Minimize } from 'lucide-react';
import { useBingoGame } from './hooks/useBingoGame';
import Roulette from './components/Roulette';
import HistoryPanel from './components/HistoryPanel';
import ControlPanel from './components/ControlPanel';
import IntroQuizMode from './components/IntroQuizMode';
import TeacherQuizMode from './components/TeacherQuizMode';
import BingoSuccess from './components/BingoSuccess';

function App() {
  const game = useBingoGame();
  const navigate = useNavigate();
  const location = useLocation();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const appRef = useRef(null);
  const [showReachModal, setShowReachModal] = useState(false);
  const [showMobileHistory, setShowMobileHistory] = useState(false);
  const [reachInput, setReachInput] = useState('');

  // Sync route with mode (URL is source of truth)
  useEffect(() => {
    if (location.pathname === '/intro') game.setMode('INTRO');
    else if (location.pathname === '/quiz') game.setMode('TEACHER');
    else if (location.pathname === '/success') game.setMode('SUCCESS');
    else game.setMode('BINGO');
  }, [location.pathname, game.setMode]);

  const handleModeChange = (newMode) => {
    if (newMode === 'INTRO') navigate('/intro');
    else if (newMode === 'TEACHER') navigate('/quiz');
    else if (newMode === 'SUCCESS') navigate('/success');
    else navigate('/');
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      appRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const handleAddReach = () => {
    if (reachInput) {
      game.addReachNumber(reachInput);
      setReachInput('');
      setShowReachModal(false);
    }
  };

  return (
    <div ref={appRef} className="min-h-screen bg-[#111] font-sans text-white selection:bg-yellow-500 selection:text-black relative">
      {/* Global Full Screen Toggle */}


      {/* Custom Reach Modal */}
      {showReachModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 p-8 rounded-2xl border border-white/20 shadow-2xl w-96">
            <h3 className="text-2xl font-bold text-white mb-4">Add Reach Number</h3>
            <input
              type="tel"
              min="1"
              max="75"
              value={reachInput}
              onChange={(e) => setReachInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddReach()}
              placeholder="Enter number (1-75)"
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white font-bold text-xl focus:outline-none focus:ring-4 focus:ring-yellow-500 mb-4"
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddReach}
                className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowReachModal(false);
                  setReachInput('');
                }}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={
          <div className="flex min-h-screen flex-col md:flex-row landscape:flex-row relative">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black pointer-events-none fixed"></div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-4 pb-40 landscape:pb-4 landscape:pr-32">
              <header className="w-full text-center animate-in fade-in slide-in-from-top-4 duration-1000 mb-8 mt-8">
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-wider drop-shadow-2xl font-display">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">BINGO</span>
                </h1>
                <p className="text-white/40 text-xs md:text-sm tracking-[0.8em] mt-4 uppercase font-bold">Coming of Age Ceremony 2026</p>
              </header>

              <div className="scale-75 md:scale-100 transition-transform duration-500">
                <Roulette currentDraw={game.currentDraw} isSpinning={game.isSpinning} />
              </div>

              {/* Message Area */}
              <div className="h-16 mt-8 flex items-center justify-center">
                {game.currentDraw?.type === 'MUSIC' && <p className="text-2xl font-bold text-green-400 animate-pulse">🎵 Music Event! Intro Quiz!</p>}
                {game.currentDraw?.type === 'TEACHER' && <p className="text-2xl font-bold text-blue-400 animate-pulse">👨‍🏫 Teacher Event! Quiz Time!</p>}
              </div>
            </div>

            {/* Sidebar (History) - Desktop */}
            <div className="hidden md:block w-80 lg:w-96 h-full p-6 z-20 animate-in fade-in slide-in-from-right-10 duration-1000">
              <HistoryPanel history={game.history} reachNumbers={game.reachNumbers} />
            </div>

            {/* Mobile History Toggle & Drawer */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileHistory(true)}
                className="fixed top-4 right-4 z-40 p-3 bg-blue-600/80 backdrop-blur-md rounded-full text-white shadow-lg border border-white/20"
              >
                <span className="font-bold text-xs">HISTORY</span>
              </button>

              {showMobileHistory && (
                <div className="fixed inset-0 z-50 flex justify-end">
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileHistory(false)} />
                  <div className="relative w-80 h-full bg-gray-900 border-l border-white/10 p-6 shadow-2xl animate-in slide-in-from-right duration-300">
                    <button
                      onClick={() => setShowMobileHistory(false)}
                      className="absolute top-4 right-4 p-2 text-white/50 hover:text-white"
                    >
                      X
                    </button>
                    <HistoryPanel history={game.history} reachNumbers={game.reachNumbers} />
                  </div>
                </div>
              )}
            </div>

            <ControlPanel
              onSpin={game.spin}
              onModeChange={handleModeChange}
              onAddReach={() => setShowReachModal(true)}
              isSpinning={game.isSpinning}
              onReset={game.resetGame}
            />
          </div>
        } />

        <Route path="/intro" element={
          <IntroQuizMode
            onBack={() => navigate('/')}
            onRegister={(num) => game.addHistoryNumber(num)}
          />
        } />

        <Route path="/quiz" element={
          <TeacherQuizMode
            onBack={() => navigate('/')}
            onRegister={(num) => game.addHistoryNumber(num)}
          />
        } />

        <Route path="/success" element={
          <BingoSuccess onBack={() => navigate('/')} />
        } />
      </Routes>
    </div>
  );
}

export default App;
