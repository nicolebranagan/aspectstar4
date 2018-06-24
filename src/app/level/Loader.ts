import LevelObject from '../interfaces/LevelObject';
import Point from '../system/Point';
import Terrain from './Terrain';
import Level from './Level';
import Stage from './Stage';

import AspectTile from './objects/AspectTile';
import Platform from './objects/Platform';
import Square from './objects/Square';
import SaveIcon from './objects/SaveIcon';
import Bell from './objects/Bell';

import Objects from '../data/Objects';
import Worldfile from '../data/Worldfile';

/**
 * Loader will load everything from the worldfile
 */
export default function Loader(self : Level, index : number) : { terrain : Terrain, stage : Stage, objects : LevelObject[]} {
    const terrain = new Terrain(self, Worldfile.levels[index]);
    const stage = new Stage(Worldfile.levels[index]);
    const objects = Worldfile.levels[index].objects.map(e => parseObject(stage, e));
    return {
        terrain,
        stage,
        objects
    }
}

function parseObject(stage : Stage, data : any[]) : LevelObject {
    const objdata = Objects[data[0]];
    const point = new Point(data[1], data[2]);
    if (objdata.type == "saveicon") {
        return new SaveIcon(stage, point, objdata.rect);
    }
    else if (objdata.type == "bell") {
        return new Bell(stage, point, objdata.rect);
    }
    else if (objdata.type == "aspecttile") {
        return new AspectTile(stage, point, objdata.aspect, objdata.rect);
    }
    else if (objdata.type == "platform") {
        return new Platform(stage, point, objdata.aspect, objdata.texture, objdata.rect, objdata.rect2, data[3], data[4]);
    }
    else if (objdata.type == "square") {
        return new Square(stage, point, objdata.aspect, objdata.texture, objdata.rect, objdata.rect2, objdata.xor);        
    }

    return null;
};
