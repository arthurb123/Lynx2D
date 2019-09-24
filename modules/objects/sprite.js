/**
 * Lynx2D Sprite
 * @constructor
 * @param {string | Image | Canvas | HTMLCanvasElement} source - The source to an image file (can also be an image, Lynx2D or HTML canvas).
 * @param {number} c_x - The clip x can be a number, a callback function for once the sprite has loaded, or be left undefined.
 * @param {number} c_y - The clip y position, can be left undefined.
 * @param {number} c_w - The clip width, can be left undefined.
 * @param {number} c_h - The clip height, can be left undefined.
 * @param {function} cb - a callback function for once the sprite has loaded, can be left undefined.
 */

this.Sprite = class {
    constructor (source, c_x, c_y, c_w, c_h, cb) {
        this.CLIPPED_COLOR_OVERLAYS = {};
        this.SPRITE_SIZE = { W: 0, H: 0 };
        this.ROTATION = 0;
        
        //Check if no clip but a 
        //callback is provided (compact callback)

        if (c_x != undefined && 
            typeof c_x === 'function') {
            cb = c_x;
            c_x = undefined;
        }
        
        //Set clip if specified

        if (c_x != undefined || 
            c_y != undefined || 
            c_w != undefined || 
            c_h != undefined) 
            this.CLIP = {
                X: c_x,
                Y: c_y,
                W: c_w,
                H: c_h
            };
      
        //Set source

        this.CALLBACK = cb;
        this.Source(source);
    };

    /** 
     * Get the Sprite's size or current clipped size.
     * @return {object} Gets { W, H }.
    */
    
    Size() {
        if (this.CLIP != undefined) 
            return {
                W: this.CLIP.W,
                H: this.CLIP.H
            };
        else 
            return {
                W: this.IMG.width,
                H: this.IMG.height
            };
    };

    /** 
     * Get/Set the Sprite's source.
     * @param {string | Image | Canvas | HTMLCanvasElement} src - Sets image (source) if specified.
     * @return {string} Gets image source if available and left empty.
    */
    
    Source(src) {
        if (src == undefined) {
            if (this.IMG.src == undefined) {
                lx.GAME.LOG.ERROR('SpriteSourceError', 'Sprite has no source.');
                return;
            }

            return this.IMG.src;
        }
        else {
            let typeOf = typeof src;

            //Load image if the source is a string

            if (typeOf === 'string') {
                this.IMG = new Image();
                
                let SPRITE = this;
                this.IMG.onload = function() {
                    SPRITE.SPRITE_SIZE.W = SPRITE.IMG.width;
                    SPRITE.SPRITE_SIZE.H = SPRITE.IMG.height;

                    if (SPRITE.CALLBACK != undefined)
                        SPRITE.CALLBACK(SPRITE);
                };
                
                this.IMG.src = src;
            } 
            
            //Otherwise check if it is a Lynx2D canvas
            //or a HTML canvas or HTML image.

            else 
                if (src.CANVAS != undefined)
                    this.IMG = src.CANVAS;
                else
                    this.IMG = src;
        }
        
        return this;
    };

    /** 
     * Get/Set the clip of the Sprite.
     * @param {number} c_x - Sets clip x position if specified.
     * @param {number} c_y - Sets clip y position if specified.
     * @param {number} c_w - Sets clip width if specified.
     * @param {number} c_h - Sets clip height if specified.
     * @return {object} Gets { X, Y, W, H } if left empty.
    */
    
    Clip(c_x, c_y, c_w, c_h) {
        if (c_x == undefined || 
            c_y == undefined || 
            c_w == undefined || 
            c_h == undefined) 
            return this.CLIP;
        else 
            this.CLIP = {
                X: c_x,
                Y: c_y,
                W: c_w,
                H: c_h
            };
        
        return this;
    };

    /** 
     * Get/Set the Sprite's rotation (in radians).
     * @param {number} angle - Sets rotation angle if specified.
     * @return {object} Gets rotation angle if specified.
    */
    
    Rotation(angle) {
        if (angle == undefined) 
            return this.ROTATION;
        else 
            this.ROTATION = angle;
        
        return this;
    };

    /** 
     * Get/Set the Sprite's opacity.
     * @param {number} opacity - Sets opacity if specified (0-1). 
     * @return {number} Gets opacity if left empty.
    */
    
    Opacity(factor) {
        if (factor == undefined) 
            return this.OPACITY;
        else 
            this.OPACITY = factor;
        
        return this;
    };

    /** 
     * Displays a color overlay on the Sprite.
     * @param {string} color - The color to be overlayed.
     * @param {number} duration - The duration of the color overlay, can be undefined.
    */

    ShowColorOverlay(color, duration) {
        if (this.COLOR_OVERLAY == undefined && 
            color == undefined)
            return this;

        this.SET_COLOR_OVERLAY(color);

        this.SHOW_COLOR_OVERLAY = true;
        this.COLOR_OVERLAY_DURATION = duration;

        return this;
    };

    /** 
     * Hides the current color overlay on the GameObject.
    */

    HideColorOverlay() {
        this.SHOW_COLOR_OVERLAY = false;

        return this;
    };
    
    //Private methods

    SET_COLOR_OVERLAY(COLOR) {
        if (COLOR != undefined) {
            let SAVE_ID = COLOR;

            if (this.CLIP != undefined) {
                let ID = 'C'+COLOR+'X'+this.CLIP.X+'Y'+this.CLIP.Y+'W'+this.CLIP.W+'H'+this.CLIP.H;

                if (this.CLIPPED_COLOR_OVERLAYS[ID] != undefined) {
                    this.COLOR_OVERLAY = this.CLIPPED_COLOR_OVERLAYS[ID];

                    return;
                }
                else
                    SAVE_ID = ID;
            } else {
                if (this.COLOR_OVERLAY != undefined &&
                    this.COLOR_OVERLAY._SAVE_ID === COLOR)
                    return;

                SAVE_ID = COLOR;
            }

            let SIZE = this.Size();

            let COLOR_OVERLAY = document.createElement('canvas');
            
            COLOR_OVERLAY.width = SIZE.W;
            COLOR_OVERLAY.height = SIZE.H;

            let COLOR_OVERLAY_GFX = COLOR_OVERLAY.getContext('2d');

            COLOR_OVERLAY_GFX.fillStyle = COLOR;
            COLOR_OVERLAY_GFX.fillRect(0, 0, SIZE.W, SIZE.H);
            COLOR_OVERLAY_GFX.globalCompositeOperation = 'destination-atop';

            this.RENDER(
                { X: 0, Y: 0 }, 
                SIZE, 
                1, 
                COLOR_OVERLAY_GFX
            );

            if (SAVE_ID != undefined &&
                this.CLIP != undefined)
                this.CLIPPED_COLOR_OVERLAYS[SAVE_ID] = COLOR_OVERLAY;

            COLOR_OVERLAY._SAVE_ID = SAVE_ID;
            this.COLOR_OVERLAY = COLOR_OVERLAY;
        }

        return this;
    };

    RENDER(POS, SIZE, OPACITY, TARGET) {
        let CANVAS_SAVED = false,
            EXTERNAL_TARGET = false;

        //Check size and specified drawing target
        
        if (SIZE == undefined) 
            SIZE = this.Size();
        if (TARGET == undefined) {
            TARGET = lx.CONTEXT.GRAPHICS;

            //If the specified drawing target is the
            //standard lynx2d context, scale respectively

            SIZE = {
                W: SIZE.W * lx.GAME.SCALE,
                H: SIZE.H * lx.GAME.SCALE
            };
        } else {
            TARGET.imageSmoothingEnabled = lx.GAME.SETTINGS.AA;

            EXTERNAL_TARGET = true;
        }

        //Check for opacity

        if (OPACITY != undefined ||
            this.OPACITY != 1) {
            if (OPACITY == undefined)
                OPACITY = this.OPACITY;
            
            TARGET.save();
            CANVAS_SAVED = true;

            TARGET.globalAlpha = OPACITY;
        }

        //Check for color overlay

        let IMG = this.IMG;
        if (this.SHOW_COLOR_OVERLAY)
            IMG = this.COLOR_OVERLAY;

        //Draw respectively
        
        if (this.CLIP == undefined || this.SHOW_COLOR_OVERLAY) {
            //Full image (or color overlay)

            //Check if the image exceeds the viewport,
            //this is only necessary when using the
            //standard Lynx2D drawing context

            let CLIP, VIEWPORT = lx.GetDimensions();

            if (!EXTERNAL_TARGET &&
                SIZE.W > VIEWPORT.width &&
                SIZE.H > VIEWPORT.height) {
                CLIP = { 
                    X: 0, 
                    Y: 0, 
                    W: VIEWPORT.width/lx.GAME.SCALE, 
                    H: VIEWPORT.height/lx.GAME.SCALE
                };

                if (POS.X < 0) {
                    CLIP.X -= POS.X/lx.GAME.SCALE;
                    POS.X = 0;
                }
                else if (POS.X > 0) 
                    CLIP.W -= POS.X/lx.GAME.SCALE;

                if (POS.Y < 0) {
                    CLIP.Y -= POS.Y/lx.GAME.SCALE;
                    POS.Y = 0;
                }
                else if (POS.Y > 0) 
                    CLIP.H -= POS.Y/lx.GAME.SCALE;
            }

            if (this.ROTATION === 0) {
                if (CLIP == undefined)
                    TARGET.drawImage(IMG, POS.X, POS.Y, SIZE.W, SIZE.H);
                else
                    TARGET.drawImage(IMG, CLIP.X, CLIP.Y, CLIP.W, CLIP.H, POS.X, POS.Y, CLIP.W*lx.GAME.SCALE, CLIP.H*lx.GAME.SCALE);
            }
            else {
                if (!CANVAS_SAVED) {
                    TARGET.save();
                    CANVAS_SAVED = true;
                }
                
                TARGET.translate(POS.X + SIZE.W/2, POS.Y + SIZE.H/2);
                TARGET.rotate(this.ROTATION);

                if (CLIP == undefined)
                    TARGET.drawImage(IMG, -SIZE.W/2, -SIZE.H/2, SIZE.W, SIZE.H);
                else
                    TARGET.drawImage(IMG, CLIP.X, CLIP.Y, CLIP.W, CLIP.H, -CLIP.W*lx.GAME.SCALE/2, -CLIP.H*lx.GAME.SCALE/2, CLIP.W*lx.GAME.SCALE, CLIP.H*lx.GAME.SCALE);
            }
        }
        else 
            //Clipped image

            if (this.ROTATION === 0) 
                TARGET.drawImage(this.IMG, this.CLIP.X, this.CLIP.Y, this.CLIP.W, this.CLIP.H, POS.X, POS.Y, SIZE.W, SIZE.H);
            else {
                if (!CANVAS_SAVED) {
                    TARGET.save();
                    CANVAS_SAVED = true;
                }
                
                TARGET.translate(POS.X + SIZE.W/2, POS.Y + SIZE.H/2);
                TARGET.rotate(this.ROTATION);
                TARGET.drawImage(this.IMG, this.CLIP.X, this.CLIP.Y, this.CLIP.W, this.CLIP.H, -SIZE.W/2, -SIZE.H/2, SIZE.W, SIZE.H);
            }
        
        //Restore canvas if necessary

        if (CANVAS_SAVED)
            TARGET.restore();

        //Handle color overlay duration if needed

        if (TARGET == lx.CONTEXT.GRAPHICS &&
            this.COLOR_OVERLAY_DURATION != undefined)
        {
            this.COLOR_OVERLAY_DURATION--;

            if (this.COLOR_OVERLAY_DURATION <= 0)
                this.HideColorOverlay();
        }
    };
};