/**
 * Lynx2D Canvas
 * @constructor
 * @param {number} width - The canvas width.
 * @param {number} height - The canvas height.
 */

 this.Canvas = class {
    constructor (width, height) {
        this.CANVAS = document.createElement('canvas');
        this.CANVAS.width = width;
        this.CANVAS.height = height;

        this.GRAPHICS = this.CANVAS.getContext('2d');
    };

    /** 
     * Get the canvas size.
     * @return {Object} Gets the canvas size {W, H}.
    */

    Size() {
        return {
            W: this.CANVAS.width,
            H: this.CANVAS.height
        };
    };

    /** 
     * Draw a Sprite on the canvas.
     * @param {Sprite} sprite - The sprite that will be drawn.
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} w - The width, if left undefined will use the Sprite's width.
     * @param {number} h - The height, if left undefined will use the Sprite's height.
     * @param {number} opacity - The opacity, if left undefined will use the Sprite's opacity.
    */

    DrawSprite(sprite, x, y, w, h, opacity) {
        if (w == undefined && h == undefined) {
            let spriteSize = sprite.Size();
            w = spriteSize.W;
            h = spriteSize.H;
        }

        if (opacity == undefined)
            opacity = sprite.Opacity();

        sprite.RENDER(
            {
                X: x,
                Y: y
            },
            {
                W: w,
                H: h
            },
            opacity,
            this.GRAPHICS
        );
    };
    
    /** 
     * Draw to the canvas using a custom callback.
     * @param {function} cb - The callback which will provide the drawing context.
    */

    Draw(cb) {
        cb(this.GRAPHICS);
    };
 };