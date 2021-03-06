/**
 * Lynx2D UI Base element (cannot be instantiated)
 * @constructor
 * @param {number} x - The element x position (can be undefined, default is 0).
 * @param {number} y - The element y position (can be undefined, default is 0).
 */

class UIElement {
    constructor(x, y) {
        this.POS = {
            X: (x == undefined ? 0 : x),
            Y: (y == undefined ? 0 : y)
        };
        this.OFFSET = {
            X: this.POS.X,
            Y: this.POS.Y
        };
    }

    /** 
     * Shows the UI element.
    */
    
    Show() {
        if (this.UI_ID != undefined) 
            return this;
        
        this.UI_ID = lx.GAME.ADD_UI_ELEMENT(this);
        
        return this;
    };

    /** 
     * Hide the UI element.
    */

    Hide() {
        if (this.UI_ID == undefined) 
            return this;
        
        delete lx.GAME.UI[this.UI_ID];
        delete this.UI_ID;
        
        return this;
    };

    /**
     * Get/Set the UI element's position.
     * @param {number} x - Sets the x position if specified.
     * @param {number} y - Sets the y position if specified.
     * @return {Object} Gets {X,Y} if left empty.
    */

    Position(x, y) {
        if (x == undefined || y == undefined) {
            if (this.TARGET) {
                let TARGET_POS = this.TARGET.Position();

                return {
                    X: TARGET_POS.X+this.OFFSET.X,
                    Y: TARGET_POS.Y+this.OFFSET.Y
                };
            }

            return this.POS;
        }
        else {
            let POS = this.Position();

            let DX = x - POS.X;
            let DY = y - POS.Y;
            
            this.Move(DX, DY);
        }
        
        return this;
    };

    /** Gets the UI element's position in screen space.
     * @return {object} Gets {X,Y} position in screen space
     */

    ScreenPosition() {
        return lx.GAME.TRANSLATE_FROM_FOCUS(this.Position());
    };

    /**
     * Get/Set the UI element's offset. The offset is used when following.
     * @param {number} x - The offset x delta.
     * @param {number} y - The offset y delta.
     */

    Offset(x, y) {
        if (x == undefined || y == undefined)
            return this.OFFSET;
        else
            this.OFFSET = {
                X: x,
                Y: y
            };

        return this;
    };

    /**
     * Adjust the UI element's position, or offset if following.
     * @param {number} x - The position x delta.
     * @param {number} y - The position y delta.
     */

    Move(x, y) {
        //Adjust position if not following

        if (!this.TARGET) {
            this.POS.X += x;
            this.POS.Y += y;
        }

        //Always adjust offset

        this.OFFSET.X += x;
        this.OFFSET.Y += y;

        return this;
    };

    /** 
     * Get/set the following target.
     * @param {GameObject} target - Sets following target if specified.
     * @return {GameObject} Gets following target if left empty.
    */
    
    Follows(target) {
        if (target != undefined) 
            this.TARGET = target;
        else 
            return this.TARGET;
        
        return this;
    };

    /** 
     * Stop following the target.
    */

    StopFollowing() {
        delete this.TARGET;
        
        return this;
    };

    /** 
     * Places a callback function in the UI element's update loop.
     * @param {function} callback - The callback to be looped.
    */

    Loops(callback) {
        this.LOOPS = callback;
        
        return this;
    };

    /** 
     * Clears the update callback function being looped.
    */

    ClearLoops() {
        this.LOOPS = undefined;
        
        return this;
    };
};