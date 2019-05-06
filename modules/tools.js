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