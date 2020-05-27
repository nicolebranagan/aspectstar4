import LevelObject from "../interfaces/LevelObject";
import Point from "../system/Point";
import Stage from "../interfaces/Stage";
import { LevelOptions } from "./Level";

/**
 * Loader will load in the objects
 */
export default function Loader(
  stage: Stage,
  objects: ((number | boolean)[] | (string | number)[])[],
  levelOptions: LevelOptions
): Promise<LevelObject>[] {
  return objects.map(async e => await parseObject(stage, e, levelOptions));
}

async function parseObject(
  stage: Stage,
  data: any[],
  levelOptions: LevelOptions
): Promise<LevelObject> {
  const objectDictionary = (
    await import(/* webpackChunkName: "objects" */ "../data/Objects")
  ).default;
  const objdata = objectDictionary[data[0]];
  const point = new Point(data[1], data[2]);

  if (objdata.type == "saveicon") {
    const SaveIcon = (
      await import(/* webpackChunkName: "save-icon" */ "./objects/SaveIcon")
    ).default;
    return new SaveIcon(stage, point, objdata.rect);
  } else if (objdata.type == "bell") {
    const Bell = (await import(/* webpackChunkName: "bell" */ "./objects/Bell"))
      .default;
    return new Bell(stage, point, objdata.rect);
  } else if (objdata.type == "aspecttile") {
    const AspectTile = (
      await import(/* webpackChunkName: "aspect-tile" */ "./objects/AspectTile")
    ).default;
    return new AspectTile(stage, point, objdata.aspect, objdata.rect);
  } else if (objdata.type == "platform") {
    const Platform = (
      await import(/* webpackChunkName: "platform" */ "./objects/Platform")
    ).default;
    return new Platform(
      stage,
      point,
      objdata.aspect,
      objdata.texture,
      objdata.rect,
      objdata.rect2,
      data[3],
      data[4]
    );
  } else if (objdata.type == "square") {
    const Square = (
      await import(/* webpackChunkName: "square" */ "./objects/Square")
    ).default;
    return new Square(
      stage,
      point,
      objdata.aspect,
      objdata.texture,
      objdata.rect,
      objdata.rect2,
      objdata.xor
    );
  } else if (objdata.type === "character") {
    const Character = (
      await import(/* webpackChunkName: "character" */ "./objects/Character")
    ).default;
    return new Character(point, objdata.row, data[3], objdata.oneTimeUse);
  } else if (objdata.type === "victory") {
    const Victory = (
      await import(/* webpackChunkName: "character" */ "./objects/Victory")
    ).default;
    return new Victory(point, data[3]);
  } else if (objdata.type === "landmover") {
    const LandMover = (
      await import(/* webpackChunkName: "land-mover" */ "./objects/LandMover")
    ).default;
    return new LandMover(
      stage,
      point,
      objdata.aspect,
      objdata.texture,
      objdata.rect,
      objdata.width,
      objdata.height,
      objdata.frameCount
    );
  } else if (objdata.type === "spikyplatform") {
    const SpikyPlatform = (
      await import(
        /* webpackChunkName: "spiky-platform" */ "./objects/SpikyPlatform"
      )
    ).default;
    return new SpikyPlatform(
      stage,
      point,
      objdata.aspect,
      objdata.texture,
      objdata.rect,
      objdata.width,
      objdata.height,
      objdata.damageHeight,
      objdata.frameCount,
      data[4]
    );
  } else if (objdata.type === "safetypin") {
    const SafetyPin = (
      await import(/* webpackChunkName: "safety-pin" */ "./objects/SafetyPin")
    ).default;
    return new SafetyPin(
      stage,
      point,
      objdata.aspect,
      objdata.texture,
      objdata.rect,
      objdata.rect2,
      objdata.width,
      objdata.height,
      objdata.pointingLeft
    );
  } else if (objdata.type === "movingwall") {
    const MovingWall = (
      await import(/* webpackChunkName: "moving-wall" */ "./objects/MovingWall")
    ).default;
    return new MovingWall(point, objdata.row, data[3], levelOptions);
  } else if (objdata.type === "aspectcard") {
    const AspectCard = (
      await import(/* webpackChunkName: "aspect-card" */ "./objects/AspectCard")
    ).default;
    return new AspectCard(
      stage,
      point,
      objdata.aspect,
      objdata.texture,
      objdata.rect
    );
  } else if (objdata.type === "aspectdoor") {
    const AspectDoor = (
      await import(/* webpackChunkName: "aspect-door" */ "./objects/AspectDoor")
    ).default;
    return new AspectDoor(
      stage,
      point,
      objdata.aspect,
      objdata.texture,
      objdata.rect,
      objdata.rect2
    );
  } else if (objdata.type === "shooter") {
    const Shooter = (
      await import(/* webpackChunkName: "shooter" */ "./objects/Shooter")
    ).default;
    return new Shooter(
      stage,
      point,
      objdata.aspect,
      objdata.texture,
      objdata.rect,
      objdata.rect2,
      objdata.bulletrect,
      objdata.timermax
    );
  } else if (objdata.type === "spikycircler") {
    const SpikyCircler = (
      await import(
        /* webpackChunkName: "spikycircler" */ "./objects/SpikyCircler"
      )
    ).default;

    return new SpikyCircler(
      stage,
      point,
      objdata.aspect,
      objdata.texture,
      objdata.rect,
      objdata.rect2,
      objdata.width,
      objdata.height,
      objdata.damageWidth,
      objdata.damageHeight,
      objdata.frameCount,
      data[4]
    );
  } else if (objdata.type === "boss1") {
    const Vampire = (
      await import(/* webpackChunkName: "boss1" */ "./objects/bosses/Vampire")
    ).default;
    return new Vampire(point, levelOptions);
  } else if (objdata.type === "breakapartsquare") {
    const BreakApartSquare = (
      await import(
        /* webpackChunkName: "breakapartsquare" */ "./objects/BreakApartSquare"
      )
    ).default;

    return new BreakApartSquare(
      stage,
      point,
      objdata.texture,
      objdata.rect,
      objdata.frameCount
    );
  }
}
