import Aspect from '../../constants/Aspect';
import Physics from '../../interfaces/Physics';
import Point from '../../system/Point';
import Stage from '../../interfaces/Stage';

export default class PlatformerPhysics implements Physics {
    private static g : number = 0.5

    public xvel : number = 0
    public yvel : number = 0
    public ground : boolean = false

    constructor(public stage : Stage,
                private weight: number,
                private maxyvel : number,
                public width : number,
                public height : number) {;}
    
    inrange(point : Point, other : Point) {
        return (Math.abs(point.x - other.x) < this.width) && (Math.abs(point.y - other.y) < this.height);
    }

    public step(point : Point, asp : Aspect) : Point {
        if (this.isSolid(point, asp))
            return point;

        let newx = point.x + this.xvel;
        let newy = point.y;

        if (this.xvel !== 0) {
            /* This construct is a bit weird... essentially we're trying to
             * keep the scope of newxvel limited to the block, and we only
             * want to zero out the x-velocity if solidity is ever detected.
             * I would like to do this without repeating the loop condition,
             * though...
             * */   
            if (this.isSolid(new Point(newx, newy), asp)) {
                let newxvel = Math.abs(this.xvel);
                const signx = Math.sign(this.xvel);
                do {
                    if (newxvel > 0.1) {
                        newxvel -= 0.1;
                        newx = point.x + signx*newxvel;
                    } else {
                        newx = point.x;
                        break;
                    }
                } while (this.isSolid(new Point(newx, newy), asp))
                this.xvel = 0;
            }
        }

        this.yvel = this.yvel + this.weight * PlatformerPhysics.g;
        if (this.yvel > this.maxyvel)
            this.yvel = this.maxyvel;
        newy += + this.yvel;
        this.ground = false;
        if (this.yvel !== 0) {
            if (this.isSolid(new Point(point.x, newy), asp)) {
                let newyvel = Math.abs(this.yvel);
                const signy = Math.sign(this.yvel);
                do {
                    if (newyvel > 0.1) {
                        newyvel -= 0.1;
                        newy = point.y + signy*newyvel;
                    } else {
                        newy = point.y;
                        break;
                    }
                } while (this.isSolid(new Point(point.x, newy), asp))
                this.yvel = 0;
                this.ground = true;
            }
        }
        while (this.isSolid(new Point(newx, newy), asp)) {
            newy = newy - 0.1;
        }
        return new Point(newx, newy);
    }

    private isSolid(pt : Point, asp : Aspect) : boolean {
        const upwardMomentum = this.yvel <= 0;
        const checks : [Point, boolean][] = [[pt, upwardMomentum]];
        if (this.xvel < 0)
            checks.push(
                [new Point(pt.x - this.width/2, pt.y - this.height/2), true]
            );
        if (this.xvel > 0)
            checks.push(
                [new Point(pt.x + this.width/2, pt.y - this.height/2), true]
            );
        if (this.yvel > 0 || this.xvel < 0) 
            checks.push(
                [new Point(pt.x - this.width/2, pt.y), upwardMomentum]
            );
        if (this.yvel > 0 || this.xvel > 0) 
            checks.push(
                [new Point(pt.x + this.width/2, pt.y), upwardMomentum]
            );
        if (this.yvel < 0 || this.xvel < 0)
            checks.push(
                [new Point(pt.x - this.width/2, pt.y - this.height), true]
            );
        if (this.yvel < 0 || this.xvel > 0)
            checks.push([new Point(pt.x + this.width/2, pt.y - this.height), true]);
        return checks.map((e) => {return this.stage.isSolid(e[0], asp, e[1])})
                     .some((e) => {return e});
    }
}

