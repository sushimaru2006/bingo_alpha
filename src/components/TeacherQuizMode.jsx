import { ArrowLeft, Check, User, GraduationCap, Play, Square, Settings, Trash2, Plus, RotateCcw, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// Configuration: Add detailed teacher data here
// You can add images by adding an 'image' property with a URL
// Default data for reset
const DEFAULT_TEACHERS = [
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

    // Teacher List State with Persistence
    const [teachers, setTeachers] = useState(() => {
        try {
            const saved = localStorage.getItem('bingo_teachers');
            return saved ? JSON.parse(saved) : DEFAULT_TEACHERS;
        } catch (e) {
            return DEFAULT_TEACHERS;
        }
    });

    const [selectedTeacherIds, setSelectedTeacherIds] = useState(() => {
        try {
            const saved = localStorage.getItem('bingo_selected_teachers');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [currentTeacher, setCurrentTeacher] = useState(teachers[0] || DEFAULT_TEACHERS[0]);
    const spinIntervalRef = useRef(null);

    // Settings Modal State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [newTeacherName, setNewTeacherName] = useState('');
    const [newTeacherTitle, setNewTeacherTitle] = useState('');

    // Sync to localStorage
    useEffect(() => {
        localStorage.setItem('bingo_teachers', JSON.stringify(teachers));
    }, [teachers]);

    useEffect(() => {
        localStorage.setItem('bingo_selected_teachers', JSON.stringify(selectedTeacherIds));
    }, [selectedTeacherIds]);

    const addTeacher = () => {
        if (!newTeacherName || !newTeacherTitle) return;
        const newTeacher = {
            id: Date.now(),
            name: newTeacherName,
            title: newTeacherTitle,
            color: ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-orange-500", "bg-cyan-500"][Math.floor(Math.random() * 7)]
        };
        setTeachers([...teachers, newTeacher]);
        setNewTeacherName('');
        setNewTeacherTitle('');
    };

    const removeTeacher = (id) => {
        if (teachers.length <= 1) {
            alert("At least one teacher is required!");
            return;
        }
        setTeachers(teachers.filter(t => t.id !== id));
    };

    const resetTeachers = () => {
        if (confirm("Reset teacher list and history?")) {
            setTeachers(DEFAULT_TEACHERS);
            setSelectedTeacherIds([]);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => stopSpin();
    }, []);

    const startSpin = () => {
        if (gameState === 'SPINNING') return;

        // Filter available teachers
        const available = teachers.filter(t => !selectedTeacherIds.includes(t.id));
        if (available.length === 0) {
            alert("All teachers have been selected! Please reset history in settings.");
            return;
        }

        setGameState('SPINNING');
        let index = 0;

        // Fast cycling with ALL teachers for visual effect
        spinIntervalRef.current = setInterval(() => {
            index = (index + 1) % teachers.length;
            setCurrentTeacher(teachers[index]);
        }, 50);
    };

    const stopSpin = () => {
        if (gameState !== 'SPINNING') return;

        clearInterval(spinIntervalRef.current);

        // Pick a random winner from AVAILABLE teachers
        const available = teachers.filter(t => !selectedTeacherIds.includes(t.id));

        if (available.length === 0) {
            // Should verify startSpin prevented this, but just in case
            setGameState('IDLE');
            return;
        }

        const winnerIndex = Math.floor(Math.random() * available.length);
        const winner = available[winnerIndex];

        setCurrentTeacher(winner);
        setSelectedTeacherIds(prev => [...prev, winner.id]);
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
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#0a0a0a] text-white relative overflow-y-auto font-sans">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(76,29,149,0.2),_rgba(0,0,0,0))] animate-pulse duration-[5000ms]"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/40 rounded-full blur-3xl animate-float-1 mix-blend-screen"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/40 rounded-full blur-3xl animate-float-2 mix-blend-screen"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20"></div>

            <div className="z-10 flex flex-col items-center gap-8 w-full max-w-4xl pt-24 md:pt-0">

                {/* Header */}
                <h1 className="text-4xl md:text-6xl font-display drop-shadow-lg text-center tracking-wider mb-4 relative z-20" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.2)' }}>
                    TEACHER ROULETTE
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="absolute -right-16 top-1/2 -translate-y-1/2 p-2 text-white/30 hover:text-white transition-colors"
                    >
                        <Settings size={28} />
                    </button>
                </h1>

                {/* Main Content Area */}
                <div className="flex flex-col md:flex-row landscape:flex-row gap-8 items-center justify-center w-full px-4">

                    {/* Left: Teacher Roulette */}
                    <div className={`relative transition-all duration-500 w-full md:w-auto landscape:w-auto flex flex-col items-center ${gameState === 'SELECTED' ? 'scale-100' : 'scale-90 opacity-90'}`}>

                        {/* Teacher Card */}
                        <div className={`
                            w-full max-w-xs md:w-80 h-96 bg-black/30 backdrop-blur-md border-8 
                            ${gameState === 'SELECTED' ? 'border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)]' : 'border-white/20'} 
                            rounded-3xl flex flex-col items-center justify-center gap-6 p-6 transition-all duration-300
                        `}>
                            <div className="text-center flex flex-col items-center justify-center h-full">
                                <p className="text-sm font-bold opacity-70 tracking-widest uppercase mb-4">TARGET TEACHER</p>
                                <h2 className={`text-5xl md:text-6xl font-black font-display tracking-tight leading-tight break-words w-full px-2 drop-shadow-lg ${currentTeacher.color.replace('bg-', 'text-')}`}>
                                    {currentTeacher.name}
                                </h2>
                                <p className="text-2xl mt-4 font-bold opacity-90">{currentTeacher.title}</p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="md:absolute md:-bottom-24 md:left-1/2 md:-translate-x-1/2 mt-8 flex gap-4 w-full justify-center">
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
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    min="1"
                                    max="75"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    placeholder="#"
                                    className="w-40 h-40 text-8xl font-black text-center text-black bg-white rounded-3xl border-8 border-white/50 focus:outline-none focus:border-yellow-400 shadow-2xl font-display"
                                />
                                <button type="submit" className="w-full py-4 bg-yellow-500 text-black text-2xl font-black rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 shadow-xl transform hover:scale-105 active:scale-95">
                                    <Check size={32} /> CONFIRM
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Settings Modal */}
                {isSettingsOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-gray-900 w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[80vh]">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Settings className="text-yellow-400" /> Manage Teachers
                                </h2>
                                <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {/* Add New */}
                                <div className="flex gap-4 items-end bg-white/5 p-4 rounded-xl">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-xs text-gray-400 font-bold uppercase">Name</label>
                                        <input
                                            value={newTeacherName}
                                            onChange={(e) => setNewTeacherName(e.target.value)}
                                            placeholder="Teacher Name"
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-400"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label className="text-xs text-gray-400 font-bold uppercase">Title / Subject</label>
                                        <input
                                            value={newTeacherTitle}
                                            onChange={(e) => setNewTeacherTitle(e.target.value)}
                                            placeholder="Subject"
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-400"
                                        />
                                    </div>
                                    <button
                                        onClick={addTeacher}
                                        disabled={!newTeacherName || !newTeacherTitle}
                                        className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl font-bold transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                {/* List */}
                                <div className="space-y-2">
                                    {teachers.map(teacher => {
                                        const isSelected = selectedTeacherIds.includes(teacher.id);
                                        return (
                                            <div key={teacher.id} className={`flex items-center justify-between bg-white/5 p-4 rounded-xl transition-colors group ${isSelected ? 'opacity-50' : 'hover:bg-white/10'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-3 h-12 rounded-full ${teacher.color}`}></div>
                                                    <div>
                                                        <h4 className="font-bold text-lg flex items-center gap-2">
                                                            {teacher.name}
                                                            {isSelected && <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full">DONE</span>}
                                                        </h4>
                                                        <p className="text-sm text-gray-400">{teacher.title}</p>
                                                    </div>
                                                </div>
                                                {!isSelected && (
                                                    <button
                                                        onClick={() => removeTeacher(teacher.id)}
                                                        className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 flex justify-between bg-black/20 rounded-b-3xl">
                                <button onClick={resetTeachers} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2">
                                    <RotateCcw size={16} /> Reset List & History
                                </button>
                                <div className="text-sm text-gray-500">
                                    {selectedTeacherIds.length} / {teachers.length} Selected
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 px-8 py-4 bg-black/20 hover:bg-black/40 rounded-lg text-xl font-bold transition-all backdrop-blur-md z-50 border border-white/20">
                <ArrowLeft size={24} /> Back
            </button>
        </div>
    );
};

export default TeacherQuizMode;
