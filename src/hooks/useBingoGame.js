import { useState, useCallback, useEffect } from 'react';
import { spinRoulette } from '../utils/gameLogic';

export const useBingoGame = () => {
    const [history, setHistory] = useState(() => {
        try {
            const saved = localStorage.getItem("bingo_history");
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [currentDraw, setCurrentDraw] = useState(null);
    const [mode, setMode] = useState('BINGO'); // 'BINGO', 'INTRO', 'TEACHER', 'SUCCESS'

    const [reachNumbers, setReachNumbers] = useState(() => {
        try {
            const saved = localStorage.getItem("bingo_reach_numbers");
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [isSpinning, setIsSpinning] = useState(false);

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem("bingo_history", JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem("bingo_reach_numbers", JSON.stringify(reachNumbers));
    }, [reachNumbers]);

    const spin = useCallback(() => {
        setIsSpinning(true);
        setCurrentDraw(null);

        // Simulate spin delay
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = spinRoulette(history);
                setCurrentDraw(result);
                if (result.type === 'NUMBER') {
                    setHistory(prev => [result.value, ...prev]);
                }
                setIsSpinning(false);
                resolve(result);
            }, 3000); // 3 seconds spin animation
        });
    }, [history]);

    const addReachNumber = useCallback((num) => {
        const n = parseInt(num, 10);
        if (!isNaN(n) && n >= 1 && n <= 75 && !reachNumbers.includes(n)) {
            setReachNumbers(prev => [...prev, n].sort((a, b) => a - b));
        }
    }, [reachNumbers]);

    const addHistoryNumber = useCallback((num) => {
        const n = parseInt(num, 10);
        if (!isNaN(n) && n >= 1 && n <= 75 && !history.includes(n)) {
            setHistory(prev => [n, ...prev]);
        }
    }, [history]);

    const resetGame = useCallback(() => {
        if (confirm("Are you sure you want to reset the entire game? history will be lost.")) {
            setHistory([]);
            setCurrentDraw(null);
            setMode('BINGO');
            setReachNumbers([]);
            setIsSpinning(false);

            // Clear storage
            localStorage.removeItem("bingo_history");
            localStorage.removeItem("bingo_reach_numbers");
        }
    }, []);

    return {
        history,
        currentDraw,
        mode,
        setMode,
        reachNumbers,
        addReachNumber,
        addHistoryNumber,
        spin,
        isSpinning,
        resetGame
    };
};
