lx.GAME.SETTINGS.AA = false;
lx.GAME.DEBUG = true;

//Wall

/*
let wall = new lx.GameObject(
    new lx.Sprite("res/block.png"),
    0, 
    0,
    128,
    64
)
    .Focus()
    .CreateCollider(true)
    .Show(0);
    */

//World colliders

new lx.Collider(0, -20, lx.GetDimensions().width, 20, true);
new lx.Collider(-20, 0, 20, lx.GetDimensions().height, true);
new lx.Collider(lx.GetDimensions().width, 0, 20, lx.GetDimensions().height, true);
new lx.Collider(0, lx.GetDimensions().height, lx.GetDimensions().width, 20, true);

//Balls

let ballDown = new lx.Sprite("res/ball_down.png"),
    ballUp = new lx.Sprite("res/ball_up.png");

let balls = 600;

for (let b = 0; b < balls; b++) {
    let ball = new lx.GameObject(
        ballUp,
        Math.random()*lx.GetDimensions().width,
        Math.random()*lx.GetDimensions().height,
        16,
        16
    )
    .CreateCollider(false, function(data) {
        if (data.direction === 'down' ||
            data.direction === 'up') {
            data.gameObject.AddVelocity(0, ball.MOVEMENT.VY*.5);
            ball.MOVEMENT.VY*=-1;
        }
        if (data.direction === 'right' ||
            data.direction === 'left') {
            data.gameObject.AddVelocity(ball.MOVEMENT.VX*.5, 0);
            ball.MOVEMENT.VX*=-1;
        }
    })
    .Loops(function() {
        if (ball.Movement().VY < 0)
            ball.SPRITE = ballUp;
        else if (ball.Movement().VY > 0)
            ball.SPRITE = ballDown;
    })
    .Weight(.005)
    .MaxVelocity(2, 6)
    .AddVelocity(Math.random()*2-Math.random()*2, Math.random()*2-Math.random()*2)
    .Show(0);
}