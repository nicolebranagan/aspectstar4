import LevelObject from '../interfaces/LevelObject';
import Point from '../system/Point';
import Terrain from './Terrain';
import Level from './Level';
import Stage from './Stage';

import Objects from '../data/Objects';
import Worldfile from '../data/Worldfile';

/**
 * Loader will load everything from the worldfile
 */
export default function Loader(self : Level, index : number) : { terrain : Terrain, stage : Stage, objects : Promise<LevelObject>[]} {
    const terrain = new Terrain(self, Worldfile.levels[index]);
    const stage = new Stage(Worldfile.levels[index]);
    const objects = Worldfile.levels[index].objects.map(async e => await parseObject(stage, e));
     return {
        terrain,
        stage,
        objects
    }
}

async function parseObject(stage : Stage, data : any[]) : Promise<LevelObject> {
    const objdata = Objects[data[0]];
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
};
