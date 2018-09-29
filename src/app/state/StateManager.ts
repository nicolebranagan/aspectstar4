const initialState : {
    maxLevel : number,
    maxRow: number,
    levelMarkers: [boolean, boolean, boolean][][],
} = {
    maxLevel: 0,
    maxRow: 0,
    levelMarkers: [
        [[false, false, false], [false, false, false], [false, false, false]], 
        [[false, false, false], [false, false, false], [false, false, false]], 
        [[false, false, false], [false, false, false], [false, false, false]], 
    ],
};

let state : {
    maxLevel : number,
    maxRow: number,
    levelMarkers: [boolean, boolean, boolean][][],
};

// Getters
export const getMapState : () => [number, number, [boolean, boolean, boolean][][]] = () => [
    state.maxLevel,
    state.maxRow,
    state.levelMarkers,
];

// Setters (and a resetter)
export const resetState = () => {
    // This isn't very performant in the maximum case, but that shouldn't matter?
    state = JSON.parse(JSON.stringify(initialState));
};

export const setLevelMarkers = (
    level : number, 
    row : number, 
    markers : [boolean, boolean, boolean]
) => {
    if (state.levelMarkers[row][level]) {
        const oldMarkers = state.levelMarkers[row][level];
        markers = [oldMarkers[0] || markers[0], oldMarkers[1] || markers[1], oldMarkers[2] || markers[2]];
    }
    state.levelMarkers[row][level] = markers;
};

export const setWinState = (level : number, row : number) => {
    if (level === state.maxLevel && row === state.maxRow) {
        state.maxLevel++;
        if (state.maxLevel >= 3) {
            state.maxRow++;
            state.maxLevel = 0;
        }
    }
};
