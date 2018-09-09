import Physics from '../../interfaces/Physics';
import Point from '../../system/Point';

export default class NullPhysics implements Physics {
    inrange(point : Point, other : Point) : boolean {
        return false;
    }
};
