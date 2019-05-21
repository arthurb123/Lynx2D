lx.GAME.SETTINGS.AA = false;
lx.GAME.DEBUG = true;
lx.GAME.SETTINGS.LIMITERS.PARTICLES = 3000;

//Lynx2D code goes here.

let ball = new lx.Sprite('res/ball.png');
let emitter = new lx.Emitter(ball, 0, 0, 32, 32);

new lx.Sprite('res/human.png', function(sprite) {
    let humanSprites = lx.CreateVerticalTileSheet(sprite, 48, 96);
    let human = new lx.GameObject(sprite, -24, -64, 48, 96);
    
    human.ShowAnimation(new lx.Animation(humanSprites[1], 12));
    human.Show(1);
});

emitter.Show(0);
emitter.Speed(4);
emitter.Setup(0, 0, -2, 12, 32, 32);
emitter.MovementDecelerates(false);
emitter.Range(128, 0);

emitter.Follows(new lx.GameObject(undefined, 0, 0, 1, 1).Focus());