/**
 * Lynx2D UI ProgressBar
 * @extends UIElement
 * @constructor
 * @param {UITexture | string} background - The background, can be a Texture or a color string (can be undefined, default is the color silver).
 * @param {UITexture | string} filling - The progress filling, can be a Texture or a color string (can be undefined, default is the color whitesmoke).
 * @param {number} x - The progressbar x position (can be undefined, default is 0).
 * @param {number} y - The progressbar y position (can be undefined, default is 0).
 * @param {number} w - The progressbar width (can be undefined, default is 128).
 * @param {number} h - The progressbar height (can be undefined, default is 24).
 */

this.UIProgressBar = class extends UIElement {
    constructor(background, filling, x, y, w, h) {
        super(x, y);

        this.BACKGROUND = background || 'silver';
        this.FILLING = filling || 'whitesmoke';
        this.PROGRESS = 0;
        this.SIZE = {
            W: 128,
            H: 24
        };

        if (w != undefined && h != undefined) 
            this.SIZE = {
                W: w,
                H: h
            };
    }

    /** 
     * Get/Set the ProgressBar size.
     * @param {number} width - Sets width if specified.
     * @param {number} height - Sets height if specified.
     * @return {Object} Gets { W, H } if left empty.
    */
    
    Size(width, height) {
        if (width == undefined || height == undefined) 
            return this.SIZE;
        else 
            this.SIZE = {
                W: width,
                H: height
            };
        
        return this;
    };
    
    /**
     * Get/Set the ProgressBar progress percentage (0-100).
     * @param {number} percentage - Sets progress percentage if specified.
     * @return {number} Gets progress percentage if left empty.
     */

    Progress(percentage) {
        if (percentage == undefined)
            return this.PROGRESS;
        else {
            if (percentage < 0)
                percentage = 0;
            else if (percentage > 100)
                percentage = 100;

            this.PROGRESS = percentage;
        }

        return this;
    };

    /**
     * Get/Set the ProgressBar background.
     * @param {UITexture | string} background - The background, can be a Texture or a color string.
     * @return {UITexture | string} Gets background if left empty.
     */

    Background(background) {
        if (background == undefined)
            return this.BACKGROUND;
        else
            this.BACKGROUND = background;

        return this;
    };

    /**
     * Get/Set the ProgressBar progress filling.
     * @param {UITexture | string} filling - The filling, can be a Texture or a color string.
     * @return {UITexture | string} Gets filling if left empty.
     */

    Filling(filling) {
        if (filling == undefined)
            return this.FILLING;
        else
            this.FILLING = filling;

        return this;
    };

    //Private methods
    
    RENDER(POS, SIZE, OPACITY) {
        if (!POS)
            POS = { X: 0, Y: 0 };
        if (!SIZE)
            SIZE = this.Size();
        if (OPACITY == undefined)
            OPACITY = 1;

        let SELF_POS = this.Position();
        POS.X += SELF_POS.X;
        POS.Y += SELF_POS.Y;

        if (this.TARGET)
            POS = lx.GAME.TRANSLATE_FROM_FOCUS(POS);
        
        //Render background

        if (typeof this.BACKGROUND === 'string')
        {
            lx.CONTEXT.GRAPHICS.save();
            lx.CONTEXT.GRAPHICS.fillStyle = this.BACKGROUND;
            lx.CONTEXT.GRAPHICS.globalAlpha = OPACITY;
            lx.CONTEXT.GRAPHICS.fillRect(POS.X, POS.Y, SIZE.W, SIZE.H);
            lx.CONTEXT.GRAPHICS.restore();
        }
        else
            this.BACKGROUND.RENDER(POS, SIZE, OPACITY);

        //Render filling

        let FACTOR_PROGRESS = this.PROGRESS/100;
        if (typeof this.FILLING === 'string')
        {
            lx.CONTEXT.GRAPHICS.save();
            lx.CONTEXT.GRAPHICS.fillStyle = this.FILLING;
            lx.CONTEXT.GRAPHICS.globalAlpha = OPACITY;
            lx.CONTEXT.GRAPHICS.fillRect(POS.X, POS.Y, SIZE.W*FACTOR_PROGRESS, SIZE.H);
            lx.CONTEXT.GRAPHICS.restore();
        }
        else
            this.FILLING.RENDER(
                POS, 
                {
                    W: SIZE.W * FACTOR_PROGRESS,
                    H: SIZE.H
                }, 
                OPACITY
            );
    };
    
    UPDATE() {
        if (this.LOOPS != undefined)
            this.LOOPS();
    };
};