/* A standardized control interface.
 *
 * The "release" function is called to make sure that certain buttons do not
 * remain constantly pressed, whether they do in "reality" or not.
 * */

export default interface Controls {
  Up: boolean;
  Down: boolean;
  Left: boolean;
  Right: boolean;
  ButtonA: boolean;
  ButtonB: boolean;
  Start: boolean;
  ButtonPlus: boolean;
  ButtonX: boolean;
  ButtonO: boolean;

  release(): void;
}
