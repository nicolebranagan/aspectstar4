import * as localForage from "localforage";
import { 
    getMapState,
    setWinState, 
    resetState,
    setLevelMarkers,
    getStateString,
    setStateFromString
} from './StateManager';
import Master from '../interfaces/Master';

const saveKey = (slot : number) => `ASPECT_STAR_4_SLOT_${slot.toString()}`;

export const saveState : (slot : number) => Promise<void> = async (slot : number) => {
    await localForage.setItem(saveKey(slot), JSON.stringify(
        getStateString()
    ));
    return;
};

export const loadState : (slot : number) => Promise<boolean> = async (slot : number) => {
    try {
        const stateString = await localForage.getItem(saveKey(slot));
        setStateFromString(stateString.toString());
        return true;
    } catch(ex) {
        return false;
    }
};

export const newGame = (master : Master) => {
    resetState();
    enterWorldMap(master);
};

export const enterWorldMap = (master : Master) => {
    import(/* webpackChunkName: "map" */ '../map/Map').then(
        Map => {
            // @ts-ignore This is valid, and TypeScript should be able to tell that
            master.addRunner(new Map.default(master, 0, ...getMapState()));
        }
    );
};

export const winLevel = (master : Master, level : number, row : number, params : [boolean, boolean, boolean]) => {
    setWinState(level, row);
    setLevelMarkers(level, row, params);
    enterWorldMap(master);
};
