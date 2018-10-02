import Drawable from '../interfaces/Drawable';
import Attributes from '../interfaces/Attributes';
import Bigtiles from '../data/Bigtiles';

const TILESETS = ['level1'];

/* The terrain object is in charge of drawing the level. */

export default class Terrain implements Drawable {
    public drawables : PIXI.Container;

    constructor(level : any, attributes : Attributes) {
        this.drawables = new PIXI.Container();
        const drawables = this.drawables;
        const text = PIXI.loader.resources[TILESETS[attributes.tileset]].texture.baseTexture;

        function getTile(i : number) : PIXI.Texture {
            const rect = new PIXI.Rectangle(16*i, 0, 16, 16);
            return new PIXI.Texture(text, rect);
        }
        function renderSprite(i : number, x : number, y : number) : void {
            if (i == 0) return;
            const sprite = new PIXI.Sprite(getTile(i));
            sprite.x = x;
            sprite.y = y;
            drawables.addChild(sprite);
        }

        const bigtileset : any = Bigtiles[attributes.bigtileset].bigtiles;
        function drawBigtile(i : number, x : number, y : number) : void {
            const bigtile = bigtileset[i];
            if (bigtile == -1) {
                throw new Error("Can't load bigtile");
            }
            // Cartesian coordinates
            const cartx = x * 32;
            const carty = y * 32;
            for (let i = 0; i < bigtile.length; i++) {
                const localx = i % 2;
                const localy = (i / 2) >> 0;
                renderSprite(bigtile[i], cartx + localx*16, carty + localy*16)
            }
        }

        for (let i = 0; i < level.grid.length; i++) {
            const x = i % level.width;
            const y = (i / level.width) >> 0;
            if (level.grid[i] === 0)
                continue
            drawBigtile(level.grid[i], x, y);
        }
    }
};

