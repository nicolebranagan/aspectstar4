import Point from "../system/Point";

export default interface Physics {
  inrange(point: Point, other: Point): boolean;
}
