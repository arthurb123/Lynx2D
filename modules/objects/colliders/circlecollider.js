/**
 * Lynx2D Circle Collider
 * @extends Collidable
 * @constructor
 * @param {number} x - The circle collider x position (or x offset).
 * @param {number} y - The circle collider y position (or y offset).
 * @param {number} radius - The circle collider radius.
 * @param {boolean} is_static - Determines if the collider can be moved (collider also gets enabled automatically if true).
 * @param {function} callback - The collision callback, provides collision data as an object (can be undefined).
 */

this.CircleCollider = class extends Collidable {
    constructor (x, y, radius, is_static, callback) {
        //Call super (with empty vertices)

        super(x, y, [], is_static, callback);

        //Complexity determines how much vertices the
        //circle shape should exist out of, default
        //is a complexity of 12

        this.COMPLEXITY = 12;
        this.RADIUS     = radius;

        //Create vertices according to the radius

        this.CREATE_VERTICES();
    }

    /**
     * Get/Set the circle collider complexity, this determines the amount of vertices in the circle.
     * @param {Number} complexity - Sets the circle collider complexity.
     * @returns {Number} Gets complexity if left empty.
     */

    Complexity(complexity) {
        if (complexity == undefined)
            return this.COMPLEXITY;
        else {
            this.COMPLEXITY = complexity;
            this.CREATE_VERTICES();
        }

        return this;
    };

    /**
     * Get/Set the circle collider radius.
     * @param {Number} radius - Sets the circle collider radius.
     * @returns {Number} Gets radius if left empty.
     */

    Radius(radius) {
        if (radius == undefined) 
            return this.RADIUS;
        else {
            this.RADIUS = radius;
            this.CREATE_VERTICES();
        }

        return this;
    };

    //Private methods

    CREATE_VERTICES() {
        let vertices = [];
        let pi2 = Math.PI * 2;
        for (let c = 0; c < this.COMPLEXITY; c++) {
            vertices[c] = {
                X: this.RADIUS + this.RADIUS * Math.cos(c / this.COMPLEXITY * pi2),
                Y: this.RADIUS + this.RADIUS * Math.sin(c / this.COMPLEXITY * pi2)
            };
        }

        this.VERTICES = vertices;
        this.CALCULATE_CENTER();
    }
};