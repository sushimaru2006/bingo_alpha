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

  return (
    <div ref={appRef} className="min-h-screen bg-[#111] font-sans text-white selection:bg-yellow-500 selection:text-black relative">
      {/* Global Full Screen Toggle */}
      <button
        onClick={toggleFullScreen}
        className="fixed top-4 right-4 z-[100] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/50 hover:text-white transition-all backdrop-blur-md"
        title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
      >
        {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
      </button>
      <Routes>
        <Route path="/" element={
          <div className="flex min-h-screen flex-col md:flex-row relative">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black pointer-events-none fixed"></div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-4 pb-40">
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

            {/* Sidebar (History) */}
            <div className="hidden md:block w-80 lg:w-96 h-full p-6 z-20 animate-in fade-in slide-in-from-right-10 duration-1000">
              <HistoryPanel history={game.history} reachNumbers={game.reachNumbers} />
            </div>

            <ControlPanel
              onSpin={game.spin}
              onModeChange={handleModeChange}
              onAddReach={() => {
                const num = prompt("Enter reach number:");
                if (num) game.addReachNumber(num);
              }}
              isSpinning={game.isSpinning}
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
