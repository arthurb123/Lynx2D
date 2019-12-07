/**
 * Lynx2D Box Collider
 * @extends Collidable
 * @constructor
 * @param {number} x - The box collider x position (or x offset).
 * @param {number} y - The box collider y position (or y offset).
 * @param {number} w - The box collider width.
 * @param {number} h - The box collider height.
 * @param {boolean} is_static - Determines if the collider can be moved (collider also gets enabled automatically if true).
 * @param {function} callback - The collision callback, provides collision data as an object (can be undefined).
 */

this.BoxCollider = class extends Collidable {
    constructor (x, y, w, h, is_static, callback) {
        //Call super (with empty vertices)

        super(x, y, [], is_static, callback);

        //Set box size

        this.SIZE = {
            W: w,
            H: h
        };

        //Create vertices according to the width and height

        this.CREATE_VERTICES();
    }

    /**
     * Get/Set the box collider rectangular size.
     * @param {Number} w - Sets the box collider width.
     * @param {Number} h - Sets the box collider height.
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
        this.VERTICES = [
            { X: 0, Y: 0 },
            { X: this.SIZE.W, Y: 0 },
            { X: this.SIZE.W, Y: this.SIZE.H },
            { X: 0, Y: this.SIZE.H }
        ];
        this.CALCULATE_CENTER();
    }
};