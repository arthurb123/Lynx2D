this.OnLayerDraw = function(layer, callback) {
    this.GAME.ADD_LAYER_DRAW_EVENT(layer, callback);
    
    return this;
};

this.ClearLayerDraw = function(layer) {
    this.GAME.CLEAR_LAYER_DRAW_EVENT  
    
    return this;
};

this.ResetLayerDraw = function() {
    this.GAME.LAYER_DRAW_EVENTS = [];
    
    return this;
};

this.DrawSprite = function(sprite, x, y, w, h) {
    if (w == undefined || h == undefined) {
        w = sprite.Size().W;
        h = sprite.Size().H;
    };
    
    if (!lx.GAME.ON_SCREEN({
        X: x,
        Y: y
    }, {
        W: w,
        H: h
    }))
        return;
    
    sprite.RENDER(this.GAME.TRANSLATE_FROM_FOCUS({
        X: x, 
        Y: y
    }),
    {
        W: w,
        H: h
    });
    
    return this;
};