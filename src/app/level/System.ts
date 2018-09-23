import Master from '../interfaces/Master';
import Aspect from '../constants/Aspect';
import Player from '../interfaces/Player';
import Drawable from '../interfaces/Drawable';

class CachedSprite {
    private sprite : PIXI.Sprite;
    get(generator : () => PIXI.Sprite) {
        if (!this.sprite) {
            this.sprite = generator();
        }
        return this.sprite;
    }
};

const topLeftCorner : CachedSprite = new CachedSprite();
const aspectCache : { [index : number] : [CachedSprite, CachedSprite] } = {
    [Aspect.ASPECT_PLUS]: [new CachedSprite(), new CachedSprite()],
    [Aspect.ASPECT_X]: [new CachedSprite(), new CachedSprite()],
    [Aspect.ASPECT_CIRCLE]: [new CachedSprite(), new CachedSprite()],
};

const getAspect : (aspect : Aspect, number : number) => PIXI.Sprite = (aspect : Aspect, number : number) => {
    const text = PIXI.Texture.from(PIXI.loader.resources['system'].texture.baseTexture); 
    let rect = new PIXI.Rectangle(48 + 16 * (aspect), number * 16, 16, 16);
    text.frame = rect;
    const sprite = new PIXI.Sprite(text);
    sprite.anchor.set(0, 0);
    sprite.x = -16 + aspect*16;
    sprite.y = 0;
    return sprite;
};

const getTopLeftCorner : () => PIXI.Sprite = () => {
    const text = PIXI.Texture.from(PIXI.loader.resources['system'].texture.baseTexture); 
    let rect = new PIXI.Rectangle(0, 0, 64, 24);
    text.frame = rect;
    const sprite = new PIXI.Sprite(text);
    sprite.anchor.set(0, 0);
    sprite.x = 0;
    sprite.y = 0;
    return sprite;
}

const topRightCorner : CachedSprite = new CachedSprite();

const getTopRightCorner : () => PIXI.Sprite = () => {
    const text = PIXI.Texture.from(PIXI.loader.resources['system'].texture.baseTexture); 
    let rect = new PIXI.Rectangle(0, 24, 64, 24);
    text.frame = rect;
    const sprite = new PIXI.Sprite(text);
    sprite.anchor.set(0, 0);
    sprite.x = 400-64;
    sprite.y = 0;
    return sprite;
};

const getNumber : (number : number, x : number, y: number) => PIXI.Sprite = (number, x, y) => {
    const text = PIXI.Texture.from(PIXI.loader.resources['system'].texture.baseTexture); 
    let rect = new PIXI.Rectangle(number * 8, 48, 8, 16);
    text.frame = rect;
    const sprite = new PIXI.Sprite(text);
    sprite.anchor.set(0, 0);
    sprite.x = x;
    sprite.y = y;
    return sprite;
};

export default class System implements Drawable {
    public drawables : PIXI.Container
    private aspects : Aspect[]
    private selectedAspect : Aspect
    private bellCount : number
    private bellCountMax : number

    constructor(player : Player, bellCountMax : number) {
        this.drawables = new PIXI.Container();
        this.selectedAspect = player.aspect;
        this.aspects = player.aspects;
        this.bellCountMax = bellCountMax;
        this.reset();
    }
    
    reset() {
        this.drawables.removeChildren();
        this.drawables.addChild(topLeftCorner.get(getTopLeftCorner));
        this.aspects.forEach(
            aspect => {
                // Which pair of cached sprites do we use
                const number = aspect === this.selectedAspect ? 1 : 0;
                this.drawables.addChild(aspectCache[aspect][number].get(getAspect.bind(null, aspect, number)))
            }
        )
        this.drawables.addChild(topRightCorner.get(getTopRightCorner));
        this.resetBellCount();
    }

    private resetBellCount() {
        const digit0 = this.bellCount / 10 >> 0;
        const digit1 = this.bellCount % 10;
        const digit2 = this.bellCountMax / 10 >> 0;
        const digit3 = this.bellCountMax % 10;

        this.drawables.addChild(getNumber(digit0, 400-40, 0));
        this.drawables.addChild(getNumber(digit1, 400-32, 0));
        this.drawables.addChild(getNumber(digit2, 400-16, 0));
        this.drawables.addChild(getNumber(digit3, 400-8, 0));
    }

    updateSystem(player : Player, bellCountMax : number) {
        if (player.aspect !== this.selectedAspect 
            || player.aspects.length !== this.aspects.length 
            || this.bellCount !== player.bells
            || this.bellCountMax !== bellCountMax
        ) {
            this.selectedAspect = player.aspect;
            this.aspects = player.aspects;
            this.bellCount = player.bells;
            this.bellCountMax = bellCountMax;
            this.reset();
        }
    }
}
