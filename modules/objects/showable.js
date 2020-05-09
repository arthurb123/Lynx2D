/**
 * Lynx2D Showable base class (cannot be instantiated)
 * @constructor
 * @param {number} x - The x position (can be undefined, default is 0).
 * @param {number} y - The y position (can be undefined, default is 0).
 */

class Showable {
    constructor(x, y) {
        this.BUFFER_ID = -1;
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
     * Shows the showable on the specified layer.
     * @param {number} layer - The layer the showable should be shown on (can be undefined, default is 0).
    */

    Show(layer) {
        if (this.BUFFER_ID != -1) 
            this.Hide();

        //Check if layer was specified

        if (layer == undefined)
            layer = 0;

        //Add to buffer
        
        this.BUFFER_ID = lx.GAME.ADD_TO_BUFFER(this, layer);
        this.BUFFER_LAYER = layer;

        //Check for overloading, this means
        //older framework method calls are present

        if (arguments.length > 1)
            lx.GAME.LOG.ERROR(
                'ShowOverloadError', 'Too many arguments ' +
                'were supplied to the Show function, ' +
                'this might indicate that older method ' +
                'calls are present that are not being ' +
                'supported anymore (E.G: Animation Show ' +
                'method). Please check the documentation ' +
                'for updated objects and methods.'
            );
        
        return this;
    };
    
    /** 
     * Hides the showable.
    */
    
    Hide() {
        if (this.BUFFER_ID == -1) 
            return;

        //Remove from buffer if possible
        
        if (lx.GAME.BUFFER[this.BUFFER_LAYER] != undefined)
            lx.GAME.BUFFER[this.BUFFER_LAYER][this.BUFFER_ID] = undefined;
        
        this.BUFFER_ID = -1;
        
        return this;
    };

    /**
     * Get/Set the showable's position, or offset if following.
     * @param {number} x - Sets the x position if specified.
     * @param {number} y - Sets the y position if specified.
     * @return {object} Gets {X,Y} if left empty.
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
     * Adjust the showable's position.
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
     * Places a callback function in the showable's update loop.
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