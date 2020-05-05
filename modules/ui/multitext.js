/**
 * Lynx2D UI Multi Text
 * @extends UIElement
 * @constructor
 * @param {string[]|UIText[]} text_array - The array of text (strings, UIText), UIText elements do not comply to the styling of the MultiText.
 * @param {number} x - The text x position (can be undefined, default is 0).
 * @param {number} y - The text y position (can be undefined, default is 0).
 * @param {number} size - The font size (can be undefined, default is 14px).
 * @param {number} color - The font color (can be undefined, default is whitesmoke).
 * @param {string} font - The font family (can be undefined, default is Verdana).
 */

this.UIMultiText = class extends UIElement {
    constructor(text_array, x, y, size, color, font) {
        super(x, y);

        this.SIZE  = (size  == undefined ? 14 : size);
        this.COLOR = (color == undefined ? 'whitesmoke' : color);
        this.FONT  = (font  == undefined ? 'Verdana' : font);

        this.TEXT  = text_array;
        this.ALIGN = 'left';
        this.LINE_HEIGHT = this.SIZE/4;
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
     * Get/Set the text line height.
     * @param {number} line_height - Sets the text line height if specified.
     * @return {number} Gets the the text line height if left empty.
    */
    
    LineHeight(line_height) {
        if (line_height == undefined) 
            return this.LINE_HEIGHT;
        else 
            this.LINE_HEIGHT = line_height;
        
        return this;
    };

    /**
     * Get/Set the multiline text content.
     * @param {string[]|UIText[]} text_array - Sets the text content if specified.
     * @return {string[]|UIText[]} Gets the text content if left empty.
    */
    
    Text(text_array) {
        if (text_array != undefined) 
            this.TEXT = text_array;  
        else 
            return this.TEXT;
        
        return this;
    };

    /**
     * Get/Set a line of text.
     * @param {number} line - The number of the text line.
     * @param {string|UIText} text - Sets the text line if specified.
     * @return {string|UIText} Gets the line of text if the new text is left empty.
    */
    
    TextLine(line, text) {
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
        if (!POS)
            POS = { X: 0, Y: 0 };
        if (!OPACITY)
            OPACITY = 1;

        let SCALE    = (lx.GAME.SCALE === 1 ? 1 : lx.GAME.SCALE * .75);
        let GRAPHICS = lx.CONTEXT.GRAPHICS;

        //Configure canvas state

        GRAPHICS.save();
        GRAPHICS.font        = this.SIZE * SCALE + 'px ' + this.FONT;
        GRAPHICS.fillStyle   = this.COLOR;
        GRAPHICS.textAlign   = this.ALIGN;
        GRAPHICS.globalAlpha = OPACITY;

        if (this.SHADOW != undefined) {
            GRAPHICS.shadowColor   = this.SHADOW.C;
            GRAPHICS.shadowOffsetX = this.SHADOW.X;
            GRAPHICS.shadowOffsetY = this.SHADOW.Y;
        }

        //Setup text rendering method

        let OFFSET_Y = 0;
        const RENDER_TEXT = (LINE, X, Y) => {
            switch (typeof LINE) {
                case 'object':
                    try {
                        LINE.RENDER({ X: X, Y: Y+OFFSET_Y }, this.OPACITY);

                        OFFSET_Y += this.LINE_HEIGHT + LINE.SIZE * SCALE;
                    }
                    catch {
                        lx.GAME.LOG.ERROR(
                            'MultiTextInvalidLineError', 
                            'The text line #' + i + ' is not a valid UIText object.'
                        );
                    }
                    break;
                default:
                    GRAPHICS.fillText(LINE, X, Y+OFFSET_Y);

                    OFFSET_Y += this.LINE_HEIGHT + this.SIZE * SCALE;
                    break;
            }
        };

        //Repositioning
        
        let SELF_POS = this.Position();
        POS.X += SELF_POS.X;
        POS.Y += SELF_POS.Y;

        if (this.TARGET)
            POS = lx.GAME.TRANSLATE_FROM_FOCUS(POS);

        //Render text lines

        for (let i = 0; i < this.TEXT.length; i++) {
            let LINE = this.TEXT[i];

            if (this.TARGET) {
                let TARGET_POS = this.TARGET.Position();

                POS = lx.GAME.TRANSLATE_FROM_FOCUS({ 
                    X: TARGET_POS.X+POS.X, 
                    Y: TARGET_POS.Y+POS.Y 
                });
            }

            RENDER_TEXT(LINE, POS.X, POS.Y);
        }
        
        //Restore canvas state

        GRAPHICS.restore();
    };
    
    UPDATE() {
        if (this.LOOPS)
            this.LOOPS();
    };
};

//Older framework support

this.UIRichText = class {
    constructor(text_array, x, y, size, color, font) {
        lx.GAME.LOG.ERROR(
            'OldMultiTextError', 'The RichText ' +
            'user interface object has been renamed ' +
            'to MultiText. For now a MultiText object has ' +
            'been created, but to hide this error you should ' +
            'change this. Please check the documentation ' +
            'for updated objects and methods.'
        );

        return new lx.UIMultiText(text_array, x, y, size, color, font);
    }
}