lx.Smoothing(false);
lx.ParticleLimit(3000);

lx.GAME.DEBUG = true;

//Lynx2D code goes here.

//Let's create an animated human using
//the CreateVerticalTileSheet function

new lx.Sprite('res/human.png', function(sprite) {
    let humanSprites = lx.CreateVerticalTileSheet(sprite, 48, 96);
    let human = new lx.GameObject(sprite, -24, -64, 48, 96);
    
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