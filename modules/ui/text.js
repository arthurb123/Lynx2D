/**
 * Lynx2D UI Text
 * @constructor
 * @param {string} text - The text.
 * @param {number} x - The text x position.
 * @param {number} y - The text y position.
 * @param {number} size - The font size (can be undefined, default is 14px).
 * @param {number} color - The font color (can be undefined, default is whitesmoke).
 * @param {string} font - The font family (can be undefined, default is Verdana).
 */

this.UIText = function(text, x, y, size, color, font) {
    this.TEXT = text;
    this.POS = {
        X: x,
        Y: y
    };
    this.ALIGN = 'left';

    if (font != undefined) 
        this.FONT = font;
    else 
        this.FONT = 'Verdana';
    if (color != undefined) 
        this.COLOR = color;
    else 
        this.COLOR = 'whitesmoke';
    if (size != undefined) 
        this.SIZE = size;
    else 
        this.SIZE = 14;

    /** 
     * Shows the Text.
    */
    
    this.Show = function() {
        if (this.UI_ID != undefined) return this;
        
        this.UI_ID = lx.GAME.ADD_UI_ELEMENT(this);
        
        return this;
    };

    /** 
     * Hide the Text.
    */
    
    this.Hide = function() {
        if (this.UI_ID == undefined) return this;
        
        lx.GAME.UI[this.UI_ID] = undefined;
        this.UI_ID = undefined;
        
        return this;
    };

    /**
     * Get/Set the font size.
     * @param {number} size - Sets the font size if specified.
     * @return {number} Gets the font size if left empty.
    */

    this.Size = function(size) {
        if (size == undefined) return this.SIZE;
        else this.SIZE = size;
        
        return this;
    };
    
    /**
     * Get/Set the Text position.
     * @param {number} x - Sets the x position if specified.
     * @param {number} y - Sets the y position if specified.
     * @return {object} Gets {X,Y} if left empty.
    */

    this.Position = function(x, y) {
        if (x == undefined || y == undefined) return this.POS;
        else this.POS = {
            X: x,
            Y: y
        };
        
        return this;
    };

    /**
     * Get/Set the Text content.
     * @param {string} text - Sets the text content if specified.
     * @return {string} Gets the font size if left empty.
    */
    
    this.Text = function(text) {
        if (text != undefined) 
            this.TEXT = text;  
        else 
            return this.TEXT;
        
        return this;
    };

    /**
     * Get/Set the text alignment. ('left', 'right', 'center')
     * @param {string} alignment - Sets the text alignment if specified.
     * @return {string} Gets the text alignment if left empty.
    */
    
    this.Alignment = function(alignment) {
        if (alignment == undefined) return this.ALIGN;
        else this.ALIGN = alignment;  
        
        return this;
    };

    /**
     * Get/Set the font color.
     * @param {string} color - Sets the font color if specified.
     * @return {string} Gets the font color if left empty.
    */
    
    this.Color = function(color) {
        if (color == undefined) return this.COLOR;
        else this.COLOR = color;
        
        return this;
    };

    /**
     * Get/Set the font family.
     * @param {string} font - Sets the font family if specified.
     * @return {string} Gets the font family if left empty.
    */
    
    this.Font = function(font) {
        if (font == undefined) return this.FONT;
        else this.FONT = font;
        
        return this;
    };
    
    /**
     * Set the text shadow.
     * @param {string} color - The color of the shadow.
     * @param {number} offset_x - The shadow x offset.
     * @param {number} offset_y - The shadow y offset.
    */
    
    this.SetShadow = function(color, offset_x, offset_y) {
        this.SHADOW = {
            C: color,
            X: offset_x,
            Y: offset_y
        };
        
        return this;
    };
    
    /**
     * Clear the text shadow.
    */
    
    this.ClearShadow = function() {
        this.SHADOW = undefined;
        
        return this;
    };

    /** 
     * Get/set the Text's following target.
     * @param {GameObject} target - Sets following target if specified.
     * @return {GameObject} Gets following target if left empty.
    */
    
    this.Follows = function(target) {
        if (target != undefined) this.TARGET = target;
        else return this.TARGET;
        
        return this;
    };

    /** 
     * Stop following the target.
    */
    
    this.StopFollowing = function() {
        this.TARGET = undefined;
        
        return this;
    };
    
    /** 
     * Places a callback function in the UIText's update loop.
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
    
    this.RENDER = function() {
        lx.CONTEXT.GRAPHICS.save();
        lx.CONTEXT.GRAPHICS.font = this.SIZE + 'px ' + this.FONT;
        lx.CONTEXT.GRAPHICS.fillStyle = this.COLOR;
        lx.CONTEXT.GRAPHICS.textAlign = this.ALIGN;
        
        if (this.SHADOW != undefined) {
            lx.CONTEXT.GRAPHICS.shadowColor = this.SHADOW.C;
            lx.CONTEXT.GRAPHICS.shadowOffsetX = this.SHADOW.X;
            lx.CONTEXT.GRAPHICS.shadowOffsetY = this.SHADOW.Y;
        }
        
        if (this.TARGET != undefined) {
            if (lx.GAME.FOCUS != undefined) {
                let POS = lx.GAME.TRANSLATE_FROM_FOCUS({ X: this.TARGET.POS.X+this.POS.X, Y: this.TARGET.POS.Y+this.POS.Y });
                lx.CONTEXT.GRAPHICS.fillText(this.TEXT, POS.X, POS.Y);
            }
            else lx.CONTEXT.GRAPHICS.fillText(this.TEXT, this.TARGET.POS.X+this.POS.X, this.TARGET.POS.Y+this.POS.Y);
        }
        else lx.CONTEXT.GRAPHICS.fillText(this.TEXT, this.POS.X, this.POS.Y);
        
        lx.CONTEXT.GRAPHICS.restore();
    };
    
    this.UPDATE = function() {
        if (this.LOOPS != undefined)
            this.LOOPS();
    };
};