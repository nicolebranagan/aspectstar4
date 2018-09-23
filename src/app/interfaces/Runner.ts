import Controls from './Controls';
import Drawable from './Drawable';

/* A Runner is an interface which wraps a PIXI.Container.
 * and represents an abstract concept of something that is loaded to the
 * screen along with its state.
 * 
 * A properly-written runner's actions are divided between respond() and update()
 * methods. Respond performs solely that which is necessary to respond to player
 * input; update handles all other behavior needed by the runner and is called once
 * per frame.
 * 
 * A Runner is the only object that can be a top-level container (i.e., child of LocalMaster)
 * */
export default interface Runner extends Drawable {
    respond(controls : Controls) : void;
    update() : void;
}
