/**
 * Lynx2D Collidable base class (cannot be instantiated)
 * @constructor
 * @param {number} x - The collidable x position (or x offset).
 * @param {number} y - The collidable y position (or y offset).
 * @param {Object[]} vertices - The collidable vertices [{X,Y}] in local space.
 * @param {boolean} is_static - Determines if the collider can be moved (collider also gets enabled automatically if true).
 * @param {function} callback - The collision callback, provides collision data as an object (can be undefined).
 */

class Collidable {
    constructor (x, y, vertices, is_static, callback) {
        //Check for older framework usability

        if (typeof(vertices) === "number" || arguments.length > 5) {
            lx.GAME.LOG.ERROR(
                'OldColliderError', 'The old arguments ' +
                '(x, y, w, h) were supplied to the revised ' +
                'collider class; which now expects (x, y, vertices[]). ' +
                'The base collider class now functions as a polygon ' +
                'collider, to create the "old" rectangular collider ' +
                'use the BoxCollider class. Please check the documentation ' +
                'for updated objects and methods.'
            );

            return;
        }

        //Create collider

        this.POS = {
            X: x,
            Y: y
        };
        this.OFFSET = {
            X: 0,
            Y: 0
        };
        this.ROTATION = 0;
        this.VERTICES = vertices;
        this.STATIC = is_static;
        this.SOLID = true;
        this.ENABLED = false;

        //Calculate center position in local space

        this.CALCULATE_CENTER();

        //Setup callback
    
        if (callback != undefined) 
            this.OnCollide = callback;
        else 
            this.OnCollide = function() {};

        //Automatically enable collider if it's static

        if (is_static) 
            this.Enable();
    };
    
    /** 
     * Calculates the collider's convex hull in a rectangular shape and returns the size of this rectangle.
     * @return {Object} Gets { W, H }.
    */

    Size() {
        //Setup necessary values

        let smallestX = Infinity, biggestX = -Infinity;
        let smallestY = Infinity, biggestY = -Infinity;

        //For every vertex, rotate in local space and
        //check if it exceeds the smallest or biggest values

        for (let v = 0; v < this.VERTICES.length; v++) {
            let rotVertex = lx.ROTATE_AROUND(
                this.VERTICES[v],
                this.CENTER,
                this.ROTATION
            );

            if (rotVertex.X < smallestX) smallestX = rotVertex.X;
            if (rotVertex.X > biggestX)  biggestX  = rotVertex.X;
            if (rotVertex.Y < smallestY) smallestY = rotVertex.Y;
            if (rotVertex.Y > biggestY)  biggestY  = rotVertex.Y;
        }

        return {
            W: Math.abs(smallestX) + Math.abs(biggestX),
            H: Math.abs(smallestY) + Math.abs(biggestY)
        };
    };

    /** 
     * Get/Set if the Collider is static. (Can not be moved by other colliders)
     * @param {boolean} is_static - Sets if the collider is static if specified.
     * @return {boolean} Gets if the collider is static if left empty.
    */
    
    Static(is_static) {
        if (is_static == undefined) 
            return this.STATIC;
        else 
            this.STATIC = is_static;
        
        return this;
    };

    /** 
     * Get/Set if the Collider is solid. (Does not pass through other colliders)
     * @param {boolean} is_solid - Sets if the collider is solid if specified.
     * @return {boolean} Gets if the collider is solid if left empty.
    */
    
    Solid(is_solid) {
        if (is_solid == undefined) 
            return this.SOLID;
        else 
            this.SOLID = is_solid;
        
        return this;
    };

    /** 
     * Get/Set the Collider's position (or offset).
     * @param {number} x - Sets x position if specified.
     * @param {number} y - Sets y position if specified.
     * @return {Object} Gets { X, Y } if left empty.
    */
    
    Position(x, y) {
        if (x == undefined || y == undefined) 
            return this.POS;
        else 
            this.POS = {
                X: x,
                Y: y
            };
        
        return this;
    };

    /**
     * Adjust the collider's position.
     * @param {number} x - The position x delta.
     * @param {number} y - The position y delta.
     */

    Move(x, y) {
        this.POS.X += x;
        this.POS.Y += y;

        return this;
    };

    /** Gets the collider position in screen space.
     * @return {object} Gets {X,Y} position in screen space
     */

    ScreenPosition() {
        return lx.GAME.TRANSLATE_FROM_FOCUS(this.Position());
    };

    /** 
     * Get/Set the collider rotation (in radians).
     * @param {number} angle - Sets new rotation if specified.
     * @return {number} Gets rotation if left empty.
    */
    
   Rotation(angle) {
        if (angle == undefined)
            return this.ROTATION;
        else 
            this.ROTATION = angle;
        
        return this;
    };

    /** 
     * Get/Set the Collider's identifier.
     * @param {string} ID - Sets identifier if specified.
     * @return {string} Gets identifier if left empty.
    */
    
    Identifier(ID) {
        if (ID == undefined) 
            return this.IDENTIFIER;
        else 
            this.IDENTIFIER = ID;
        
        return this;
    };

    /** 
     * Enables the Collider.
    */
    
    Enable() {
        if (this.ENABLED) 
            return;
        
        this.COLLIDER_ID = lx.GAME.ADD_COLLIDER(this);
        
        this.ENABLED = true;
        
        return this;
    };

    /** 
     * Disables the Collider.
    */
    
    Disable() {
        if (!this.ENABLED) 
            return;
        
        lx.GAME.COLLIDERS[this.COLLIDER_ID] = undefined;
        this.COLLIDER_ID = undefined;
        
        this.ENABLED = false;
        
        return this;
    };

    //Private methods

