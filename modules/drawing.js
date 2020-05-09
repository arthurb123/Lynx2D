/** 
 * Add a drawing callback to a layer.
 * @param {number} layer - The layer on which the callback gets executed.
 * @param {function} callback - The callback function which provides the canvas context.
*/

this.OnLayerDraw = function(layer, callback) {
    this.GAME.ADD_LAYER_DRAW_EVENT(layer, callback);
    
    return this;
};

/** 
 * Remove drawing callbacks on a layer.
 * @param {number} layer - The layer on which the callbacks need to be removed.
*/

this.ClearLayerDraw = function(layer) {
    this.GAME.CLEAR_LAYER_DRAW_EVENT(layer);
    
    return this;
};

/** 
 * Remove drawing callbacks on all layers.
*/

this.ResetLayerDraw = function() {
    this.GAME.LAYER_DRAW_EVENTS = [];
    
    return this;
};

/** 
 * Draw a sprite.
 * @param {Sprite} sprite - The sprite to be drawn.
 * @param {number} x - The x position.
 * @param {number} y - The y position.
 * @param {number} w - The width (can be undefined, will use sprite width)
 * @param {number} h - The width (can be undefined, will use sprite height)
*/

this.DrawSprite = function(sprite, x, y, w, h) {
    if (w == undefined || h == undefined) {
        let size = sprite.Size();

        w = size.W;
        h = size.H;
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