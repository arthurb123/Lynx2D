/**
 * Lynx2D UI Text
 * @extends UIElement
 * @constructor
 * @param {string} text - The text.
 * @param {number} x - The text x position (can be undefined, default is 0).
 * @param {number} y - The text y position (can be undefined, default is 0).
 * @param {number} size - The font size (can be undefined, default is 14px).
 * @param {number} color - The font color (can be undefined, default is whitesmoke).
 * @param {string} font - The font family (can be undefined, default is Verdana).
 */

this.UIText = class extends UIElement {
    constructor(text, x, y, size, color, font) {
        super(x, y);

        this.TEXT = text;
        this.ALIGN = 'left';
    
        this.SIZE = (size == undefined ? 14 : size);
        this.COLOR = (color == undefined ? 'whitesmoke' : color);
        this.FONT = (font == undefined ? 'Verdana' : font);
    }

    /**
     * Get/Set the font size.
     * @param {number} size - Sets the font size if specified.
     * @return {number} Gets the font size if left empty.
    */

    Size(size) {
        if (size == undefined) 
            return this.SIZE;
        else 
            this.SIZE = size;
        
        return this;
    };

    /**
     * Get/Set the Text content.
     * @param {string} text - Sets the text content if specified.
     * @return {string} Gets the text content if left empty.
    */
    
    Text(text) {
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
    
    Alignment(alignment) {
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
    
    Color(color) {
        if (color == undefined) 
            return this.COLOR;
        else 
            this.COLOR = color;
        
        return this;
    };

    /**
     * Get/Set the font family.
     * @param {string} font - Sets the font family if specified.
     * @return {string} Gets the font family if left empty.
    */
    
    Font(font) {
        if (font == undefined) 
            return this.FONT;
        else 
            this.FONT = font;
        
        return this;
    };
    
    /**
     * Set the text shadow.
     * @param {string} color - The color of the shadow.
     * @param {number} offset_x - The shadow x offset.
     * @param {number} offset_y - The shadow y offset.
    */
    
    SetShadow(color, offset_x, offset_y) {
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
    
    ClearShadow() {
        this.SHADOW = undefined;
        
        return this;
    };

    //Private methods
    
    RENDER(POS, OPACITY) {
        if (OPACITY == undefined)
            OPACITY = 1;

        lx.CONTEXT.GRAPHICS.save();
        lx.CONTEXT.GRAPHICS.font = this.SIZE*(lx.GAME.SCALE === 1 ? 1 : lx.GAME.SCALE*.75) + 'px ' + this.FONT;
        lx.CONTEXT.GRAPHICS.fillStyle = this.COLOR;
        lx.CONTEXT.GRAPHICS.textAlign = this.ALIGN;
        lx.CONTEXT.GRAPHICS.globalAlpha = OPACITY;
        
        if (this.SHADOW != undefined) {
            lx.CONTEXT.GRAPHICS.shadowColor = this.SHADOW.C;
            lx.CONTEXT.GRAPHICS.shadowOffsetX = this.SHADOW.X;
            lx.CONTEXT.GRAPHICS.shadowOffsetY = this.SHADOW.Y;
        }
        
        if (POS == undefined)
            if (this.TARGET != undefined) {
                let POS = lx.GAME.TRANSLATE_FROM_FOCUS({ X: this.TARGET.POS.X+this.OFFSET.X, Y: this.TARGET.POS.Y+this.OFFSET.Y });
                lx.CONTEXT.GRAPHICS.fillText(this.TEXT, POS.X, POS.Y);
            }
            else lx.CONTEXT.GRAPHICS.fillText(this.TEXT, this.POS.X, this.POS.Y);
        else
            lx.CONTEXT.GRAPHICS.fillText(this.TEXT, POS.X+this.POS.X, POS.Y+this.POS.Y);
        
        lx.CONTEXT.GRAPHICS.restore();
    };
    
    UPDATE() {
        if (this.LOOPS != undefined)
            this.LOOPS();
    };
};