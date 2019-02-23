import LevelObject from "../../interfaces/LevelObject";
import Aspect from "../../constants/Aspect";
import MovingPhysics from "../physics/MovingPhysics";
import Point from "../../system/Point";
import { LevelOptions } from "../Level";
import Stage from "../../interfaces/Stage";

enum SafetyPinStates {
    BOUNCING,
    CHARGING,
    STATIONARY
}

const MAX_CHARGE = 128;
const CHARGING_SPEED = 2;
const FRAME_TIMER_MAX = 50;

export default class SafetyPin implements LevelObject {
    active = true;
    drawables: PIXI.Container = new PIXI.Container();
    aspect: Aspect;
    physics: MovingPhysics;
    point: Point;

    private home : Point;
    private state : SafetyPinStates = SafetyPinStates.BOUNCING;
    private frame : PIXI.Rectangle;
    private sprite : PIXI.Sprite;
    private texture : PIXI.Texture;
    private frameTimer : number;
    private warningSprite : PIXI.Sprite;

    constructor(
        stage: Stage,
        point: Point,
        aspect: Aspect,
        texture: string,
        private rect: number[],
        private rect2: number[],
        width: number,
        height: number,
        private pointingLeft: boolean
    ) {
        this.point = new Point(point.x, point.y - 0.1);
        this.home = this.point; // But it won't get updated, while this.point will
        this.aspect = aspect;
        this.physics = new MovingPhysics(stage, width, height);
        this.drawables = new PIXI.Container();
        this.frameTimer = 0;

        this.texture = PIXI.Texture.from(
            PIXI.loader.resources[texture].texture.baseTexture
        );
        this.setTextureFrame();
        this.texture.frame = this.frame;
        this.sprite = new PIXI.Sprite(this.texture);

        this.sprite.anchor.set(0.5, 1);
        this.sprite.x = point.x;
        this.sprite.y = point.y;
        if (this.pointingLeft) 
            this.sprite.scale.x = -1;
        else 
            this.sprite.scale.x = 1;
        this.drawables.addChild(this.sprite);

        if (rect2) {
            this.warningSprite = new PIXI.Sprite(PIXI.Texture.from(
                PIXI.loader.resources[texture].texture.baseTexture
            ));
            this.warningSprite.texture.frame = new PIXI.Rectangle(...rect2);
            this.warningSprite.anchor.set(0.5, 1);
        }
    }

    setTextureFrame() {
        const newRect = this.rect.slice(0); // Make a copy of the array
        if (this.state === SafetyPinStates.CHARGING) {
            newRect[1] += 32;
        } else if (this.state === SafetyPinStates.BOUNCING && this.frameTimer > (FRAME_TIMER_MAX / 2)) {
            newRect[1] += 16;
        }
        this.frame = new PIXI.Rectangle(...newRect);
        this.texture.frame = this.frame;
    }

    update(levelOptions : LevelOptions) {
        const { state, aspect, pointingLeft, point, home, frameTimer, warningSprite } = this;
        this.frameTimer++;
        if (frameTimer >= FRAME_TIMER_MAX) {
            this.frameTimer = 0;
        }

        const player = levelOptions.getPlayer();
        this.setTextureFrame();

        if (state === SafetyPinStates.STATIONARY) {
            if (player.aspect !== aspect) {
                this.state = SafetyPinStates.BOUNCING;
            }
            return;
        } else {
            if (player.aspect === aspect) {
                this.state = SafetyPinStates.STATIONARY;
            }
        }

        const delta_x = player.point.x - point.x;
        const delta_y = Math.abs(player.point.y - point.y);

        if (delta_x < 0 && pointingLeft || delta_x > 0 && !pointingLeft && delta_y < 10) {
            this.state = SafetyPinStates.CHARGING;
            warningSprite && this.drawables.addChild(warningSprite);
        } else {
            this.state = SafetyPinStates.BOUNCING;
            warningSprite && this.drawables.removeChild(warningSprite);
        }

        const delx = point.x - home.x;
        if (state === SafetyPinStates.BOUNCING) {
            if (delx < 1) {
                this.point = home;
            } else {
                this.point = new Point(point.x - 0.5*Math.sign(delx), point.y);
            }
        } else {
            const dx = pointingLeft ? -CHARGING_SPEED : CHARGING_SPEED;
            if (Math.abs(delx) <= MAX_CHARGE) {
                this.point = new Point(point.x + dx, point.y);
            }
        }

        const rnd = point.round();
        this.sprite.x = rnd.x;
        this.sprite.y = rnd.y + 1;
        if (warningSprite) {
            warningSprite.x = rnd.x - 16;
            warningSprite.y = rnd.y - 16;
        }
    }
}