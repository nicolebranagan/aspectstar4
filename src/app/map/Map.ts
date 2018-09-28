import Runner from "../interfaces/Runner";
import Controls from "../interfaces/Controls";
import Master from "../interfaces/Master";
import MapDrawer, { frameCycle, flattenMap } from "./MapDrawer";

const TestMap : {levels: number[][], rows: [number, number][]} = {
    levels: [[0, 0, 0]],
    rows: [[50, 50]],
};

export default class Map implements Runner {
    public drawables : PIXI.Container;

    private master : Master;
    private graphics : PIXI.Graphics
    private frame : number = 0;
    private flatMap : {x : number, y : number}[];

    constructor(master : Master) {
        this.master = master;
        this.flatMap = flattenMap(TestMap);

        this.drawables = new PIXI.Container();
    }

    update() {
        this.drawables.removeChild(this.graphics);
        this.graphics = MapDrawer(this.flatMap, this.frame);
        this.drawables.addChild(this.graphics);

        this.frame++;
        this.frame = this.frame % frameCycle;
    }

    respond(controls : Controls) {

    }
}