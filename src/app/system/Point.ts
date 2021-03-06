/* A Point is a standard 2d vector. The point should be immutable.
 *
 * Method round() returns a new point whose children are integers.
 * */

export default class Point {
  private _x: number = 0;
  private _y: number = 0;

  constructor(x: number, y: number) {
    if (x) this._x = x;
    if (y) this._y = y;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  equals(p: Point): boolean {
    return this._x == p.x && this._y == p.y;
  }

  round(): Point {
    return new Point(this._x >> 0, this._y >> 0);
  }

  multiply(j: number): Point {
    return new Point(this._x * j, this._y * j);
  }

  modulo(j: number): Point {
    return new Point(this._x % j, this._y % j);
  }

  floor(j: number): Point {
    return new Point((this._x / j) >> 0, (this._y / j) >> 0);
  }

  add(p: Point): Point {
    return new Point(this._x + p.x, this._y + p.y);
  }

  subtract(p: Point): Point {
    return new Point(this._x - p.x, this._y - p.y);
  }

  inRect(p: Point, width: number, height: number): boolean {
    const practicalWidth = width / 2;
    const delta_y = p.y - this._y;
    return (
      Math.abs(p.x - this._x) <= practicalWidth &&
      delta_y >= 0 &&
      delta_y <= height
    );
  }

  inCenteredRect(p: Point, width: number, height: number): boolean {
    const practicalWidth = width / 2;
    const practicalHeight = height / 2;
    return (
      Math.abs(p.x - this._x) <= practicalWidth &&
      Math.abs(p.y - this._y) <= practicalHeight
    );
  }
}
