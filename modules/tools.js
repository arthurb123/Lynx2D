/** 
 * Cuts a sprite horizontally into a tilesheet.
 * @param {Sprite} sprite - The sprite to cut.
 * @param {number} cw - The clip/tile width.
 * @param {number} ch - The clip/tile height.
 * @return {Sprite[]} A 2D array containg all cut tiles as Sprites.
*/

this.CreateHorizontalTileSheet = function(sprite, cw, ch) {
    let result = [];

    let w = Math.round(sprite.Size().W/cw),
        h = Math.round(sprite.Size().H/ch);

    for (let y = 0; y < h; y++) {
        if (result[y] == undefined)
            result[y] = [];

        for (let x = 0; x < w; x++)
            result[y][x] = new lx.Sprite(sprite.IMG, x*cw, y*ch, cw, ch);
    }

    return result;
};

/** 
 * Cuts a sprite vertically into a tilesheet.
 * @param {Sprite} sprite - The sprite to cut.
 * @param {number} cw - The clip/tile width.
 * @param {number} ch - The clip/tile height.
 * @return {Sprite[]} A 2D array containg all cut tiles as Sprites.
*/

this.CreateVerticalTileSheet = function(sprite, cw, ch) {
    let result = [];

    let w = Math.round(sprite.Size().W/cw),
        h = Math.round(sprite.Size().H/ch);

    for (let x = 0; x < w; x++) {
        if (result[x] == undefined)
            result[x] = [];

        for (let y = 0; y < h; y++)
            result[x][y] = new lx.Sprite(sprite.IMG, x*cw, y*ch, cw, ch);
    }

    return result;
};

/** 
 * Move a GameObject to a new position.
 * @param {GameObject} gameobject - The GameObject target.
 * @param {number} x - The clip/tile width.
 * @param {number} y - The clip/tile height.
 * @param {number} time - The time/duration in milliseconds.
*/

this.MoveToPosition = function(gameobject, x, y, time) {
    if (gameobject.BEING_MOVED)
        return;
    else
        gameobject.BEING_MOVED = true;
    
    let frames = time / 1000 * 60,
        dx = x-gameobject.Position().X,
        dy = y-gameobject.Position().Y,
        speedX = dx / frames,
        speedY = dy / frames;

    let updateIdentifier = lx.GAME.ADD_LOOPS(function() {
        gameobject.POS.X += speedX;
        gameobject.POS.Y += speedY;

        frames--;

        if (frames <= 0) {
            lx.GAME.LOOPS[updateIdentifier] = undefined;
            
            delete gameobject.BEING_MOVED;
        }
    });
};