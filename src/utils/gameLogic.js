export const PROBABILITIES = {
    NUMBER: 0.7,
    MUSIC: 0.2,
    TEACHER: 0.1,
};

export const MAX_NUMBER = 75;

export const spinRoulette = (history) => {
    const r = Math.random();

    // If all numbers are drawn, force special events or handle error
    const drawnNumbers = new Set(history);
    if (drawnNumbers.size >= MAX_NUMBER) {
        // Fallback to special events if full
        if (r < 0.66) return { type: 'MUSIC', value: null };
        return { type: 'TEACHER', value: null };
    }

    if (r < PROBABILITIES.NUMBER) {
        let num;
        do {
            num = Math.floor(Math.random() * MAX_NUMBER) + 1;
        } while (drawnNumbers.has(num));
        return { type: 'NUMBER', value: num };
    } else if (r < PROBABILITIES.NUMBER + PROBABILITIES.MUSIC) {
        return { type: 'MUSIC', value: null };
    } else {
        return { type: 'TEACHER', value: null };
    }
};
