import Updatable from "../interfaces/Updatable";
import UpdatableHolder from "../interfaces/UpdatableHolder";

const FRAMES = [
  [0, 128],
  [32, 128],
  [64, 128],
  [96, 128],
  [128, 128],
  [160, 128],
  [192, 128],
  [232, 128]
];

const TIME_PER_FRAME = 4;
const DIMENSION = 32;

export const getOpeningAnimation = (master: UpdatableHolder): Updatable => {
  const drawables = new PIXI.Container();
  let currentFrame = 0;
  let timer = 0;
  const text = PIXI.Texture.from(
    PIXI.loader.resources["introplayer"].texture.baseTexture
  );
  text.frame = new PIXI.Rectangle(
    FRAMES[0][0],
    FRAMES[0][1],
    DIMENSION,
    DIMENSION
  );

  const sprite = new PIXI.Sprite();
  sprite.anchor.set(0.5, 1);
  sprite.texture = text;
  sprite.position.x = 0;
  sprite.position.y = 0;

  drawables.addChild(sprite);

  return {
    drawables,
    update() {
      timer++;
      if (timer >= TIME_PER_FRAME) {
        currentFrame++;
        if (!FRAMES[currentFrame]) {
          master.removeChild(this);
          return;
        }

        text.frame = new PIXI.Rectangle(
          FRAMES[currentFrame][0],
          FRAMES[currentFrame][1],
          DIMENSION,
          DIMENSION
        );

        timer = 0;
      }
    }
  };
};
