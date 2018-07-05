import Master from '../interfaces/Master';
import Aspect from '../constants/Aspect';
import Player from '../interfaces/Player';
import Runner from '../interfaces/Runner';

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

export default class System implements Runner {
    public drawables : PIXI.Container
    private aspects : Aspect[]
    private selectedAspect : Aspect

    constructor(master : Master, player : Player) {
        this.drawables = new PIXI.Container();
        this.selectedAspect = player.aspect;
        this.aspects = player.aspects;
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
    }

    respond() {}

    update() {}

    updateSystem(player : Player) {
        if (player.aspect !== this.selectedAspect || player.aspects.length !== this.aspects.length) {
            this.selectedAspect = player.aspect;
            this.aspects = player.aspects;
            this.reset();
        }
    }
}
