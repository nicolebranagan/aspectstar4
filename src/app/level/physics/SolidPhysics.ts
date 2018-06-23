import Physics from '../../interfaces/Physics';
import Point from '../../system/Point';
import Stage from '../Stage';

export default class SolidPhysics implements Physics {
    constructor(public stage : Stage,
        public width : number,
        public height : number) {;}

    inrange(point : Point, other : Point) {
        return (Math.abs(point.x - other.x) < this.width/2) && ((point.y - other.y) < this.height);
    }
};
