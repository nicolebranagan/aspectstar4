import GenericRunner from '../system/GenericRunner';
import Master from '../interfaces/Master';
import Aspect from '../constants/Aspect';

const aspectCache : { [index : number] : PIXI.Sprite } = {};

const getAspect : (aspect : Aspect) => PIXI.Sprite = (aspect : Aspect) => {
    if (aspect in aspectCache) {
        return aspectCache[aspect];
    }
    const text = PIXI.Texture.from(PIXI.loader.resources['system'].texture.baseTexture); 
    let rect = new PIXI.Rectangle(48 + 16 * (aspect), 0, 16, 16);
    text.frame = rect;
    const sprite = new PIXI.Sprite(text);
    sprite.anchor.set(0, 0);
    sprite.x = -16 + aspect*16;
    sprite.y = 0;
    aspectCache[aspect] = sprite;
    return sprite;
};

export default class System extends GenericRunner {
    private aspects : Aspect[] = [Aspect.ASPECT_PLUS];

    constructor(master : Master) {
        super(master);

        const text = PIXI.Texture.from(PIXI.loader.resources['system'].texture.baseTexture); 
        let rect = new PIXI.Rectangle(0, 0, 64, 32);
        text.frame = rect;
        const sprite = new PIXI.Sprite(text);
        sprite.anchor.set(0, 0);
        sprite.x = 0;
        sprite.y = 0;
        this.drawables.addChild(sprite);
        this.drawables.addChild(getAspect(Aspect.ASPECT_PLUS));
    }

    update() {;}

    getAspect(aspect : Aspect) {
        this.aspects.push(aspect);
        this.drawables.addChild(getAspect(aspect));
    }
}
