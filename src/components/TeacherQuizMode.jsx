import { ArrowLeft, Check, User, GraduationCap } from 'lucide-react';
import { useState } from 'react';

const TeacherQuizMode = ({ onBack, onRegister }) => {
    const [number, setNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (number) {
            onRegister(number);
            setNumber('');
            onBack();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-[#2E7D32] text-white relative overflow-hidden font-sans">
            {/* Blackboard texture effect */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20"></div>

            {/* Chalk dust effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

            <div className="z-10 flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                <div className="relative">
                    <div className="absolute -top-6 -right-6 text-yellow-400 animate-bounce">
                        <GraduationCap size={60} />
                    </div>
                    <div className="p-10 bg-white/10 rounded-full backdrop-blur-sm border-4 border-white/30">
                        <User size={100} />
                    </div>
                </div>

                <h1 className="text-6xl md:text-8xl font-display drop-shadow-lg text-center tracking-wider" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.2)' }}>
                    TEACHER QUIZ
                </h1>

                <div className="bg-black/30 p-8 rounded-xl backdrop-blur-md border border-white/10 max-w-3xl">
                    <p className="text-2xl md:text-4xl font-bold text-center font-handwriting leading-relaxed">
                        "Answer the teacher's question correctly to open a number!"
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mt-8">
                    <input
                        type="number"
                        min="1"
                        max="75"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="#"
                        className="w-40 h-24 text-6xl font-black text-center text-[#2E7D32] bg-white rounded-lg border-b-8 border-gray-300 focus:outline-none focus:border-yellow-400 shadow-2xl font-display"
                        autoFocus
                    />
                    <button type="submit" className="px-10 h-24 bg-yellow-500 text-black text-3xl font-black rounded-lg border-b-8 border-yellow-700 hover:bg-yellow-400 hover:border-yellow-600 transition-all flex items-center justify-center gap-3 shadow-2xl transform hover:-translate-y-1 active:translate-y-0">
                        <Check size={40} /> ANSWER
                    </button>
                </form>
            </div>

            <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 px-8 py-4 bg-black/20 hover:bg-black/40 rounded-lg text-xl font-bold transition-all backdrop-blur-md z-50 border border-white/20">
                <ArrowLeft size={24} /> Back
            </button>
        </div>
    );
};
export default TeacherQuizMode;
