/**
 * Lynx2D Ray (Experimental)
 * @constructor
 * @param {number} x - The starting x position.
 * @param {number} y - The starting y position.
 */

this.Ray = function(x, y) {
    this.POS = {
        X: x,
        Y: y
    };

    this.DIR = {
        X: 0,
        Y: 0
    };

    /** 
     * Get/Set the Ray's position.
     * @param {number} x - Sets x position if specified.
     * @param {number} y - Sets y position if specified.
     * @return {object} Gets { X, Y } if left empty.
    */
    
    this.Position = function(x, y) {
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
     * @return {object} Gets { X, Y } if left empty.
    */

    this.Direction = function(x, y) {
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

    this.Cast = function(target) {
        if (target.COLLIDER == undefined)
            return false;

        return this.CHECK_INTERSECTION_BOX(target.COLLIDER, false);
    };

    /** 
     * Cast ray to the target and get the enter point.
     * @param {GameObject} target - The target to check if the ray intersects with it.
     * @return {object} Returns {X,Y} if intersection occurred, otherwise returns false.
    */
    
    this.CastPoint = function(target) {
        if (target.COLLIDER == undefined)
            return false;

        return this.CHECK_INTERSECTION_BOX(target.COLLIDER, true, true);
    };

    /** 
     * Cast ray to the target and get the enter and leave points.
     * @param {GameObject} target - The target to check if the ray intersects with it.
     * @return {array} Returns [{X,Y}] if intersection occurred, otherwise returns false.
    */

    this.CastPoints = function(target) {
        if (target.COLLIDER == undefined)
            return false;

        return this.CHECK_INTERSECTION_BOX(target.COLLIDER, true, false);
    };

    /** 
     * Cast rays radially to the target and get the enter point.
     * @param {GameObject} target - The target to check if rays intersect with it.
     * @param {number} degrees - The amount of degrees in between rays.
     * @return {array} Returns [{X,Y}] if intersection occurred, otherwise returns [].
    */
    
    this.CastPointRadially = function(target, degrees) {
        let old_dir = this.DIR,
            points = [];
        
        for (let c = 0; c < 360; c+=degrees) {
            this.DIR = {
                X: Math.cos(c*Math.PI/180),
                Y: Math.sin(c*Math.PI/180)
            };
            
            let result = this.CHECK_INTERSECTION_BOX(target.COLLIDER, true, true);
            
            if (result)
                points.push(result);
        };
        
        this.DIR = old_dir;
        
        return points;
    };

    /** 
     * Cast rays radially to the target and get the enter and leave points.
     * @param {GameObject} target - The target to check if rays intersect with it.
     * @param {number} degrees - The amount of degrees in between rays.
     * @return {array} Returns [{X,Y}] if intersection occurred, otherwise returns [].
    */
    
    this.CastPointsRadially = function(target, degrees) {
        let old_dir = this.DIR,
            points = [];
        
        for (let c = 0; c < 360; c+=degrees) {
            this.DIR = {
                X: Math.cos(c*Math.PI/180),
                Y: Math.sin(c*Math.PI/180)
            };
            
            let result = this.CHECK_INTERSECTION_BOX(target.COLLIDER, true, false);
            
            if (result)
                points.push.apply(points, result);
        };
        
        this.DIR = old_dir;
        
        return points;
    };

    /** 
     * Cast rays radially to multiple targets and get the enter points.
     * @param {GameObject[]} targets - The targets to check if rays intersect with them.
     * @param {number} degrees - The amount of degrees in between rays.
     * @return {array} Returns [{X,Y}] if intersection occurred, otherwise returns [].
    */

    this.CastPointRadiallyMultiple = function(targets, degrees) {
        let old_dir = this.DIR,
            points = [];
        
        for (let c = 0; c < 360; c+=degrees) {
            this.DIR = {
                X: Math.cos(c*Math.PI/180),
                Y: Math.sin(c*Math.PI/180)
            };
            
            let results = [];
            
            for (let t = 0; t < targets.length; t++) {
                let result = this.CHECK_INTERSECTION_BOX(targets[t].COLLIDER, true, true);

                if (result)
                    results.push(result);
            }

            let closest = Infinity,
                closestPoint;

            for (let r = 0; r < results.length; r++) {
                let x = results[r].X-this.POS.X,
                    y = results[r].Y-this.POS.Y;

                let d = Math.sqrt(x*x + y*y);

                if (d < closest) {
                    closest = d;
                    closestPoint = results[r];
                }
            }
            
            if (closestPoint != undefined)
                points.push(closestPoint);
        };
        
        this.DIR = old_dir;
        
        return points;
    };

    this.GET_VECTOR = function() {
        return {
            X: this.POS.X,
            Y: this.POS.Y,
            X1: this.POS.X + this.DIR.X,
            Y1: this.POS.Y + this.DIR.Y
        };
    };

    this.CHECK_INTERSECTION_BOX = function(TARGET, GET_POSITIONS, GET_FIRST_POSITION) {
        let LINES = [],
            RESULT = false;

        if (TARGET.SIZE != undefined) {
            let LXT = { X: TARGET.POS.X, Y: TARGET.POS.Y, X1: TARGET.POS.X+TARGET.SIZE.W, Y1: TARGET.POS.Y },
                LYL = { X: TARGET.POS.X, Y: TARGET.POS.Y, X1: TARGET.POS.X, Y1: TARGET.POS.Y+TARGET.SIZE.H },
                LXB = { X: TARGET.POS.X, Y: TARGET.POS.Y+TARGET.SIZE.H, X1: TARGET.POS.X+TARGET.SIZE.W, Y1: TARGET.POS.Y+TARGET.SIZE.H },
                LYR = { X: TARGET.POS.X+TARGET.SIZE.W, Y: TARGET.POS.Y, X1: TARGET.POS.X+TARGET.SIZE.W, Y1: TARGET.POS.Y+TARGET.SIZE.H };
            
            if (this.POS.X < TARGET.POS.X) {
                LINES.push(LYL);
                LYL = undefined;
            } else {
                LINES.push(LYR);
                LYR = undefined;
            }
            
            if (this.POS.Y < TARGET.POS.Y) {
                LINES.push(LXT);
                LXT = undefined;
            } else {
                LINES.push(LXB);
                LXB = undefined;
            }
            
            if (LYL == undefined)
                LINES.push(LYR);
            else if (LYR == undefined)
                LINES.push(LYL);
            
            if (LXB == undefined)
                LINES.push(LXT);
            else if (LXT == undefined)
                LINES.push(LXB);
        } else 
            return RESULT;

        for (let L = 0; L < LINES.length; L++) {
            let LINE = LINES[L];

            let LINE_RESULT = this.CHECK_INTERSECTION_LINE(LINE, GET_POSITIONS);
            
            if (LINE_RESULT) {
                if (GET_POSITIONS && !RESULT)
                    RESULT = [];
                else if (!GET_POSITIONS) {
                    RESULT = true;

                    break;
                }

                if (GET_POSITIONS) 
                    RESULT.push(LINE_RESULT);
            }
        }
        
        if (GET_POSITIONS && RESULT && GET_FIRST_POSITION)
            RESULT = RESULT[0];

        return RESULT;
    };

    this.CHECK_INTERSECTION_LINE = function(LINE, GET_POSITION) {
        let VECTOR = this.GET_VECTOR();
        
        let RESULT = false,
            DEN = (LINE.X-LINE.X1) * (VECTOR.Y-VECTOR.Y1) - (LINE.Y-LINE.Y1) * (VECTOR.X-VECTOR.X1);

        if (DEN === 0)
            return false;

        let T = ((LINE.X-VECTOR.X) * (VECTOR.Y-VECTOR.Y1) - (LINE.Y-VECTOR.Y) * (VECTOR.X-VECTOR.X1)) / DEN,
            U = -((LINE.X-LINE.X1) * (LINE.Y-VECTOR.Y) - (LINE.Y-LINE.Y1) * (LINE.X-VECTOR.X)) / DEN;

        if (T > 0 && T < 1 && U > 0) {
            if (GET_POSITION) {
                RESULT = {
                    X: LINE.X + T * (LINE.X1 - LINE.X),
                    Y: LINE.Y + T * (LINE.Y1 - LINE.Y)
                };

                if (lx.GAME.FOCUS != undefined)
                    RESULT = lx.GAME.TRANSLATE_FROM_FOCUS(RESULT);
            }
            else
                RESULT = true;
        }

        return RESULT;
    };
};