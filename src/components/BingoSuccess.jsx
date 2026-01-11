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
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600 text-white relative overflow-y-auto py-12 landscape:py-4">

            <div className="z-10 flex flex-col landscape:flex-row items-center gap-8 landscape:gap-16 animate-in zoom-in duration-700 m-auto w-full max-w-6xl px-4">

                {/* Left (Landscape) / Top (Portrait): Text & Title */}
                <div className="text-center landscape:text-left flex flex-col items-center landscape:items-start">
                    <h1 className="text-6xl md:text-9xl font-black font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-yellow-200 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-pulse">
                        BINGO!!
                    </h1>

                    <div className="text-3xl md:text-6xl font-bold text-center landscape:text-left drop-shadow-md mt-4">
                        CONGRATULATIONS!
                    </div>
                </div>

                {/* Right (Landscape) / Bottom (Portrait): Gift & Action */}
                <div className="flex flex-col items-center gap-8">
                    <div className="p-8 md:p-12 bg-white/20 rounded-3xl backdrop-blur-lg border-4 border-white/50 shadow-2xl mt-4 landscape:mt-0 animate-bounce">
                        <Gift size={80} className="text-white drop-shadow-lg md:w-32 md:h-32" />
                    </div>

                    <p className="text-lg md:text-2xl font-bold animate-pulse text-center px-4 max-w-md">
                        Please come to the stage to claim your prize!
                    </p>
                </div>
            </div>

            <button onClick={onBack} className="flex items-center gap-2 px-10 py-4 bg-black/30 hover:bg-black/50 rounded-full text-xl font-bold transition-all backdrop-blur-md z-50 border border-white/30 mt-12 landscape:mt-8 shrink-0">
                <ArrowLeft size={24} /> Return to Game
            </button>
        </div>
    );
};
export default BingoSuccess;
