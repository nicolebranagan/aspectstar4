import Aspect from "../constants/Aspect";
import SolidityType from "../constants/SolidityType";
import LevelObject from "../interfaces/LevelObject";
import Point from "../system/Point";
import Solidity from "./Solidity";
import Stage from "../interfaces/Stage";

/* Stage represents the level, but solely as far as game logic is concerned;
 * actually drawing the level is the responsibility of the Terrain object.
 * */
export default class FunctionalStage implements Stage {
  private level: number[];
  private bigtiles: (number[] | number)[];
  private width: number;
  private key: SolidityType[];
  private platforms: [LevelObject, SolidityType, Aspect, boolean][] = [];

  constructor(
    level: any,
    bigtile: { bigtiles: (number[] | number)[]; key: number[] }
  ) {
    this.level = level.grid;
    this.bigtiles = bigtile.bigtiles;
    this.key = bigtile.key;
    this.width = level.width;
  }

  reset() {
    this.platforms = [];
  }

  public register(
    object: LevelObject,
    solidityType: SolidityType,
    aspect: Aspect,
    xor: boolean
  ) {
    this.platforms.push([object, solidityType, aspect, xor]);
  }

  public isSolid(pt: Point, asp: Aspect, upwardMomentum: boolean): boolean {
    for (const pair of this.platforms) {
      if (
        pair[2] == Aspect.NONE ||
        (!pair[3] && pair[2] == asp) ||
        (pair[3] && pair[2] != asp)
      ) {
        if (pair[0].physics.inrange(pair[0].point, pt)) {
          return Solidity.isSolid(pair[1], upwardMomentum);
        }
      }
    }
    const bigtilept = pt.floor(32);
    const bigtile = this.level[bigtilept.x + this.width * bigtilept.y];
    if (bigtile == 0) return false;
    const offsetpt = pt.modulo(32).floor(16);
    const bigtiledata = <number[]>this.bigtiles[bigtile];
    const localtile = this.key[bigtiledata[offsetpt.x + 2 * offsetpt.y]];
    return Solidity.isSolid(localtile, upwardMomentum);
  }

  public isDeath(pt: Point): boolean {
    const bigtilept = pt.floor(32);
    const bigtile = this.level[bigtilept.x + this.width * bigtilept.y];
    if (bigtile == 0) return false;
    const offsetpt = pt.modulo(32).floor(16);
    const bigtiledata = <number[]>this.bigtiles[bigtile];
    const localtile = this.key[bigtiledata[offsetpt.x + 2 * offsetpt.y]];
    return localtile == SolidityType.DEATH;
  }
}
