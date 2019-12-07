/**
 * Lynx2D Polygon Collider
 * @extends Collidable
 * @constructor
 * @param {number} x - The collider x position (or x offset).
 * @param {number} y - The collider y position (or y offset).
 * @param {Object[]} vertices - The collider vertices [{X,Y}] in local space.
 * @param {boolean} is_static - Determines if the collider can be moved (collider also gets enabled automatically if true).
 * @param {function} callback - The collision callback, provides collision data as an object (can be undefined).
 */

this.Collider = class extends Collidable {
    constructor (x, y, vertices, is_static, callback) {
        //Check for older framework usability

        if (typeof(vertices) === "number" || typeof(is_static) === "number") {
            //Older framework usability - show error and create
            //box collider

            lx.GAME.LOG.ERROR(
                'OldColliderError', 'The old arguments ' +
                '(x, y, w, h, ..) were supplied to the revised ' +
                'collider class; which now expects (x, y, vertices[], ..). ' +
                'The collider class now functions as a polygon ' +
                'collider, to create the "old" rectangular collider ' +
                'use the BoxCollider class. For now a BoxCollider object has ' +
                'been created, but to hide this error you should change ' +
                'this. Please check the documentation ' +
                'for updated objects and methods.'
            );

            return new lx.BoxCollider(x, y, arguments[2], arguments[3], arguments[4]);
        } else
            super(x, y, vertices, is_static, callback);
    }
}