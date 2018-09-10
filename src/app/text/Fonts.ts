export const DEFAULT_TITLE_STYLE = new PIXI.TextStyle({
    fontFamily: 'chicago',
    fontSize: 8,
    fontWeight: '100',
    fill: 'white',
});

export const DEFAULT_TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'chicago',
    fontSize: 6,
    fontWeight: '100',
    fill: '0xF8B800',
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowAlpha: 0.7,
    dropShadowDistance: 1,
    strokeThickness: 1,
});

export const CustomFonts : {[key : string] : PIXI.TextStyle} = {
    'machine': new PIXI.TextStyle({
        fontFamily: 'Courier New',
        fontSize: 6,
        fontWeight: '100',
        fill: '0x08F820',
        dropShadow: true,
        dropShadowColor: 0x000000,
        dropShadowAlpha: 0.7,
        dropShadowDistance: 1,
        strokeThickness: 1,
    }),
};