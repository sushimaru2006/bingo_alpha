import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Gift } from 'lucide-react';

const BingoSuccess = ({ onBack }) => {
    useEffect(() => {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600 text-white relative overflow-y-auto py-12">

            <div className="z-10 flex flex-col items-center gap-8 animate-in zoom-in duration-700 m-auto">
                <h1 className="text-9xl font-black font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-yellow-200 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-pulse">
                    BINGO!!
                </h1>

                <div className="text-4xl md:text-6xl font-bold text-center drop-shadow-md">
                    CONGRATULATIONS!
                </div>

                <div className="p-12 bg-white/20 rounded-3xl backdrop-blur-lg border-4 border-white/50 shadow-2xl mt-8 animate-bounce">
                    <Gift size={120} className="text-white drop-shadow-lg" />
                </div>

                <p className="text-2xl font-bold mt-8 animate-pulse text-center px-4">
                    Please come to the stage to claim your prize!
                </p>
            </div>

            <button onClick={onBack} className="flex items-center gap-2 px-10 py-4 bg-black/30 hover:bg-black/50 rounded-full text-xl font-bold transition-all backdrop-blur-md z-50 border border-white/30 mt-12 shrink-0">
                <ArrowLeft size={24} /> Return to Game
            </button>
        </div>
    );
};
export default BingoSuccess;
