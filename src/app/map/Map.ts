import Runner from "../interfaces/Runner";
import Controls from "../interfaces/Controls";
import Master from "../interfaces/Master";
import MapDrawer, { frameCycle, flattenMap } from "./MapDrawer";
import MapSprite from "./MapSprite";
import Point from "../system/Point";
import Updatable from "../interfaces/Updatable";
import Worldfile from "../data/Worldfile";
import { DEFAULT_TEXT_STYLE } from "../text/Fonts";
import { winLevel } from "../state/Governor";

const TestMap : {levels: [number, number, number][], rows: [number, number][]} = {
    levels: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    rows: [[150, 62], [250, 132], [40, 190]],
};

const drawCircle = (x : number, y : number) => {
    const text = new PIXI.Texture(PIXI.loader.resources['system'].texture.baseTexture);
    const rect = new PIXI.Rectangle(0, 104, 24, 16);
    text.frame = rect;
    const sprite = new PIXI.Sprite(text);
    sprite.anchor.set(0.5, 0.5);
    sprite.x = x;
    sprite.y = y;
    return sprite;
};

const LEVEL_NAME_HEIGHT = 6;

export default class Map implements Runner {
    public drawables : PIXI.Container;

    private graphics : PIXI.Graphics
    private frame : number = 0;
    private flatMap : {x : number, y : number}[];
    private mapSprite : Updatable;
    private levelName : PIXI.Text;
    private active : boolean = true;

    private row : number;
    private level : number;

    private crowns : PIXI.Sprite[] = [];

    constructor(
        private master : Master, 
        private maxLevel : number, 
        private maxRow : number, 
        private levelParams : [boolean, boolean, boolean][][]
    ) {
        this.flatMap = flattenMap(TestMap);

        this.drawables = new PIXI.Container();
        this.flatMap.forEach(level => {
            this.drawables.addChild(drawCircle(level.x, level.y));
        });

        this.row = this.maxRow;
        this.level = this.maxLevel;

        this.refreshMapSprite();
        this.drawLevelName();
        this.drawCrowns();
    }

    update() {
        this.mapSprite.update();

        this.drawables.removeChild(this.graphics);
        this.graphics = MapDrawer(
            this.flatMap, 
            this.frame,
            this.maxRow * 3 + this.maxLevel,
        );
        this.drawables.addChildAt(this.graphics, 0);

        this.frame++;
        this.frame = this.frame % frameCycle;
    }

    respond(controls : Controls) {
        if (controls.Left) {
            this.level = Math.max(this.level - 1, 0);
            controls.Left = false;
            this.refreshMapSprite();
            this.drawLevelName();
            this.drawCrowns();
        }
        if (controls.Right) {
            const maxLevel = this.row === this.maxRow ? this.maxLevel : 2;
            this.level = Math.min(this.level + 1, maxLevel)
            controls.Right = false;
            this.refreshMapSprite();
            this.drawLevelName();
            this.drawCrowns();
        }
        if (controls.Up) {
            this.row = Math.max(this.row - 1, 0);
            if (this.row === this.maxRow && this.level > this.maxLevel) {
                this.level = this.maxLevel;
            }
            this.refreshMapSprite();
            this.drawLevelName();
            this.drawCrowns();
        };
        if (controls.Down) {
            this.row = Math.min(this.maxRow, this.row + 1);
            this.refreshMapSprite();
            this.drawLevelName();
            this.drawCrowns();
        }
        if (controls.ButtonA || controls.Start) {
            this.onSelectLevel();
            controls.release();
        }
    }

    private onSelectLevel() {
        const index = TestMap.levels[this.row][this.level];
        if (this.active) {
            this.active = false;
            import(/* webpackChunkName: "level-preload" */ '../level/LevelPreload').then(
                Level => {
                    this.master.removeRunner(this);
                    this.master.addRunner(new Level.default(
                        this.master, 
                        index, 
                        winLevel.bind(null, this.master, this.level, this.row)
                    ));
                }
            );
        }
    }

    private drawLevelName() {
        if (this.levelName) {
            this.drawables.removeChild(this.levelName);
        }
        const levelIndex = TestMap.levels[this.row][this.level];
        const { name } = Worldfile.levels[levelIndex].attributes;
        const metrics = PIXI.TextMetrics.measureText(name, DEFAULT_TEXT_STYLE);
        const x = 200-metrics.width;
        this.levelName = new PIXI.Text(name, DEFAULT_TEXT_STYLE);
        this.levelName.x = Math.floor(x);
        this.levelName.y = LEVEL_NAME_HEIGHT;
        this.levelName.scale.x = 2;
        this.levelName.scale.y = 2;
        this.drawables.addChild(this.levelName);
    }

    private refreshMapSprite() {
        if (this.mapSprite) {
            this.drawables.removeChild(this.mapSprite.drawables);
        }
        const position = this.flatMap[this.row * 3 + this.level];
        this.mapSprite = new MapSprite(new Point(position.x, position.y));
        this.drawables.addChild(this.mapSprite.drawables);
    }

    private drawCrowns() {
        this.crowns.forEach(crown => this.drawables.removeChild(crown));
        const newCrowns : PIXI.Sprite[] = [];
        const params = this.levelParams[this.row][this.level];
        const allTrue = params.reduce((prev, curr) => prev && curr, true);
        const text = new PIXI.Texture(PIXI.loader.resources['system'].texture.baseTexture);
        const rect = new PIXI.Rectangle(allTrue ? 0 : 16, 120, 16, 16);
        text.frame = rect;
        for (let i = 0; i < 3; i++) {
            if (params[i]) {
                const sprite = new PIXI.Sprite(text);
                sprite.x = 352 + 16 * i; 
                sprite.y = 225 - 16;
                this.drawables.addChild(sprite);
                newCrowns.push(sprite);
            }
        }
        this.crowns = newCrowns;
    }
}