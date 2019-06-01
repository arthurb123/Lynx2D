lx.GAME.SETTINGS.AA = false;
lx.GAME.DEBUG = true;

let wall = new lx.GameObject(
    new lx.Sprite('res/block.png', function() {
        wall.CreateCollider(true);
        wall.Show(0);
    }),
    Math.random()*lx.GetDimensions().width-32, 
    Math.random()*lx.GetDimensions().height-32, 
    64, 
    64
);

let r = new lx.Ray(0, 0);

lx.OnLayerDraw(1, function(gfx) {
    let result = r.Cast(wall);
    
    if (result)
        console.log('hit wall');
    
    gfx.beginPath();
    gfx.moveTo(lx.GetDimensions().width/2, lx.GetDimensions().height/2);
    gfx.lineTo(lx.GetDimensions().width/2+r.DIR.X*10, lx.GetDimensions().height/2+r.DIR.Y*10);
    gfx.stroke();
});

lx.OnMouseMove(function(pos) {
    r.Direction(pos.X, pos.Y);
});

let camera = new lx.GameObject(undefined, lx.GetDimensions().width/2, lx.GetDimensions().height/2, 1, 1)
    .Show(0)
    .Loops(function() {
        r.Position(camera.Position().X, camera.Position().Y);
    })
    .SetTopDownController(.25, .25, 2, 2)
    .Focus();