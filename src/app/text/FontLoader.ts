declare var require: any;
const FontFaceObserver = require("fontfaceobserver");
import {
  DEFAULT_TEXT_STYLE,
  DEFAULT_TITLE_STYLE,
  DEFAULT_SYSTEM_STYLE,
  WIN_LEVEL_NAME_STYLE,
  CustomFonts
} from "./Fonts";

// For fonts that aren't loaded by us, but can be assumed to always be present.
// Only use web-safe fonts on this list.
const SafeFonts = ["Courier New"];

export default () => {
  const customFonts = Object.keys(CustomFonts).map(
    key => CustomFonts[key].fontFamily
  );

  const relevantFonts = [
    DEFAULT_TEXT_STYLE.fontFamily,
    DEFAULT_TITLE_STYLE.fontFamily,
    DEFAULT_SYSTEM_STYLE.fontFamily,
    WIN_LEVEL_NAME_STYLE.fontFamily,
    ...customFonts
  ];

  const promises = relevantFonts
    .filter((value, index, array) => array.indexOf(value) === index)
    .reduce<string[]>((fonts, font) => {
      // This is literally FlatMap
      if (Array.isArray(font)) {
        fonts.push(...font);
      } else {
        fonts.push(font);
      }
      return fonts;
    }, [])
    .filter(font => SafeFonts.indexOf(font) === -1)
    .map(font => new FontFaceObserver(font).load());

  return Promise.all(promises);
};
