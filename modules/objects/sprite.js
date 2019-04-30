this.Sprite = function (source, c_x, c_y, c_w, c_h, cb) {
    //Check if no clip but a 
    //callback is provided (compact callback)

    if (c_x != undefined && 
        typeof c_x === 'function') {
        cb = c_x;
        c_x = undefined;
    }

    //Load image if the source is a string

    if (typeof source === 'string') {
        this.IMG = new Image();
        this.IMG.onload = cb;
        this.IMG.src = source;
    } 
    
    //Otherwise straight up accept it (for canvas usage)

    else 
        this.IMG = source;
    
    this.ROTATION = 0;
    this.OPACITY = 1;
    
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

    //Functionality
    
    this.Size = function() {
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
    
    this.Source = function(src) {
        if (src == undefined) return this.IMG.src;
        else {
            this.IMG = new Image();
            this.IMG.src = src;
        }
        
        return this;
    }
    
    this.Clip = function(c_x, c_y, c_w, c_h) {
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
    
    this.Rotation = function(radians) {
        if (radians == undefined) 
            return this.ROTATION;
        else 
            this.ROTATION = radians;
        
        return this;
    };
    
    this.Opacity = function(factor) {
        if (factor == undefined) 
            return this.OPACITY;
        else 
            this.OPACITY = factor;
        
        return this;
    };

    this.ShowColorOverlay = function(color, duration) {
        if (this.COLOR_OVERLAY == undefined && 
            color == undefined)
            return this;

        this.SET_COLOR_OVERLAY(color);

        this.SHOW_COLOR_OVERLAY = true;
        this.COLOR_OVERLAY_DURATION = duration;

        return this;
    };

    this.HideColorOverlay = function() {
        this.SHOW_COLOR_OVERLAY = false;

        return this;
    };
    
    this.RENDER = function(POS, SIZE, OPACITY, TARGET) {
        let CANVAS_SAVED = false;

        //Check size and specified drawing target
        
        if (SIZE == undefined) 
            SIZE = this.Size();
        if (TARGET == undefined)
            TARGET = lx.CONTEXT.GRAPHICS;

        //Check for opacity

        if (OPACITY != undefined ||
            this.OPACITY != 1) {
            if (OPACITY == undefined)
                OPACITY = this.OPACITY;
            
            lx.CONTEXT.GRAPHICS.globalAlpha = OPACITY;
            
            lx.CONTEXT.GRAPHICS.save();
            CANVAS_SAVED = true;
        }

        //Check for color overlay

        let IMG = this.IMG;
        if (this.SHOW_COLOR_OVERLAY)
            IMG = this.COLOR_OVERLAY;

        //Draw respectively
        
        if (this.CLIP == undefined || this.SHOW_COLOR_OVERLAY) 
            //Full image (or color overlay)

            if (this.ROTATION == 0) 
                TARGET.drawImage(IMG, POS.X, POS.Y, SIZE.W, SIZE.H);
            else {
                if (!CANVAS_SAVED)
                    TARGET.save();
                
                TARGET.translate(POS.X + SIZE.W/2, POS.Y + SIZE.H/2);
                TARGET.rotate(this.ROTATION);
                TARGET.drawImage(IMG, -SIZE.W/2, -SIZE.H/2, SIZE.W, SIZE.H);
            }
        else 
            //Clipped image

            if (this.ROTATION == 0) 
                TARGET.drawImage(this.IMG, this.CLIP.X, this.CLIP.Y, this.CLIP.W, this.CLIP.H, POS.X, POS.Y, SIZE.W, SIZE.H);
            else {
                if (!CANVAS_SAVED)
                    TARGET.save();
                
                TARGET.translate(POS.X + SIZE.W/2, POS.Y + SIZE.H/2);
                TARGET.rotate(this.ROTATION);
                TARGET.drawImage(this.IMG, this.CLIP.X, this.CLIP.Y, this.CLIP.W, this.CLIP.H, -SIZE.W/2, -SIZE.H/2, SIZE.W, SIZE.H);
            }
        
        //Restore canvas if necessary

        if (CANVAS_SAVED)
            TARGET.restore();

        //Handle color overlay duration if needed

        if (TARGET != lx.CONTEXT.GRAPHICS &&
            this.COLOR_OVERLAY_DURATION != undefined)
        {
            this.COLOR_OVERLAY_DURATION--;

            if (this.COLOR_OVERLAY_DURATION <= 0)
                this.HideColorOverlay();
        }
    };

    this.SET_COLOR_OVERLAY = function(COLOR) {
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
};