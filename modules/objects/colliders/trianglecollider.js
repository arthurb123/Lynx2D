/**
 * Lynx2D Triangle Collider
 * @extends Collidable
 * @constructor
 * @param {number} x - The triangle collider x position (or x offset).
 * @param {number} y - The triangle collider y position (or y offset).
 * @param {number} w - The triangle collider width.
 * @param {number} h - The triangle collider height.
 * @param {boolean} is_static - Determines if the collider can be moved (collider also gets enabled automatically if true).
 * @param {function} callback - The collision callback, provides collision data as an object (can be undefined).
 */

this.TriangleCollider = class extends Collidable {
    constructor (x, y, w, h, is_static, callback) {
        //Call super (with empty vertices)

        super(x, y, [], is_static, callback);

        //Set triangle size

        this.SIZE = {
            W: w,
            H: h
        };

        //Create vertices

        this.CREATE_VERTICES();
    }

    /**
     * Get/Set the triangle collider size.
     * @param {Number} w - Sets the triangle collider width.
     * @param {Number} h - Sets the triangle collider height.
     * @returns {Object} Gets {W,H} if left empty.
     */

    Size(w, h) {
        if (w == undefined || h == undefined)
            return this.SIZE;
        else {
            this.SIZE = { 
                W: w, 
                H: h
            };
            this.CREATE_VERTICES();
        }

        return this;
    }

    //Private methods

    CREATE_VERTICES() {
        let vertices = [
            { X: 0, Y: this.SIZE.H },
            { X: this.SIZE.W/2, Y: 0 },
            { X: this.SIZE.W, Y: this.SIZE.H }
        ];

        this.VERTICES = vertices;
        this.CALCULATE_CENTER();
    }
};