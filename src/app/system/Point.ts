/* A Point is a standard 2d vector. The point should be immutable.
 * 
 * Method round() returns a new point whose children are integers. 
 * */

export default class Point {
    x : number = 0
    y : number = 0
    
    constructor(x : number, y : number) {
        if (x)
            this.x = x;
        if (y)
            this.y = y;
        Object.freeze(this);
    }

    equals(p : Point) : boolean {
        return (this.x == p.x) && (this.y == p.y)
    }

    round() : Point {
        return new Point(
            this.x >> 0,
            this.y >> 0
        )
    }

    multiply(j : number) : Point {
        return new Point(
            this.x * j,
            this.y * j
        )
    }

    modulo(j : number) : Point {
        return new Point(
            this.x % j,
            this.y % j
        )
    }

    floor(j : number) : Point {
        return new Point(
            (this.x / j) >> 0,
            (this.y / j) >> 0
        )
    }

    add(p : Point) : Point {
        return new Point(
            this.x + p.x,
            this.y + p.y
        )
    }

    subtract(p : Point) : Point {
        return new Point(
            this.x - p.x,
            this.y - p.y
        )
    }
};
