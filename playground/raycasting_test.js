lx.GAME.SETTINGS.AA = false;
lx.GAME.DEBUG = true;

let walls = [],
    amountOfWalls = 12;

for (let w = 0; w < amountOfWalls; w++) {
    let wall = new lx.GameObject(
        new lx.Sprite('res/block.png', function() {
            wall.CreateCollider(true);
            wall.Show(0);
            
            walls.push(wall);
        }),
        Math.random()*lx.GetDimensions().width-32, 
        Math.random()*lx.GetDimensions().height-32, 
        64, 
        64
    );
}

let r = new lx.Ray(0, 0);

lx.OnLayerDraw(1, function(gfx) {
    //Draw ray lines

    let result = r.CastPointRadiallyMultiple(walls, 1);

    if (result.length > 0) {
        gfx.save();

        for (let p = 0; p < result.length; p++) {
            gfx.beginPath();
            gfx.moveTo(lx.GetDimensions().width/2, lx.GetDimensions().height/2);
            gfx.lineTo(result[p].X, result[p].Y);
            gfx.closePath();
            gfx.stroke();
        }

        gfx.restore();
    }
});

lx.OnMouseMove(function(pos) {
    r.Direction(pos.X-lx.GetDimensions().width/2, pos.Y-lx.GetDimensions().height/2);
});

let camera = new lx.GameObject(undefined, lx.GetDimensions().width/2, lx.GetDimensions().height/2, 1, 1)
    .Show(0)
    .Loops(function() {
        r.Position(camera.Position().X, camera.Position().Y);
    })
    .SetTopDownController(.25, .25, 2, 2)
    .Focus();