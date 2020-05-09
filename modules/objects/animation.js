/**
 * Lynx2D Animation
 * @extends Showable
 * @constructor
 * @param {Sprite[]} sprite_collection - An array containing (clipped) Sprites.
 * @param {number} speed - The interval in between frames.
 */

this.Animation = class extends Showable {
    constructor (sprite_collection, speed) {
        super(0, 0);

        this.SIZE = { 
            W: 0, 
            H: 0 
        }; 
        this.SPRITES = sprite_collection;
        this.FRAME = 0;
        this.ROTATION = 0;
        this.MAX_FRAMES = sprite_collection.length;
        this.TIMER = {
            FRAMES: [],
            STANDARD: speed,
            CURRENT: 0
        };
    };

    /** 
     * Shows the Animation on the specified layer for a certain amount of times.
     * @param {number} layer - The layer the Animation should be shown on.
     * @param {number} amount - The amount of times the animation should play.
    */
    
    ShowAmount(layer, amount) {
        if (amount != undefined) {
            this.MAX_AMOUNT = amount-1;
            if (this.MAX_AMOUNT < 0)
                this.MAX_AMOUNT = 0;
        }
        
        return super.Show(layer);
    };

    /** 
     * Get/Set the Animation's size. If the size is { 0, 0 } the available Sprite size of the current frame will be used.
     * @param {number} width - Sets width if specified, also sets height if the height is not specified.
     * @param {number} height - Sets height if specified.
     * @return {Object} Gets { W, H } if left empty.
    */
    
    Size(width, height) {
        if (width == undefined && height == undefined) {
            let SIZE = this.SIZE;

            if (SIZE.width === 0 &&
                SIZE.height === 0)
                SIZE = this.GET_CURRENT_FRAME().Size();

            return SIZE;
        }
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
     * Get/set the Animation frame interval.
     * @param {number} speed - Sets the frame interval if specified.
     * @return {number} Gets frame interval if left empty.
    */
    
    Speed(speed) {
        if (speed != undefined) 
            this.TIMER.STANDARD = speed;
        else 
            return this.TIMER.STANDARD;
        
        return this;
    };

    /** 
     * Get/Set the Animation's rotation (in radians).
     * @param {number} angle - Sets rotation angle if specified.
     * @return {Object} Gets rotation angle if specified.
    */

    Rotation(angle) {
        if (angle == undefined)
            return this.ROTATION;
        else
            this.ROTATION = angle;

        return this;
    };

    //Private methods
    
    GET_CURRENT_FRAME() {
        return this.SPRITES[this.FRAME];
    };
    
    RENDER(POS, SIZE, OPACITY) {
        let FRAME = this.GET_CURRENT_FRAME();
        if (FRAME == undefined)
            return;

        FRAME.ROTATION = this.ROTATION;

        lx.CONTEXT.GRAPHICS.save();

        if (OPACITY == undefined)
            OPACITY = 1;
        lx.CONTEXT.GRAPHICS.globalAlpha = OPACITY;

        if (this.BUFFER_ID === -1) 
            FRAME.RENDER(POS, SIZE, OPACITY);
        else {
            POS  = this.Position();
            SIZE = this.Size();

            if (lx.GAME.ON_SCREEN(POS, SIZE))
                FRAME.RENDER(
                    lx.GAME.TRANSLATE_FROM_FOCUS(POS), 
                    SIZE, 
                    OPACITY
                );
        }

        lx.CONTEXT.GRAPHICS.restore();
    };
    
    UPDATE() {
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
                        delete this.MAX_AMOUNT;
                        this.Hide();
                    } else 
                        this.MAX_AMOUNT--;
                }
            }
        }
        
        if (this.LOOPS != undefined)
            this.LOOPS();
    };
};