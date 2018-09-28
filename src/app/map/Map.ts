import Runner from "../interfaces/Runner";
import Controls from "../interfaces/Controls";
import Master from "../interfaces/Master";
import MapDrawer, { frameCycle, flattenMap } from "./MapDrawer";
import MapSprite from "./MapSprite";
import Point from "../system/Point";
import Updatable from "../interfaces/Updatable";

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
    private mapSprite : Updatable;

    constructor(master : Master) {
        this.master = master;
        this.flatMap = flattenMap(TestMap);

        this.drawables = new PIXI.Container();
        
        this.refreshMapSprite(0, 0);
    }

    update() {
        this.mapSprite.update();

        this.drawables.removeChild(this.graphics);
        this.graphics = MapDrawer(this.flatMap, this.frame);
        this.drawables.addChildAt(this.graphics, 0);

        this.frame++;
        this.frame = this.frame % frameCycle;
    }

    respond(controls : Controls) {

    }

    private refreshMapSprite(row : number, level : number) {
        if (this.mapSprite) {
            this.drawables.removeChild(this.mapSprite.drawables);
        }
        const position = this.flatMap[row * 3 + level];
        this.mapSprite = new MapSprite(
            new Point(position.x, position.y),
            row % 0 === 0
        );
        this.drawables.addChild(this.mapSprite.drawables);
    }
}