    CALCULATE_CENTER() {
        //Check if vertices are empty

        if (this.VERTICES.length === 0) {
            this.CENTER = { X: 0, Y: 0 };
            return;
        }

        //Calculate center point of vertices

        let TOT_X = 0, TOT_Y = 0;
        for (let V = 0; V < this.VERTICES.length; V++) {
            TOT_X += this.VERTICES[V].X;
            TOT_Y += this.VERTICES[V].Y;
        }
        this.CENTER = {
            X: TOT_X / this.VERTICES.length,
            Y: TOT_Y / this.VERTICES.length
        };
    };

    GET_POSITIONED_SHAPE() {
        //Create a new array with the vertices and
        //the current collider position

        let posShape = [];

        for (let v = 0; v < this.VERTICES.length; v++) {
            //Rotate vertex

            let rotVertex = lx.ROTATE_AROUND(
                this.VERTICES[v],
                this.CENTER,
                this.ROTATION
            );

            //Position rotated vertex

            let posRotVertex = new SAT.Vector(
                rotVertex.X,
                rotVertex.Y
            );

            //Add vertex to shape

            posShape.push(posRotVertex);
        }

        //Return the new positioned shape array

        return new SAT.Polygon(
            new SAT.Vector(this.POS.X, this.POS.Y),
            posShape
        );
    };

    ON_COLLISION(collider, direction) {
        //Callback on collision

        this.OnCollide({
            self: this,
            trigger: collider,
            direction: direction,
            gameObject: lx.FindGameObjectWithCollider(collider),
            static: collider.STATIC,
            solid: collider.SOLID
        });
    };

    GET_COLLISION_DIRECTION(collider) {
        //Calculate center distance

        let POS1 = this.Position(),
            POS2 = collider.Position();

        let SIZE1 = this.Size(),
            SIZE2 = collider.Size();

        //Check which directional distance is the smallest
        //and return the according direction

        let lowest, distances = [{
            tag: 'left',
            actual: Math.abs(POS1.X-POS2.X-SIZE2.W)
        },
        {
            tag: 'right',
            actual: Math.abs(POS2.X-POS1.X-SIZE1.W)
        },
        {
            tag: 'up',
            actual: Math.abs(POS1.Y-POS2.Y-SIZE2.H)
        },
        {
            tag: 'down',
            actual: Math.abs(POS2.Y-POS1.Y-SIZE1.H)
        }];

        //Check which directional distance is the smallest
        
        distances.forEach(function (obj) {
            if (lowest == undefined || 
                obj.actual < lowest.actual) 
                lowest = obj;
        });

        //Return calculated direction
        
        return lowest.tag;
    };
    
    CHECK_COLLISION(collider) {
        //If the collider has not been fully initialized yet, stop collision detection.

        if (this.POS.X != 0 && 
            this.POS.Y != 0 && 
            this.POS.X == this.OFFSET.X && 
            this.POS.Y == this.OFFSET.Y) 
            return false;

        //If both colliders are static, ignore collision

        if (this.STATIC && collider.STATIC)
            return;

        //Get positioned shapes

        let shapeA = this.GET_POSITIONED_SHAPE();
        let shapeB = collider.GET_POSITIONED_SHAPE();
        
        //Perform SAT using SAT.js

        let response = new SAT.Response();
        let collided = SAT.testPolygonPolygon(shapeA, shapeB, response);

        if (!collided)
            return false;

        //Calculate collision direction

        let direction = this.GET_COLLISION_DIRECTION(collider);

        //Invert direction for other collider

        let n_direction;
        switch (direction) {
            case 'right': n_direction = 'left';  break;
            case 'left':  n_direction = 'right'; break;
            case 'down':  n_direction = 'up';    break;
            case 'up':    n_direction = 'down';  break;
        }
        
        //Handle solidity displacement

        if (collider.SOLID && this.SOLID && !collider.STATIC)
        {
            let go = lx.FindGameObjectWithCollider(collider);
            if (go != undefined) {
                go.Move(
                    response.overlapV.x, 
                    response.overlapV.y
                );
                collider.Move(
                    response.overlapV.x,
                    response.overlapV.y
                );
            }
        }
        else if (this.SOLID && collider.SOLID && !this.STATIC)
        {
            let go = lx.FindGameObjectWithCollider(this);
            if (go != undefined) {
                go.Move(
                    -response.overlapV.x,
                    -response.overlapV.y
                );
                this.Move(
                    -response.overlapV.x,
                    -response.overlapV.y
                );
            }
        }

        //Handle collision(s)

        this.ON_COLLISION(collider, direction);
        collider.ON_COLLISION(this, n_direction);
        
        //Return true

        return true;
    };

    RENDER() {
        //Get positioned shape
        
        let SHAPE = this.GET_POSITIONED_SHAPE().calcPoints;

        //Draw all vertices

        for (let V = 0; V < SHAPE.length; V++) {
            //Calculate necessary positions

            let START = lx.GAME.TRANSLATE_FROM_FOCUS({ 
                X: SHAPE[V].x, 
                Y: SHAPE[V].y 
            });
            let END   = lx.GAME.TRANSLATE_FROM_FOCUS({ 
                X: SHAPE[(V+1) % SHAPE.length].x, 
                Y: SHAPE[(V+1) % SHAPE.length].y 
            });

            //Stroke line from start to end

            lx.CONTEXT.GRAPHICS.save();
            lx.CONTEXT.GRAPHICS.beginPath();
            lx.CONTEXT.GRAPHICS.moveTo(START.X, START.Y);
            lx.CONTEXT.GRAPHICS.lineTo(END.X, END.Y);
            lx.CONTEXT.GRAPHICS.stroke();
            lx.CONTEXT.GRAPHICS.restore();
        }
    };
};