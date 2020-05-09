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
    
    let pos = gameobject.Position(),
        frames = time / 1000 * 60,
        dx = x-pos.X,
        dy = y-pos.Y,
        speedX = dx / frames,
        speedY = dy / frames;

    let updateIdentifier = lx.GAME.ADD_LOOPS(function() {
        gameobject.Move(speedX, speedY);

        frames--;

        if (frames <= 0) {
            lx.GAME.LOOPS[updateIdentifier] = undefined;
            
            delete gameobject.BEING_MOVED;
        }
    });
};

//Private methods

this.ROTATE_AROUND = function(POS, AROUND_POS, ANGLE) {
    //Check if rotation is necessary

    if (ANGLE === 0 || (POS.X === AROUND_POS.X && POS.Y === AROUND_POS.Y))
        return POS;

    //Calculate angles

    let S = Math.sin(ANGLE);
    let C = Math.cos(ANGLE);

    //Get delta of points

    let DELTA = {
        X: POS.X - AROUND_POS.X,
        Y: POS.Y - AROUND_POS.Y
    };

    //Translate point back to origin

    let NEW_POS = {
        X: AROUND_POS.X,
        Y: AROUND_POS.Y
    };

    //Rotate point and add to new position

    NEW_POS.X += DELTA.X * C - DELTA.Y * S;
    NEW_POS.Y += DELTA.X * S + DELTA.Y * C;

    //Return new position

    return NEW_POS;
};

this.NORMALIZE = function(POS) {
    //Calculate magnitude

    let MAG = Math.sqrt(POS.X*POS.X + POS.Y*POS.Y);

    //Normalize (divide by magnitude) and return
    
    return {
        X: POS.X / MAG,
        Y: POS.Y / MAG
    };
};

this.DOT_PRODUCT = function(POS1, POS2) {
    //Calculate dot product and return

    return POS1.X * POS2.X + POS1.Y * POS2.Y;
};

this.HASH_CODE = function(STRING) {
    let HASH = 0;

    for (let i = 0; i < STRING.length; i++) {
        let CHAR = STRING.charCodeAt(i);

        HASH = ((HASH << 5) - HASH) + CHAR;
        HASH = HASH & HASH;
    }

    return HASH;
};