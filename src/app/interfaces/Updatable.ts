import Drawable from './Drawable';

/* An Updatable is a drawable that requires the update call to be
   made in time with the game clock. */

export default interface Updatable extends Drawable {
    update() : void;
}
