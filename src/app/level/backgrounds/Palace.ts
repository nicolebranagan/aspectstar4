import Background from "../../interfaces/Background";

/*
 * 225 pixel height
 * 48 pixels: center
 * 16 pixels: small
 * 32 pixels: big
 * 64 pixels: very big
 * 
 * 112
 * 32
 * 112
 * ---
 * 256
 * 32 off (16 on each)
 * 
 * 400 wide screen
 * each strip 96
 * 5 sprites needed in each row
 * */

 const CENTER_PILLARS = [0, 0, 96, 48];
 const SMALL_BRICKS = [0, 48, 96, 16];
 const LARGE_BRICKS = [0, 64, 96, 32];
 const GIANT_BRICKS = [0, 96, 96, 48];

const generateSprite = (rect : number[], x : number, y : number) => {
    const texture = PIXI.Texture.from(PIXI.loader.resources['background'].texture.baseTexture); 
    const pixiRect = new PIXI.Rectangle(...rect);
    texture.frame = pixiRect;       
    const sprite = new PIXI.Sprite()
    sprite.texture = texture;
    sprite.x = x;
    sprite.y = y;
    return sprite;
};

export default class Palace implements Background  {
    public drawables : PIXI.Container;
    private rows : PIXI.Container[] = [];

    constructor() {
        this.drawables = new PIXI.Container;
        this.initializeRows();
    }

    initializeRows() {
        this.rows.push(this.generateRow(GIANT_BRICKS, -16));
        this.rows.push(this.generateRow(LARGE_BRICKS, -16+48));
        this.rows.push(this.generateRow(SMALL_BRICKS, -16+48+32));
        this.rows.push(this.generateRow(CENTER_PILLARS, -16+48+32+16));
        this.rows.push(this.generateRow(SMALL_BRICKS, -16+48+32+16+48));
        this.rows.push(this.generateRow(LARGE_BRICKS, -16+48+32+16+48+16));
        this.rows.push(this.generateRow(GIANT_BRICKS, -16+48+32+16+48+16+32));
        this.rows.forEach(row => this.drawables.addChild(row));
    }

    generateRow(rect : number[], y : number) {
        const centerPillars = new PIXI.Container();
        for (let i = -1; i < 6; i++) {
            centerPillars.addChild(generateSprite(
                rect, 96*i, y
            ))
        }
        return centerPillars;
    }

    offsetRow(row : PIXI.Container, offset : number) {
        row.children.forEach((child, index ) => {
            child.x = 96*(index - 1) + offset;
        });
    }

    updatePos(x : number, y : number, offset : number) {
        this.drawables.position.y = offset; // Handle camera movement for text boxes
        this.offsetRow(this.rows[0], (x / 2 >> 0) % 96);
        this.offsetRow(this.rows[1], (x / 4 >> 0) % 96);
        this.offsetRow(this.rows[2], (x / 8 >> 0) % 96);

        this.offsetRow(this.rows[3], (x / 16 >> 0) % 96);

        this.offsetRow(this.rows[4], (x / 8 >> 0) % 96);
        this.offsetRow(this.rows[5], (x / 4 >> 0) % 96);
        this.offsetRow(this.rows[6], (x / 2 >> 0) % 96);
    }

    update() {;}

    respond() {;}
};
