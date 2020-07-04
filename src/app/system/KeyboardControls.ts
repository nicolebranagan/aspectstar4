import Controls from "../interfaces/Controls";

/* An implementation of the control interface.
 *
 * Derived from Space Ava (and thus Aspect Star W, eventually)
 * */

export default class KeyboardControls implements Controls {
  Up = false;
  Down = false;
  Left = false;
  Right = false;
  ButtonA = false;
  ButtonB = false;
  Start = false;
  ButtonPlus = false;
  ButtonX = false;
  ButtonO = false;

  ButtonL = false;
  ButtonR = false;

  constructor() {
    window.addEventListener("keydown", e => this.keyDown(e), false);
    window.addEventListener("keyup", e => this.keyUp(e), false);
  }

  release(): void {
    this.ButtonA = false;
    this.ButtonB = false;
    this.Start = false;
    this.ButtonPlus = false;
    this.ButtonX = false;
    this.ButtonO = false;
    this.Up = false;
    this.Down = false;
  }

  keyDown(event: KeyboardEvent): void {
    if (event.keyCode == 88) {
      // X
      this.ButtonA = true;
    }
    if (event.keyCode == 38) {
      this.Up = true;
    }
    if (event.keyCode == 40) {
      this.Down = true;
    }
    if (event.keyCode == 37) {
      this.Left = true;
    }
    if (event.keyCode == 39) {
      this.Right = true;
    }
    if (event.keyCode == 90) {
      this.ButtonB = true;
    }
    if (event.keyCode == 13) {
      this.Start = true;
    }
    if (event.keyCode == 65) {
      // A
      this.ButtonPlus = true;
    }
    if (event.keyCode == 83) {
      // S
      this.ButtonX = true;
    }
    if (event.keyCode == 68) {
      // D
      this.ButtonO = true;
    }
  }

  keyUp(event: KeyboardEvent): void {
    if (event.keyCode == 88) {
      // X
      this.ButtonA = false;
    }
    if (event.keyCode == 38) {
      this.Up = false;
    }
    if (event.keyCode == 40) {
      this.Down = false;
    }
    if (event.keyCode == 37) {
      this.Left = false;
    }
    if (event.keyCode == 39) {
      this.Right = false;
    }
    if (event.keyCode == 90) {
      this.ButtonB = false;
    }
    if (event.keyCode == 13) {
      this.Start = false;
    }
    if (event.keyCode == 65) {
      // A
      this.ButtonPlus = false;
    }
    if (event.keyCode == 83) {
      // S
      this.ButtonX = false;
    }
    if (event.keyCode == 68) {
      // D
      this.ButtonO = false;
    }
  }

  update() {}
}
