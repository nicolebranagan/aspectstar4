declare var require: any 

import Interaction from '../interfaces/Interaction';
const FontFaceObserver = require('fontfaceobserver');
import { DEFAULT_TEXT_STYLE, DEFAULT_TITLE_STYLE, CustomFonts } from './Fonts';
import Interactions from '../data/Interactions';

// For fonts that aren't loaded by us, but can be assumed to always be present.
// Only use web-safe fonts on this list.
const SafeFonts = [
    'Courier New'
];

export default () => {
    const customFonts : string[] = Object.keys(Interactions)
        .reduce<Interaction[]>((array, key) => {
            array.push(...Interactions[key]);
            return array;
        }, [])
        .map(dialogue => dialogue.font)
        .filter(font => font)
        .map(font => CustomFonts[font].fontFamily)
        .reduce<string[]>((fonts, font) => {
            if (Array.isArray(font)) {
                fonts.push(...font);
            } else {
                fonts.push(font);
            }
            return fonts;
        }, [])
        .filter(font => SafeFonts.indexOf(font) === -1)

    const relevantFonts = [
        DEFAULT_TEXT_STYLE.fontFamily, 
        DEFAULT_TITLE_STYLE.fontFamily, 
        ...customFonts
    ].filter((value, index, array) => array.indexOf(value) === index);
    return Promise.all(relevantFonts.map(font => new FontFaceObserver(font).load()));
};
