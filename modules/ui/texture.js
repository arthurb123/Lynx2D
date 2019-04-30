this.UITexture = function(sprite, x, y, w, h) {
    this.SPRITE = sprite
    this.POS = {
        X: x,
        Y: y
    };
    if (w != undefined && h != undefined) this.SIZE = {
        W: w,
        H: h
    }
    
    this.Size = function(width, height) {
        if (width == undefined || height == undefined) return this.SIZE;
        else this.SIZE = {
            W: width,
            H: height
        };
        
        return this;
    };
    
    this.Position = function(x, y) {
        if (x == undefined || y == undefined) return this.POS;
        else this.POS = {
            X: x,
            Y: y
        };
        
        return this;
    };
    
    this.Follows = function(gameobject) {
        this.TARGET = gameobject;
        
        return this;
    };
    
    this.StopFollowing = function() {
        this.TARGET = undefined;
        
        return this;
    };
    
    this.RENDER = function() {
        if (this.TARGET != undefined) this.SPRITE.RENDER(lx.GAME.TRANSLATE_FROM_FOCUS({ X: this.TARGET.POS.X+this.POS.X, Y: this.TARGET.POS.Y+this.POS.Y }), this.SIZE);
        else this.SPRITE.RENDER(this.POS, this.SIZE);
    };
    
    this.UPDATE = function() {
        
    };
    
    this.Show = function() {
        if (this.UI_ID != undefined) return this;
        
        this.UI_ID = lx.GAME.ADD_UI_ELEMENT(this);
        
        return this;
    };
    
    this.Hide = function() {
        if (this.UI_ID == undefined) return this;
        
        lx.GAME.UI[this.UI_ID] = undefined;
        this.UI_ID = undefined;
        
        return this;
    };
};