import Runner from './Runner';

export default interface Background extends Runner {
    updatePos(x : number, y : number) : void,
};
