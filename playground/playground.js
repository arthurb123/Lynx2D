lx.Smoothing(false);
lx.ParticleLimit(3000);

lx.GAME.DEBUG = true;

//Lynx2D code goes here.

let emitter = new lx.Emitter(new lx.Sprite('res/ball.png'), 0, 0, 32, 32);

new lx.Sprite('res/human.png', function(sprite) {
    let humanSprites = lx.CreateVerticalTileSheet(sprite, 48, 96);
    let human = new lx.GameObject(sprite, -24, -64, 48, 96);
    
    human.ShowAnimation(new lx.Animation(humanSprites[1], 12));
    human.Show(2);
});

emitter.Show(1);
emitter.Speed(4);
emitter.Setup(0, 0, -2, 12, 32, 32);
emitter.MovementDecelerates(false);
emitter.Range(128, 0);

emitter.Follows(new lx.GameObject(undefined, 0, 0, 1, 1).Focus());

let noise = new lx.Noise();

for (let x = 0; x < 8; x++)
    for (let y = 0; y < 8; y++) {
        let r = Math.abs(noise.Get(x/5, y/5));

        new lx.GameObject(new lx.Sprite('res/block.png'), (x-4)*32, (y-4)*32, 32, 32)
        .Opacity(r)
        .Show(0);
    }