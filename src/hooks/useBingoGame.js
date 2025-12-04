import { useState, useCallback } from 'react';
import { spinRoulette } from '../utils/gameLogic';

export const useBingoGame = () => {
    const [history, setHistory] = useState([]);
    const [currentDraw, setCurrentDraw] = useState(null);
    const [mode, setMode] = useState('BINGO'); // 'BINGO', 'INTRO', 'TEACHER', 'SUCCESS'
    const [reachNumbers, setReachNumbers] = useState([]);
    const [isSpinning, setIsSpinning] = useState(false);

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
        setHistory([]);
        setCurrentDraw(null);
        setMode('BINGO');
        setReachNumbers([]);
        setIsSpinning(false);
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
