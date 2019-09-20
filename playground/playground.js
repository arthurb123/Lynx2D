//Setup Lynx2D

lx.Smoothing(false);
lx.ParticleLimit(3000);

lx.GAME.DEBUG = true;

//Let's create an animated human using
//the CreateVerticalTileSheet function

let human;
new lx.Sprite('res/human.png', function(sprite) {
    let humanSprites = lx.CreateVerticalTileSheet(sprite, 48, 96);
    human = new lx.GameObject(sprite, -24, -64, 48, 96);
    
    human.ShowAnimation(new lx.Animation(humanSprites[1], 12));
    human.Show(2);
});

//Let's create an emitter

let emitter = new lx.Emitter(new lx.Sprite('res/ball.png'), 0, 0, 32, 32);

emitter.Show(1);
emitter.Speed(4);
emitter.Setup(0, 0, -2, 12, 32, 32);
emitter.MovementDecelerates(false);
emitter.Range(128, 0);

emitter.Follows(new lx.GameObject(undefined, 0, 0, 1, 1).Focus());

//Let's create some random blocks
//based on classical perlin noise.
//This gets pre-rendered in the Lynx2D 
//canvas object.

let noise = new lx.Noise();
new lx.Sprite('res/block.png', function(block) {
    let canvas = new lx.Canvas(8*32, 8*32);

    for (let x = 0; x < 8; x++)
        for (let y = 0; y < 8; y++) {
            let r = Math.abs(noise.Get(x/5, y/5));
            
            block.Opacity(r);
            canvas.DrawSprite(block, x*32, y*32);
        }

    //Create a GameObject with the pre-rendered
    //canvas object, this can simply be put in a Sprite.
    
    new lx.GameObject(new lx.Sprite(canvas), -4*32, -4*32, 8*32, 8*32)
        .Show(0);
});

//Move the player 32 pixels if a click is detected

lx.OnMouse(0, function(data) {
    if (data.state === 1) return;
    
    lx.MoveToPosition(human, human.Position().X + 32, human.Position().Y, 500);
});

//Sample UI elements

new lx.UIText("Sample UI Text", 200, 200, 14).Show();