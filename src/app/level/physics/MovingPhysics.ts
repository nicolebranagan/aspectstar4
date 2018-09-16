import Aspect from '../../constants/Aspect';
import LevelObject from '../../interfaces/LevelObject';
import Physics from '../../interfaces/Physics';
import Point from '../../system/Point';
import Stage from '../Stage';
import { DEFAULT_TEXT_STYLE } from '../../text/Fonts';

export default class MovingPhysics implements Physics {
    constructor(public stage : Stage,
        public width : number,
        public height : number
    ) {;}

    step(point : Point, asp : Aspect, objects : LevelObject[], self : LevelObject, delta : Point) : Point {
        const move : LevelObject[] = [];
        for (const obj of objects) {
            if (obj !== self) {
                if (Math.round(obj.point.y) == Math.round(point.y - 16) 
                    && Math.abs(point.x - obj.point.x) < this.width/2
                    && (asp == Aspect.NONE || asp == obj.aspect)) {
                    move.push(obj);
                }
            }
        }

        move.forEach(e => {
            e.point = e.point.add(delta);
            if (delta.y) {
                e.point = e.point.round();
            }
        });
        return point.add(delta);
    }

    inrange(point : Point, other : Point) {
        return (Math.abs(point.x - other.x) < this.width/2) && ((point.y - other.y) < this.height);
    }
};
