/* A Drawable is an interface which wraps a PIXI.Container.
 * and represents an abstract concept of something that is loaded to the
 * screen.
 * */
export default interface Drawable {
  drawables: PIXI.Container;
}
