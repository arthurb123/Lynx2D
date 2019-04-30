this.Sprite = function (source, c_x, c_y, c_w, c_h, cb) {
    if (typeof source === 'string') {
        this.IMG = new Image();
        this.IMG.onload = cb;
        this.IMG.src = source;
    } else 
        this.IMG = source;
    
    this.ROTATION = 0;
    
    if (c_x != undefined || c_y != undefined || c_w != undefined || c_h != undefined) this.CLIP = {
        X: c_x,
        Y: c_y,
        W: c_w,
        H: c_h
    };
    
    this.Size = function() {
        if (this.CLIP != undefined) {
            return {
                W: this.CLIP.W,
                H: this.CLIP.H
            };
        } else return {
            W: this.IMG.width,
            H: this.IMG.height
        };
        
        return this;
    };
    
    this.Source = function(src) {
        if (src == undefined) return this.IMG.src;
        else {
            this.IMG = new Image();
            this.IMG.src = src;
        }
        
        return this;
    }
    
    this.Clip = function(clip_x, clip_y, clip_w, clip_h) {
        if (clip_x == undefined || clip_y == undefined || clip_w == undefined || clip_h == undefined) return this.CLIP;
        else this.CLIP = {
            X: clip_x,
            Y: clip_y,
            W: clip_w,
            H: clip_h
        };
        
        return this;
    };
    
    this.Rotation = function(angle) {
        if (angle == undefined) return this.ROTATION;
        else this.ROTATION = angle;
        
        return this;
    };
    
    this.RENDER = function(POS, SIZE, OPACITY) {
        if (SIZE == undefined) 
            SIZE = this.Size();
        
        lx.CONTEXT.GRAPHICS.save();
        
        if (OPACITY != undefined)
            lx.CONTEXT.GRAPHICS.globalAlpha = OPACITY;
        
        if (this.CLIP == undefined) {
            if (this.ROTATION == 0) 
                lx.CONTEXT.GRAPHICS.drawImage(this.IMG, POS.X, POS.Y, SIZE.W, SIZE.H);
            else {
                lx.CONTEXT.GRAPHICS.translate(POS.X + SIZE.W/2, POS.Y + SIZE.H/2);
                lx.CONTEXT.GRAPHICS.rotate(this.ROTATION);
                lx.CONTEXT.GRAPHICS.drawImage(this.IMG, -SIZE.W/2, -SIZE.H/2, SIZE.W, SIZE.H);
            }
        }
        else {
            if (this.ROTATION == 0) 
                lx.CONTEXT.GRAPHICS.drawImage(this.IMG, this.CLIP.X, this.CLIP.Y, this.CLIP.W, this.CLIP.H, POS.X, POS.Y, SIZE.W, SIZE.H);
            else {
                lx.CONTEXT.GRAPHICS.translate(POS.X + SIZE.W/2, POS.Y + SIZE.H/2);
                lx.CONTEXT.GRAPHICS.rotate(this.ROTATION);
                lx.CONTEXT.GRAPHICS.drawImage(this.IMG, this.CLIP.X, this.CLIP.Y, this.CLIP.W, this.CLIP.H, -SIZE.W/2, -SIZE.H/2, SIZE.W, SIZE.H);
            }
        }
        
        lx.CONTEXT.GRAPHICS.restore();
    }
};