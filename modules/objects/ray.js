/**
 * Lynx2D Ray (Experimental)
 * @constructor
 * @param {number} x - The starting x position.
 * @param {number} y - The starting y position.
 */

this.Ray = class {
    constructor(x, y) {
        this.POS = {
            X: x,
            Y: y
        };
    
        this.DIR = {
            X: 0,
            Y: 0
        };
    };

    /** 
     * Get/Set the Ray's position.
     * @param {number} x - Sets x position if specified.
     * @param {number} y - Sets y position if specified.
     * @return {Object} Gets { X, Y } if left empty.
    */
    
    Position(x, y) {
        if (x != undefined && y != undefined)
            this.POS = {
                X: x,
                Y: y
            };
        else 
            return this.POS;
        
        return this;
    };

    /** 
     * Get/Set the Ray's direction (does not have to be a unit vector).
     * @param {number} x - Sets x direction if specified.
     * @param {number} y - Sets y direction if specified.
     * @return {Object} Gets { X, Y } if left empty.
    */

    Direction(x, y) {
        if (x != undefined && y != undefined) {
            this.DIR = {
                X: x - this.POS.X,
                Y: y - this.POS.Y
            };

            let MAGNITUDE = Math.sqrt(this.DIR.X*this.DIR.X + this.DIR.Y*this.DIR.Y);

            this.DIR.X /= MAGNITUDE;
            this.DIR.Y /= MAGNITUDE;
        } else 
            return this.DIR;
        
        return this;
    };

    /** 
     * Cast ray to the target.
     * @param {GameObject} target - The target to check if the ray intersects with it.
     * @return {boolean} Returns true/false.
    */

    Cast(target) {
        if (target.BUFFER_ID === -1)
            return false;

        return this.CHECK_INTERSECTION(target);
    };

    /**
     * Cast rays to the targets, and if intersection(s) occured returns the target with the closest cast distance.
     * @param {GameObject[]} targets - The array of targets to check.
     * @return {GameObject} Returns the intersected target with the closest cast distance, undefined if no intersection occurred.
    */
    CastClosest(targets) {
        let closest;
        let closestIntersection = Infinity;

        for (let t = 0; t < targets.length; t++) {
            if (target.BUFFER_ID === -1)
                continue;

            let intersection = this.GET_INTERSECTION(targets[t]);

            if (intersection == undefined ||
                intersection.TMAX < 0 || 
                intersection.TMIN > intersection.TMAX)
                continue;

            if (intersection.TMIN < closestIntersection) {
                closest = targets[t];
                closestIntersection = intersection.TMIN;
            }
        }

        return closest;
    };

    //Private methods

    CHECK_INTERSECTION(TARGET) {
        let INTERSECTION = this.GET_INTERSECTION(TARGET);

        if (INTERSECTION == undefined ||
            INTERSECTION.TMAX < 0 || 
            INTERSECTION.TMIN > INTERSECTION.TMAX)
            return false;

        return true;
    };

    GET_INTERSECTION(TARGET) {
        let END = {
            X: TARGET.POS.X+TARGET.SIZE.W,
            Y: TARGET.POS.Y+TARGET.SIZE.H
        };

        let T1 = (TARGET.POS.X - this.POS.X) * (1 / this.DIR.X),
            T2 = (END.X - this.POS.X) * (1 / this.DIR.X),
            T3 = (TARGET.POS.Y - this.POS.Y) * (1 / this.DIR.Y),
            T4 = (END.Y - this.POS.Y) * (1 / this.DIR.Y);

        let TMIN = Math.max(Math.min(T1, T2), Math.min(T3, T4)),
            TMAX = Math.min(Math.max(T1, T2), Math.max(T3, T4));

        return {
            TMIN: TMIN,
            TMAX: TMAX
        };
    };
};