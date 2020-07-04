import Controls from "../interfaces/Controls";

enum GamepadButtons {
  A = 0,
  B = 1,
  X = 2,
  Y = 3,
  L = 4,
  R = 5,
  Start = 9,
  Up = 12,
  Down = 13,
  Left = 14,
  Right = 15
}

export default class GamepadControls implements Controls {
  private lastControls: { [button: number]: boolean } = {};

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

  constructor(private gamepad: Gamepad) {}

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

  update() {
    this.ButtonA =
      this.gamepad.buttons[GamepadButtons.A].pressed &&
      !this.lastControls[GamepadButtons.A];
    this.ButtonB =
      this.gamepad.buttons[GamepadButtons.B].pressed &&
      !this.lastControls[GamepadButtons.B];
    this.Start =
      this.gamepad.buttons[GamepadButtons.Start].pressed &&
      !this.lastControls[GamepadButtons.Start];
    this.ButtonPlus = false;
    this.ButtonX = false;
    this.ButtonO = false;
    this.Up =
      this.gamepad.buttons[GamepadButtons.Up].pressed &&
      !this.lastControls[GamepadButtons.Up];
    this.Down =
      this.gamepad.buttons[GamepadButtons.Down].pressed &&
      !this.lastControls[GamepadButtons.Down];
    this.Left = this.gamepad.buttons[GamepadButtons.Left].pressed;
    this.Right = this.gamepad.buttons[GamepadButtons.Right].pressed;

    this.ButtonL =
      this.gamepad.buttons[GamepadButtons.L].pressed &&
      !this.lastControls[GamepadButtons.L];
    this.ButtonR =
      this.gamepad.buttons[GamepadButtons.R].pressed &&
      !this.lastControls[GamepadButtons.R];

    this.lastControls = {
      [GamepadButtons.A]: this.gamepad.buttons[GamepadButtons.A].pressed,
      [GamepadButtons.B]: this.gamepad.buttons[GamepadButtons.B].pressed,
      [GamepadButtons.Start]: this.gamepad.buttons[GamepadButtons.Start]
        .pressed,
      [GamepadButtons.Up]: this.gamepad.buttons[GamepadButtons.Up].pressed,
      [GamepadButtons.Down]: this.gamepad.buttons[GamepadButtons.Down].pressed,
      [GamepadButtons.L]: this.gamepad.buttons[GamepadButtons.L].pressed,
      [GamepadButtons.R]: this.gamepad.buttons[GamepadButtons.R].pressed
    };
  }
}
