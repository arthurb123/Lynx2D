/**
 * Lynx2D UI Texture
 * @constructor
 * @param {Sprite} sprite - The Sprite for the Texture.
 * @param {number} x - The texture x position.
 * @param {number} y - The texture y position.
 * @param {number} w - The texture width.
 * @param {number} h - The texture height.
 */

this.UITexture = function(sprite, x, y, w, h) {
    this.SPRITE = sprite
    this.POS = {
        X: x,
        Y: y
    };
    if (w != undefined && h != undefined) this.SIZE = {
        W: w,
        H: h
    }

    /** 
     * Shows the Texture.
    */

    this.Show = function() {
        if (this.UI_ID != undefined) return this;
        
        this.UI_ID = lx.GAME.ADD_UI_ELEMENT(this);
        
        return this;
    };

    /** 
     * Hide the Texture.
    */
    
    this.Hide = function() {
        if (this.UI_ID == undefined) return this;
        
        lx.GAME.UI[this.UI_ID] = undefined;
        this.UI_ID = undefined;
        
        return this;
    };

    /** 
     * Get/Set the Texture's size.
     * @param {number} width - Sets width if specified, also sets height if the height is not specified.
     * @param {number} height - Sets height if specified.
     * @return {object} Gets { W, H } if left empty.
    */
    
    this.Size = function(width, height) {
        if (width == undefined) 
            return this.SIZE;
        else {
            if (height == undefined)
                height = width;

            this.SIZE = {
                W: width,
                H: height
            };
        }
        
        return this;
    };

    /** 
     * Get/Set the Texture's position.
     * @param {number} x - Sets x position if specified.
     * @param {number} y - Sets y position if specified.
     * @return {object} Gets { X, Y } if left empty.
    */
    
    this.Position = function(x, y) {
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
     * Get/set the Texture's following target.
     * @param {GameObject} target - Sets following target if specified.
     * @return {GameObject} Gets following target if left empty.
    */
    
    this.Follows = function(target) {
        this.TARGET = target;
        
        return this;
    };

    /** 
     * Stop following the target.
    */
    
    this.StopFollowing = function() {
        this.TARGET = undefined;
        
        return this;
    };
    
    this.RENDER = function() {
        if (this.TARGET != undefined) this.SPRITE.RENDER(lx.GAME.TRANSLATE_FROM_FOCUS({ X: this.TARGET.POS.X+this.POS.X, Y: this.TARGET.POS.Y+this.POS.Y }), this.SIZE);
        else this.SPRITE.RENDER(this.POS, this.SIZE);
    };
    
    this.UPDATE = function() {
        
    };
};