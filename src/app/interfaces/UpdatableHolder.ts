import Updatable from "./Updatable";

/* UpdatableHolder is like a master, but for updatables.
 * */

export default interface UpdatableHolder {
  addChild(updatable: Updatable): void;
  removeChild(updatable: Updatable): void;
}
