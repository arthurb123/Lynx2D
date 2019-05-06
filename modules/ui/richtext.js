/**
 * Lynx2D UI Rich Text
 * @constructor
 * @param {string[]} text_array - The rich text string array.
 * @param {number} x - The rich text x position.
 * @param {number} y - The rich text y position.
 * @param {number} size - The font size (can be undefined, default is 14px).
 * @param {number} color - The font color (can be undefined, default is whitesmoke).
 * @param {string} font - The font family (can be undefined, default is Verdana).
 */

this.UIRichText = function(text_array, x, y, size, color, font) {
    this.TEXT = text_array;
    this.POS = {
        X: x,
        Y: y
    };
    this.ALIGN = 'left';
    this.LINE_HEIGHT = size/4;

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
     * Shows the Rich Text.
    */
    
    this.Show = function() {
        if (this.UI_ID != undefined) return this;
        
        this.UI_ID = lx.GAME.ADD_UI_ELEMENT(this);
        
        return this;
    };

    /** 
     * Hide the Rich Text.
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
        if (size == undefined) 
            return this.SIZE;
        else 
            this.SIZE = size;
        
        return this;
    };

    /**
     * Get/Set the text line height.
     * @param {number} line_height - Sets the text line height if specified.
     * @return {number} Gets the the text line height if left empty.
    */
    
    this.LineHeight = function(line_height) {
        if (line_height == undefined) 
            return this.LINE_HEIGHT;
        else 
            this.LINE_HEIGHT = line_height;
        
        return this;
    };

    /**
     * Get/Set the Rich Text position.
     * @param {number} x - Sets the x position if specified.
     * @param {number} y - Sets the y position if specified.
     * @return {object} Gets {X,Y} if left empty.
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
     * Get/Set the Rich Text content.
     * @param {string[]} text_array - Sets the text content if specified.
     * @return {string[]} Gets the font size if left empty.
    */
    
    this.Text = function(text_array) {
        if (text_array != undefined) 
            this.TEXT = text_array;  
        else 
            return this.TEXT;
        
        return this;
    };

    /**
     * Get/Set a line of text.
     * @param {number} line - The line of the text content.
     * @param {string} text - Sets the text line if specified.
     * @return {string} Gets the line of text if the new text is left empty.
    */
    
    this.TextLine = function(line, text) {
        if (line != undefined && text != undefined)
            this.TEXT[line] = text;
        else if (line != undefined) 
            return this.TEXT[line];
        
        return this;
    };

    /**
     * Get/Set the text alignment. ('left', 'right', 'center')
     * @param {string} alignment - Sets the text alignment if specified.
     * @return {string} Gets the text alignment if left empty.
    */
    
    this.Alignment = function(alignment) {
        if (alignment == undefined) 
            return this.ALIGN;
        else 
            this.ALIGN = alignment;  
        
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
     * Get/set the Rich Text's following target.
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
    
    this.RENDER = function() {
        lx.CONTEXT.GRAPHICS.save();
        lx.CONTEXT.GRAPHICS.font = this.SIZE + 'px ' + this.FONT;
        lx.CONTEXT.GRAPHICS.fillStyle = this.COLOR;
        lx.CONTEXT.GRAPHICS.textAlign = this.ALIGN;
        
        for (let i = 0; i < this.TEXT.length; i++) {
            let offset = i*this.LINE_HEIGHT+i*this.SIZE;
            
            if (this.TARGET != undefined) {
                if (lx.GAME.FOCUS != undefined) {
                    let POS = lx.GAME.TRANSLATE_FROM_FOCUS({ X: this.TARGET.POS.X+this.POS.X, Y: this.TARGET.POS.Y+this.POS.Y });
                    lx.CONTEXT.GRAPHICS.fillText(this.TEXT[i], POS.X, POS.Y+offset);
                }
                else lx.CONTEXT.GRAPHICS.fillText(this.TEXT[i], this.TARGET.POS.X+this.POS.X, this.TARGET.POS.Y+this.POS.Y+offset);
            }
            else lx.CONTEXT.GRAPHICS.fillText(this.TEXT[i], this.POS.X, this.POS.Y+offset);
        }
        
        lx.CONTEXT.GRAPHICS.restore();
    };
    
    this.UPDATE = function() {
        
    };
};