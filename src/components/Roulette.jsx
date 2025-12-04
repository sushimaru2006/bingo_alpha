import { useEffect, useState } from 'react';
import { Music, User, Sparkles } from 'lucide-react';

const Roulette = ({ currentDraw, isSpinning }) => {
    const [displayValue, setDisplayValue] = useState("GO");
    const [animateClass, setAnimateClass] = useState("");

    useEffect(() => {
        let interval;
        if (isSpinning) {
            setAnimateClass("animate-spin-fast"); // Custom or tailwind utility
            interval = setInterval(() => {
                const r = Math.random();
                if (r < 0.7) {
                    setDisplayValue(Math.floor(Math.random() * 75) + 1);
                } else if (r < 0.9) {
                    setDisplayValue(<Music size={140} className="text-green-400" />);
                } else {
                    setDisplayValue(<User size={140} className="text-blue-400" />);
                }
            }, 60);
        } else {
            setAnimateClass("");
            if (currentDraw) {
                if (currentDraw.type === 'NUMBER') {
                    setDisplayValue(currentDraw.value);
                } else if (currentDraw.type === 'MUSIC') {
                    setDisplayValue(<Music size={180} className="text-green-500 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]" />);
                } else {
                    setDisplayValue(<User size={180} className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />);
                }
            }
        }
        return () => clearInterval(interval);
    }, [isSpinning, currentDraw]);

    return (
        <div className="relative flex justify-center items-center">
            {/* Outer Glow Ring */}
            <div className={`absolute inset-0 rounded-full border-4 border-yellow-500/30 blur-xl ${isSpinning ? 'animate-pulse' : ''}`}></div>

            {/* Main Roulette Circle */}
            <div className="relative flex justify-center items-center h-80 w-80 md:h-96 md:w-96 bg-gradient-to-br from-gray-900 to-black rounded-full border-[12px] border-yellow-500 shadow-[0_0_60px_rgba(234,179,8,0.4)] overflow-hidden">

                {/* Inner decoration */}
                <div className="absolute inset-0 border-4 border-yellow-200/20 rounded-full m-2"></div>

                {/* Display Value */}
                <div className={`text-8xl md:text-9xl font-black text-yellow-400 drop-shadow-[0_4px_8px_rgba(0,0,0,1)] font-display transition-all duration-100 ${isSpinning ? 'scale-110 blur-[1px]' : 'scale-100'}`}>
                    {displayValue}
                </div>

                {/* Shine effect */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-full pointer-events-none"></div>
            </div>

            {/* Decorative Elements */}
            {!isSpinning && currentDraw && (
                <div className="absolute -top-4 -right-4 animate-bounce">
                    <Sparkles className="text-yellow-300 w-12 h-12 drop-shadow-lg" />
                </div>
            )}
        </div>
    );
};

export default Roulette;
