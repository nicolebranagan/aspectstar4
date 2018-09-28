import { 
    getMapState,
    setWinState, 
    resetState
} from './StateManager';
import Master from '../interfaces/Master';

export const newGame = (master : Master) => {
    resetState();
    enterWorldMap(master);
};

export const enterWorldMap = (master : Master) => {
    import(/* webpackChunkName: "map" */ '../map/Map').then(
        Map => {
            // @ts-ignore This is valid, and TypeScript should be able to tell that
            master.addRunner(new Map.default(master, ...getMapState()));
        }
    );
};

export const winLevel = (master : Master) => {
    setWinState();
    enterWorldMap(master);
};
