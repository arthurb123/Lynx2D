/**
 * Lynx2D Animation
 * @constructor
 * @param {Sprite[]} sprite_collection - An array containing (clipped) Sprites.
 * @param {number} speed - The interval in between frames.
 */

this.Animation = function (sprite_collection, speed) {
    this.SPRITES = sprite_collection;
    this.FRAME = 0;
    this.ROTATION = 0;
    this.MAX_FRAMES = sprite_collection.length;
    this.TIMER = {
        FRAMES: [],
        STANDARD: speed,
        CURRENT: 0
    };
    this.BUFFER_ID = -1;
    this.BUFFER_LAYER = 0;
    this.UPDATES = true;

    /** 
     * Shows the Animation on the specified layer.
     * @param {number} layer - The layer the Animation should be shown on.
     * @param {number} x - The x position of the Animation.
     * @param {number} y - The y position of the Animation.
     * @param {number} w - The width of the Animation (can be undefined, or be the amount if h and amount are undefined).
     * @param {number} h - The height of the Animation (can be undefined, this will assume the size of the frames).
     * @param {number} amount - The amount of times the animation should play, can be undefined.
    */
    
    this.Show = function(layer, x, y, w, h, amount) {
        if (this.BUFFER_ID != -1) 
            this.Hide();
        
        this.POS = {
            X: x,
            Y: y
        };

        if (h != undefined)
            this.SIZE = {
                W: w,
                H: h
            };
        else
            this.SIZE = undefined;

        this.BUFFER_ID = lx.GAME.ADD_TO_BUFFER(this, layer);
        this.BUFFER_LAYER = layer;
        
        if (amount != undefined) 
            this.MAX_AMOUNT = amount;
        
        return this;
    };

    /** 
     * Hide the Animation.
    */
    
    this.Hide = function() {
        if (this.BUFFER_ID == -1) 
            return;
        
        if (lx.GAME.BUFFER[this.BUFFER_LAYER] != undefined)
            lx.GAME.BUFFER[this.BUFFER_LAYER][this.BUFFER_ID] = undefined;
        
        this.BUFFER_ID = -1;
        this.BUFFER_LAYER = 0;
        
        return this;
    };

     /** 
     * Get/set the Animation frame interval.
     * @param {number} speed - Sets the frame interval if specified.
     * @return {number} Gets frame interval if left empty.
    */
    
    this.Speed = function(speed) {
        if (speed != undefined) 
            this.TIMER.STANDARD = speed;
        else 
            return this.TIMER.STANDARD;
        
        return this;
    };
    
    /** 
     * Places a callback function in the Animation's update loop.
     * @param {function} callback - The callback to be looped.
    */
    
    this.Loops = function(callback) {
        this.LOOPS = callback;
        
        return this;
    };
    
    /** 
     * Clears the update callback function being looped.
    */
    
    this.ClearLoops = function() {
        this.LOOPS = undefined;
        
        return this;
    };

    /** 
     * Get/Set the Animation's rotation (in radians).
     * @param {number} angle - Sets rotation angle if specified.
     * @return {object} Gets rotation angle if specified.
    */

    this.Rotation = function(angle) {
        if (angle == undefined)
            return this.ROTATION;
        else
            this.ROTATION = angle;

        return this;
    };
    
    this.GET_CURRENT_FRAME = function() {
        return this.SPRITES[this.FRAME];
    };
    
    this.RENDER = function(POS, SIZE, OPACITY) {
        this.SPRITES[this.FRAME].ROTATION = this.ROTATION;

        if (this.BUFFER_ID == -1) 
            this.SPRITES[this.FRAME].RENDER(POS, SIZE, OPACITY);
        else 
            this.SPRITES[this.FRAME].RENDER(lx.GAME.TRANSLATE_FROM_FOCUS(this.POS), this.SIZE, OPACITY);
    };
    
    this.UPDATE = function() {
        if (this.TIMER.FRAMES.length === this.MAX_FRAMES)
            this.TIMER.STANDARD = this.TIMER.FRAMES[this.FRAME];
        
        this.TIMER.CURRENT++;
        
        if (this.TIMER.CURRENT >= this.TIMER.STANDARD) {
            this.TIMER.CURRENT = 0;
            this.FRAME++;
            
            if (this.FRAME >= this.MAX_FRAMES) {
                this.FRAME = 0;
                
                if (this.MAX_AMOUNT != undefined) {
                    if (this.MAX_AMOUNT == 0) {
                        this.MAX_AMOUNT = undefined;
                        this.Hide();
                    } else this.MAX_AMOUNT--;
                }
            }
        }
        
        if (this.LOOPS != undefined)
            this.LOOPS();
    };
};