import Drawable from './Drawable';

export default interface Background extends Drawable {
    updatePos(x : number, y : number, offset : number) : void,
};
