const initialState = {
    maxLevel: 0,
    maxRow: 0,
};

let state = {...initialState};

// Getters
export const getMapState : () => [number, number] = () => [
    state.maxLevel,
    state.maxRow
];

// Setters (and a resetter)
export const resetState = () => {
    state = {...initialState};
};

export const setWinState = () => {
    state.maxLevel++;
    if (state.maxLevel >= 3) {
        state.maxRow++;
        state.maxLevel = 0;
    }
};
