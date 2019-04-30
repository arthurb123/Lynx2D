this.Animation = function (sprite_collection, speed) {
    this.SPRITES = sprite_collection;
    this.FRAME = 0;
    this.MAX_FRAMES = sprite_collection.length;
    this.TIMER = {
        STANDARD: speed,
        CURRENT: 0
    };
    this.BUFFER_ID = -1;
    this.BUFFER_LAYER = 0;
    this.UPDATES = true;
    
    this.Show = function(layer, x, y, w, h, amount) {
        if (this.BUFFER_ID != -1) this.Hide();
        
        this.POS = {
            X: x,
            Y: y
        };
        this.SIZE = {
            W: w,
            H: h
        };
        this.BUFFER_ID = lx.GAME.ADD_TO_BUFFER(this, layer);
        this.BUFFER_LAYER = layer;
        
        if (amount != undefined) 
            this.MAX_AMOUNT = amount;
        
        return this;
    };
    
    this.Hide = function() {
        if (this.BUFFER_ID == -1) return;
        
        lx.GAME.BUFFER[this.BUFFER_LAYER][this.BUFFER_ID] = undefined;
        this.BUFFER_ID = -1;
        this.BUFFER_LAYER = 0;
        
        return this;
    };
    
    this.Speed = function(speed) {
        if (speed != undefined) this.TIMER.STANDARD = speed;
        else return this.TIMER.STANDARD;
        
        return this;
    };
    
    this.GET_CURRENT_FRAME = function() {
        return this.SPRITES[this.FRAME];
    };
    
    this.RENDER = function(POS, SIZE, OPACITY) {
        if (this.BUFFER_ID == -1) this.SPRITES[this.FRAME].RENDER(POS, SIZE, OPACITY);
        else this.SPRITES[this.FRAME].RENDER(lx.GAME.TRANSLATE_FROM_FOCUS(this.POS), this.SIZE, OPACITY);
    };
    
    this.UPDATE = function() {
        this.TIMER.CURRENT++;
        
        if (this.TIMER.CURRENT >= this.TIMER.STANDARD) {
            this.TIMER.CURRENT = 0;
            this.FRAME++;
            
            if (this.FRAME >= this.MAX_FRAMES) {
                this.FRAME = 0;
                
                if (this.MAX_AMOUNT != undefined) {
                    if (this.MAX_AMOUNT == 0) {
                        this.MAX_AMOUNT = undefined;
                        this.Hide();
                    } else this.MAX_AMOUNT--;
                }
            }
        }
    };
};