lx.GAME.SETTINGS.AA = false;
lx.GAME.DEBUG = true;
lx.GAME.SETTINGS.LIMITERS.PARTICLES = 3000;

//Lynx2D code goes here.

let ball = new lx.Sprite('res/ball.png');

let emitter = new lx.Emitter(ball, 0, 0, 32, 32);

let sprite = new lx.Sprite('res/human.png', function() {
    let humanSprites = lx.CreateVerticalTileSheet(sprite, 48, 96);

    new lx.Animation(humanSprites[1], 12).Show(1, -24, -64);
});

emitter.Show(0);
emitter.Speed(4);
emitter.Setup(0, 0, -2, 12, 32, 32);
emitter.MovementDecelerates(false);
emitter.Range(128, 0);

emitter.Follows(new lx.GameObject(undefined, 0, 0, 1, 1).Focus());