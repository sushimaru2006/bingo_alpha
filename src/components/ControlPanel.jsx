import { Play, Music, User, Trophy, Plus } from 'lucide-react';

const ControlPanel = ({ onSpin, onModeChange, onAddReach, isSpinning }) => {
    return (
        <div className="flex flex-wrap justify-center items-center gap-4 p-6 bg-black/80 backdrop-blur-xl rounded-t-3xl border-t border-white/10 w-full fixed bottom-0 left-0 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <button
                onClick={onSpin}
                disabled={isSpinning}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-black text-2xl rounded-full shadow-[0_0_30px_rgba(234,179,8,0.6)] transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                <Play fill="currentColor" size={28} /> SPIN
            </button>

            <div className="w-px h-12 bg-white/20 mx-4 hidden md:block"></div>

            <div className="flex gap-3">
                <button onClick={() => onModeChange('INTRO')} className="flex items-center gap-2 px-5 py-3 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-600/50 font-bold rounded-xl transition-all backdrop-blur-sm">
                    <Music size={20} /> <span className="hidden md:inline">Intro Quiz</span>
                </button>

                <button onClick={() => onModeChange('TEACHER')} className="flex items-center gap-2 px-5 py-3 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/50 font-bold rounded-xl transition-all backdrop-blur-sm">
                    <User size={20} /> <span className="hidden md:inline">Teacher</span>
                </button>

                <button onClick={onAddReach} className="hidden md:flex items-center gap-2 px-5 py-3 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/50 font-bold rounded-xl transition-all backdrop-blur-sm">
                    <Plus size={20} /> <span className="hidden md:inline">Add Reach</span>
                </button>

                <button onClick={() => onModeChange('SUCCESS')} className="flex items-center gap-2 px-5 py-3 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-600/50 font-bold rounded-xl transition-all backdrop-blur-sm">
                    <Trophy size={20} /> <span className="hidden md:inline">Bingo!</span>
                </button>
            </div>
        </div>
    );
};

export default ControlPanel;
