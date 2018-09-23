import LevelObject from '../../interfaces/LevelObject';
import Aspect from '../../constants/Aspect';
import NullPhysics from '../physics/NullPhysics';
import Point from '../../system/Point';
import Player from '../../interfaces/Player';
import { LevelOptions } from '../Level';
import Interaction from '../../interfaces/Interaction';
import Interactions from '../../data/Interactions';

export default class Character implements LevelObject {
    active = true;
    drawables : PIXI.Container;
    aspect = Aspect.NONE;
    physics = new NullPhysics();
    point: Point;

    private row : number;
    private oneTimeUse : boolean;
    protected spoken : boolean = false;
    private facingLeft : boolean = false;
    private sprite : PIXI.Sprite;
    private rect : PIXI.Rectangle;
    private frame : number = 0
    protected timer : number = 0
    protected interaction : Interaction[];

    constructor(point : Point, row : number, interactionKey : string, oneTimeUse : boolean) {
        this.point = point;
        this.row = row;
        this.oneTimeUse = oneTimeUse;

        const text = PIXI.Texture.from(PIXI.loader.resources['characters'].texture.baseTexture);
        this.rect = new PIXI.Rectangle(0, this.row*32, 16, 32);
        text.frame = this.rect;
        this.sprite = new PIXI.Sprite(text);
        this.drawables = new PIXI.Container();
        this.drawables.addChild(this.sprite);

        this.sprite.anchor.set(0.5, 1);
        this.sprite.x = this.point.x;
        this.sprite.y = this.point.y;

        this.interaction = Interactions[interactionKey];
    }

    update(levelOptions : LevelOptions) {
        const player = levelOptions.getPlayer();
        if (this.spoken) {
            // This is a very simple timer for objects that phase out of existence
            // We need them to remain on-screen for the duration of the textbox,
            // but then disappear immediately.
            this.timer++;
            if (this.timer === 3) {
                this.deactivate(levelOptions);
            }
            return;
        }

        this.timer++
        if (this.timer == 17) {
            this.timer = 0;
            this.frame = (this.frame + 1) % 2;
            this.determineFrame();
        }
        this.facingLeft = this.point.x > player.point.x;

        if (!this.spoken && Math.abs(this.point.x - player.point.x) < 32 &&
            Math.abs(this.point.y - player.point.y) < 8
        ) {
            this.activate(levelOptions);
        } else {
            levelOptions.prepareInteraction(null);
        }
    }

    protected activate(levelOptions : LevelOptions) {
        if (this.oneTimeUse) {
            levelOptions.setInteraction(this.interaction);
            this.spoken = true;
            this.timer = 0;
        } else {
            levelOptions.prepareInteraction(this.interaction)
        }
    }

    protected deactivate(levelOptions : LevelOptions) {
        this.active = false;
    }

    determineFrame() {
        this.rect = new PIXI.Rectangle(this.frame * 16, this.row*32, 16, 32);
        this.sprite.texture.frame = this.rect;
        if (this.facingLeft)
            this.sprite.scale.x = -1;
        else
            this.sprite.scale.x = 1;
    }
}