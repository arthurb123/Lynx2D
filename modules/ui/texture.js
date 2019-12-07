/**
 * Lynx2D UI Texture
 * @extends UIElement
 * @constructor
 * @param {Sprite} sprite - The Sprite for the Texture, or a color string.
 * @param {number} x - The texture x position (can be undefined, default is 0).
 * @param {number} y - The texture y position (can be undefined, default is 0).
 * @param {number} w - The texture width (can be undefined, assumes Sprite or parent width).
 * @param {number} h - The texture height (can be undefined, assumes Sprite or parent height).
 */

this.UITexture = class extends UIElement {
    constructor(sprite, x, y, w, h) {
        super(x, y);

        this.SPRITE = sprite
        this.SIZE = {
            W: 0,
            H: 0
        };

        if (w != undefined && h != undefined) 
            this.SIZE = {
                W: w,
                H: h
            };
        else if (typeof(sprite) !== 'string')
            this.SIZE = sprite.SPRITE_SIZE;
    }

    /** 
     * Get/Set the Texture size.
     * @param {number} width - Sets width if specified, also sets height if the height is not specified.
     * @param {number} height - Sets height if specified.
     * @return {Object} Gets { W, H } if left empty.
    */
    
    Size(width, height) {
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

    //Private methods
    
    RENDER(POS, SIZE, OPACITY) {
        if (OPACITY == undefined)
            OPACITY = 1;
        if (SIZE == undefined)
            SIZE = {
                W: this.SIZE.W,
                H: this.SIZE.H
            };

        if (POS == undefined && this.TARGET != undefined) 
            POS = lx.GAME.TRANSLATE_FROM_FOCUS({ X: this.TARGET.POS.X+this.OFFSET.X, Y: this.TARGET.POS.Y+this.OFFSET.Y });
        else if (POS == undefined)
            POS = this.POS;
        else {
            POS.X += this.POS.X;
            POS.Y += this.POS.Y;
        }
        
        if (typeof this.SPRITE === 'string')
        {
            lx.CONTEXT.GRAPHICS.save();
            lx.CONTEXT.GRAPHICS.fillStyle = this.SPRITE;
            lx.CONTEXT.GRAPHICS.globalAlpha = OPACITY;
            lx.CONTEXT.GRAPHICS.fillRect(POS.X, POS.Y, SIZE.W, SIZE.H);
            lx.CONTEXT.GRAPHICS.restore();
        }
        else
            this.SPRITE.RENDER(POS, SIZE, OPACITY);
    };
    
    UPDATE() {
        if (this.LOOPS != undefined)
            this.LOOPS();
    };
};