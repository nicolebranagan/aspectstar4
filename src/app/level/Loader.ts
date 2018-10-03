import LevelObject from '../interfaces/LevelObject';
import Point from '../system/Point';
import Stage from '../interfaces/Stage';

/**
 * Loader will load in the objects
 */
export default function Loader( stage : Stage, objects : ((number | boolean)[] | (string | number)[])[]) : Promise<LevelObject>[] {
    return objects.map(async e => await parseObject(stage, e));
}

async function parseObject(stage : Stage, data : any[]) : Promise<LevelObject> {
    const objectDictionary = (await import(/* webpackChunkName: "objects" */ '../data/Objects')).default;
    const objdata = objectDictionary[data[0]];
    const point = new Point(data[1], data[2]);

    if (objdata.type == "saveicon") {
        const SaveIcon = (await import(/* webpackChunkName: "save-icon" */ './objects/SaveIcon')).default;
        return new SaveIcon(stage, point, objdata.rect);
    }
    else if (objdata.type == "bell") {
        const Bell = (await import(/* webpackChunkName: "bell" */ './objects/Bell')).default;
        return new Bell(stage, point, objdata.rect);
    }
    else if (objdata.type == "aspecttile") {
        const AspectTile = (await import(/* webpackChunkName: "aspect-tile" */ './objects/AspectTile')).default;
        return new AspectTile(stage, point, objdata.aspect, objdata.rect);
    }
    else if (objdata.type == "platform") {
        const Platform = (await import(/* webpackChunkName: "platform" */ './objects/Platform')).default;
        return new Platform(stage, point, objdata.aspect, objdata.texture, objdata.rect, objdata.rect2, data[3], data[4]);
    }
    else if (objdata.type == "square") {
        const Square = (await import(/* webpackChunkName: "square" */ './objects/Square')).default;
        return new Square(stage, point, objdata.aspect, objdata.texture, objdata.rect, objdata.rect2, objdata.xor);        
    } 
    else if (objdata.type === "character") {
        const Character = (await import(/* webpackChunkName: "character" */ './objects/Character')).default;
        return new Character(point, objdata.row, data[3], objdata.oneTimeUse);
    }
    else if (objdata.type === "victory") {
        const Victory = (await import(/* webpackChunkName: "character" */ './objects/Victory')).default;
        return new Victory(point, data[3]);
    }
};
