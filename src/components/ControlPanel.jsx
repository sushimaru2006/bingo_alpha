import { Play, Music, User, Trophy, Plus, RotateCcw } from 'lucide-react';

const ControlPanel = ({ onSpin, onModeChange, onAddReach, isSpinning, onReset }) => {
    return (
        <div className="flex flex-wrap landscape:flex-col justify-center items-center gap-4 p-6 landscape:p-4 bg-black/80 backdrop-blur-xl rounded-t-3xl landscape:rounded-t-none landscape:rounded-l-3xl border-t landscape:border-t-0 landscape:border-l border-white/10 w-full landscape:w-auto fixed bottom-0 left-0 landscape:left-auto landscape:right-0 landscape:top-0 landscape:bottom-0 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] h-auto landscape:h-full overflow-y-auto">
            <button
                onClick={onSpin}
                disabled={isSpinning}
                className="flex items-center gap-3 px-10 landscape:px-6 py-5 landscape:py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-black text-2xl landscape:text-xl rounded-full shadow-[0_0_30px_rgba(234,179,8,0.6)] transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none landscape:w-full landscape:justify-center"
            >
                <Play fill="currentColor" size={28} /> <span className="landscape:hidden xl:inline">SPIN</span>
            </button>

            <div className="w-px h-12 landscape:w-12 landscape:h-px bg-white/20 mx-4 hidden md:block landscape:block"></div>

            <div className="flex landscape:flex-col gap-3">
                <button onClick={() => onModeChange('INTRO')} className="flex items-center gap-2 px-5 py-3 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-600/50 font-bold rounded-xl transition-all backdrop-blur-sm landscape:justify-center">
                    <Music size={20} /> <span className="hidden md:inline landscape:hidden xl:inline">Intro Quiz</span>
                </button>

                <button onClick={() => onModeChange('TEACHER')} className="flex items-center gap-2 px-5 py-3 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/50 font-bold rounded-xl transition-all backdrop-blur-sm landscape:justify-center">
                    <User size={20} /> <span className="hidden md:inline landscape:hidden xl:inline">Teacher</span>
                </button>

                <button onClick={onAddReach} className="hidden md:flex items-center gap-2 px-5 py-3 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/50 font-bold rounded-xl transition-all backdrop-blur-sm landscape:justify-center">
                    <Plus size={20} /> <span className="hidden md:inline landscape:hidden xl:inline">Add Reach</span>
                </button>

                <button onClick={() => onModeChange('SUCCESS')} className="flex items-center gap-2 px-5 py-3 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-600/50 font-bold rounded-xl transition-all backdrop-blur-sm landscape:justify-center">
                    <Trophy size={20} /> <span className="hidden md:inline landscape:hidden xl:inline">Bingo!</span>
                </button>

                <button onClick={onReset} className="flex items-center gap-2 px-5 py-3 bg-gray-600/20 hover:bg-red-600/80 text-gray-400 hover:text-white border border-gray-600/50 font-bold rounded-xl transition-all backdrop-blur-sm landscape:justify-center">
                    <RotateCcw size={20} /> <span className="hidden md:inline landscape:hidden xl:inline">Reset</span>
                </button>
            </div>
        </div>
    );
};

export default ControlPanel;
