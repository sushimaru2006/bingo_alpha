import { ArrowLeft, Check, User, GraduationCap, Play, Square } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// Configuration: Add detailed teacher data here
// You can add images by adding an 'image' property with a URL
const TEACHERS = [
    { id: 1, name: "Principal", color: "bg-red-500", title: "校長先生" },
    { id: 2, name: "Vice Principal", color: "bg-blue-500", title: "副校長先生" },
    { id: 3, name: "Grade Chief", color: "bg-green-500", title: "学年主任" },
    { id: 4, name: "Math Teacher", color: "bg-yellow-500", title: "数学科" },
    { id: 5, name: "English Teacher", color: "bg-purple-500", title: "英語科" },
    { id: 6, name: "PE Teacher", color: "bg-orange-500", title: "体育科" },
    { id: 7, name: "Science Teacher", color: "bg-cyan-500", title: "理科" },
];

const TeacherQuizMode = ({ onBack, onRegister }) => {
    const [number, setNumber] = useState('');
    const [gameState, setGameState] = useState('IDLE'); // IDLE, SPINNING, SELECTED
    const [currentTeacher, setCurrentTeacher] = useState(TEACHERS[0]);
    const spinIntervalRef = useRef(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => stopSpin();
    }, []);

    const startSpin = () => {
        if (gameState === 'SPINNING') return;

        setGameState('SPINNING');
        let index = 0;

        // Fast cycling
        spinIntervalRef.current = setInterval(() => {
            index = (index + 1) % TEACHERS.length;
            setCurrentTeacher(TEACHERS[index]);
        }, 50); // Speed of shuffle
    };

    const stopSpin = () => {
        if (gameState !== 'SPINNING') return;

        clearInterval(spinIntervalRef.current);

        // Pick a random winner securely
        const winnerIndex = Math.floor(Math.random() * TEACHERS.length);
        const winner = TEACHERS[winnerIndex];

        setCurrentTeacher(winner);
        setGameState('SELECTED');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (number) {
            onRegister(number);
            setNumber('');
            onBack();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-[#0a0a0a] text-white relative overflow-hidden font-sans">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(76,29,149,0.2),_rgba(0,0,0,0))] animate-pulse duration-[5000ms]"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/40 rounded-full blur-3xl animate-float-1 mix-blend-screen"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/40 rounded-full blur-3xl animate-float-2 mix-blend-screen"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20"></div>

            <div className="z-10 flex flex-col items-center gap-8 w-full max-w-4xl">

                {/* Header */}
                <h1 className="text-4xl md:text-6xl font-display drop-shadow-lg text-center tracking-wider mb-4" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.2)' }}>
                    TEACHER ROULETTE
                </h1>

                {/* Main Content Area */}
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">

                    {/* Left: Teacher Roulette */}
                    <div className={`relative transition-all duration-500 ${gameState === 'SELECTED' ? 'scale-100' : 'scale-90 opacity-90'}`}>

                        {/* Teacher Card */}
                        <div className={`
                            w-80 h-96 bg-black/30 backdrop-blur-md border-8 
                            ${gameState === 'SELECTED' ? 'border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)]' : 'border-white/20'} 
                            rounded-3xl flex flex-col items-center justify-center gap-6 p-6 transition-all duration-300
                        `}>
                            <div className={`
                                p-8 rounded-full shadow-xl transition-colors duration-100
                                ${currentTeacher.color}
                            `}>
                                <User size={80} className="text-white" />
                            </div>

                            <div className="text-center">
                                <p className="text-sm font-bold opacity-70 tracking-widest uppercase mb-2">TARGET TEACHER</p>
                                <h2 className="text-4xl font-black font-display tracking-wide leading-tight">
                                    {currentTeacher.name}
                                </h2>
                                <p className="text-xl mt-2 font-bold opacity-90">{currentTeacher.title}</p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex gap-4 w-full justify-center">
                            {gameState === 'IDLE' && (
                                <button
                                    onClick={startSpin}
                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-full text-xl shadow-xl transition-transform hover:scale-105 flex items-center gap-2"
                                >
                                    <Play fill="currentColor" /> START
                                </button>
                            )}
                            {gameState === 'SPINNING' && (
                                <button
                                    onClick={stopSpin}
                                    className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-full text-xl shadow-xl transition-transform hover:scale-105 flex items-center gap-2 animate-pulse"
                                >
                                    <Square fill="currentColor" /> STOP
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: Number Selection (Only shown when selected) */}
                    {gameState === 'SELECTED' && (
                        <div className="animate-in fade-in slide-in-from-right-10 duration-700 bg-black/30 p-8 rounded-3xl backdrop-blur-md border border-white/10 flex flex-col items-center gap-6">
                            <h3 className="text-2xl font-bold text-center">
                                <span className="text-yellow-400">{currentTeacher.name}</span>'s Choice
                            </h3>

                            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                                <input
                                    type="number"
                                    min="1"
                                    max="75"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    placeholder="#"
                                    className="w-40 h-40 text-8xl font-black text-center text-black bg-white rounded-3xl border-8 border-white/50 focus:outline-none focus:border-yellow-400 shadow-2xl font-display"
                                    autoFocus
                                />
                                <button type="submit" className="w-full py-4 bg-yellow-500 text-black text-2xl font-black rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 shadow-xl transform hover:scale-105 active:scale-95">
                                    <Check size={32} /> CONFIRM
                                </button>
                            </form>
                        </div>
                    )}
                </div>

            </div>

            <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 px-8 py-4 bg-black/20 hover:bg-black/40 rounded-lg text-xl font-bold transition-all backdrop-blur-md z-50 border border-white/20">
                <ArrowLeft size={24} /> Back
            </button>
        </div>
    );
};

export default TeacherQuizMode;
