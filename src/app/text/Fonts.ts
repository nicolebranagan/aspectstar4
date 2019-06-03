export const GOLD_COLOR = "0xF8B800";

export const DEFAULT_TITLE_STYLE = new PIXI.TextStyle({
  fontFamily: "chicago",
  fontSize: 8,
  fontWeight: "100",
  fill: "white"
});

export const DEFAULT_SYSTEM_STYLE = new PIXI.TextStyle({
  fontFamily: "chicago",
  fontSize: 8,
  fontWeight: "100",
  fill: "white",
  dropShadow: true,
  dropShadowColor: 0x000000,
  dropShadowAlpha: 0.7,
  dropShadowDistance: 1,
  strokeThickness: 1
});

export const LOAD_LEVEL_NAME_STYLE = new PIXI.TextStyle({
  fontFamily: "chicago",
  fontSize: 14,
  fontWeight: "100",
  fill: "black",
  dropShadow: true,
  dropShadowColor: 0xaaaaaa,
  dropShadowAlpha: 0.7,
  dropShadowDistance: 1,
  strokeThickness: 0
});

export const WIN_LEVEL_NAME_STYLE = new PIXI.TextStyle({
  fontFamily: "chicago",
  fontSize: 16,
  fontWeight: "100",
  fill: "white",
  dropShadow: true,
  dropShadowColor: 0x000000,
  dropShadowAlpha: 0.7,
  dropShadowDistance: 1,
  strokeThickness: 1
});

export const DEFAULT_TEXT_STYLE = new PIXI.TextStyle({
  fontFamily: "chicago",
  fontSize: 6,
  fontWeight: "100",
  fill: "0xF8B800",
  dropShadow: true,
  dropShadowColor: 0x000000,
  dropShadowAlpha: 0.7,
  dropShadowDistance: 1,
  strokeThickness: 1
});

export const CustomFonts: { [key: string]: PIXI.TextStyle } = {
  machine: new PIXI.TextStyle({
    fontFamily: "Courier New",
    fontSize: 6,
    fontWeight: "100",
    fill: "0x08F820",
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowAlpha: 0.7,
    dropShadowDistance: 1,
    strokeThickness: 1
  }),
  gothic: new PIXI.TextStyle({
    fontFamily: "deutsche",
    fontSize: 8,
    fontWeight: "100",
    fill: "0xFFAAAA",
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowAlpha: 0.7,
    dropShadowDistance: 1,
    strokeThickness: 1
  })
};
