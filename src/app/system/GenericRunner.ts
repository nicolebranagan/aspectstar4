import Master from '../interfaces/Master';
import Runner from '../interfaces/Runner';
import Controls from '../interfaces/Controls';

export default abstract class GenericRunner implements Runner {
    public drawables : PIXI.Container;
    protected master : Master;

    constructor(master : Master) {
        this.drawables = new PIXI.Container();
        this.master = master;
    }
    
    respond(controls : Controls) : void {;}
    update() : void {;};
}