lx.GAME.SETTINGS.AA = false;
lx.GAME.DEBUG = true;

const Ray = class {
    constructor(x, y) {
        this.POS = {
            X: x,
            Y: y
        };

        this.DIR = {
            X: 128,
            Y: 0
        };

        this.Direction = function(x, y) {
            this.DIR = {
                X: x - this.POS.X,
                Y: y - this.POS.Y
            };

            let MAGNITUDE = Math.sqrt(this.DIR.X*this.DIR.X + this.DIR.Y*this.DIR.Y);

            this.DIR.X /= MAGNITUDE;
            this.DIR.Y /= MAGNITUDE;
        };

        this.Cast = function(target) {
            if (target.COLLIDER == undefined)
                return false;

            return this.CHECK_INTERSECTION_BOX(target.COLLIDER, false);
        };

        this.CastPoints = function(target) {
            if (target.COLLIDER == undefined)
                return false;

            return this.CHECK_INTERSECTION_BOX(target.COLLIDER, true);
        };

        this.GET_VECTOR = function() {
            return {
                X: this.POS.X,
                Y: this.POS.Y,
                X1: this.POS.X + this.DIR.X,
                Y1: this.POS.Y + this.DIR.Y
            };
        };

        this.CHECK_INTERSECTION_BOX = function(TARGET, GET_POSITIONS) {
            let LINES = [],
                RESULT = false;

            let VECTOR = this.GET_VECTOR();

            if (TARGET.SIZE != undefined) {
                LINES.push({ X: TARGET.POS.X, Y: TARGET.POS.Y, X1: TARGET.POS.X+TARGET.SIZE.W, Y1: TARGET.POS.Y });
                LINES.push({ X: TARGET.POS.X, Y: TARGET.POS.Y, X1: TARGET.POS.X, Y1: TARGET.POS.Y+TARGET.SIZE.H });
                LINES.push({ X: TARGET.POS.X, Y: TARGET.POS.Y+TARGET.SIZE.H, X1: TARGET.POS.X+TARGET.SIZE.W, Y1: TARGET.POS.Y+TARGET.SIZE.H });
                LINES.push({ X: TARGET.POS.X+TARGET.SIZE.W, Y: TARGET.POS.Y, X1: TARGET.POS.X+TARGET.SIZE.W, Y1: TARGET.POS.Y+TARGET.SIZE.H });
            } else 
                return RESULT;

            for (let L = 0; L < LINES.length; L++) {
                let LINE = LINES[L];

                let LINE_RESULT = this.CHECK_INTERSECTION_LINE(LINE, GET_POSITIONS);
                
                if (GET_POSITIONS && !RESULT)
                    RESULT = [];
                else if (!GET_POSITIONS) {
                    RESULT = true;

                    break;
                }

                if (GET_POSITIONS)
                    RESULT.push(LINE_RESULT);
            }

            return RESULT;
        };

        this.CHECK_INTERSECTION_LINE = function(LINE, GET_POSITION) {
            let RESULT = false,
                DEN = (LINE.X-LINE.X1) * (VECTOR.Y-VECTOR.Y1) - (LINE.Y-LINE.Y1) * (VECTOR.X-VECTOR.X1);

            if (DEN === 0)
                continue;

            let T = ((LINE.X-VECTOR.X) * (VECTOR.Y-VECTOR.Y1) - (LINE.Y-VECTOR.Y) * (VECTOR.X-VECTOR.X1)) / DEN,
                U = -((LINE.X-LINE.X1) * (LINE.Y-VECTOR.Y) - (LINE.Y-LINE.Y1) * (LINE.X-VECTOR.X)) / DEN;

            if (T > 0 && T < 1 && U > 0) {
                if (GET_POSITION) {
                    RESULT = {
                        X: LINE.X + T * (LINE.X1 - LINE.X),
                        Y: LINE.Y + T * (LINE.Y1 - LINE.Y)
                    };

                    if (lx.GAME.FOCUS != undefined)
                        POINT = lx.GAME.TRANSLATE_FROM_FOCUS(POINT);
                }
                else
                    RESULT = true;
            }

            return RESULT;
        };
    }
};

let camera = new lx.GameObject(undefined, -128, 32, 1, 1)
    .Show(0)
    .Focus();

let ball = new lx.GameObject(
    new lx.Sprite('res/ball.png', function() {
        ball.Loops(function() {
            ball.AddVelocity(0, .25)
        });
        ball.CreateCollider(false, function(data) {
            ball.MOVEMENT.VY *= -1.5; 
        });
        ball.MaxVelocity(0, 4);
        ball.Show(0);
    }),
    16,
    -128,
    32,
    32
);

let wall = new lx.GameObject(
    new lx.Sprite('res/block.png', function() {
        wall.CreateCollider(true);
        wall.Show(0);
    }),
    0, 0, 64, 64
);

let r = new Ray(-128, 32);

lx.OnLayerDraw(1, function(gfx) {
    //Draw ray line

    let POS = lx.GAME.TRANSLATE_FROM_FOCUS(r.POS);

    gfx.beginPath();
    gfx.moveTo(POS.X, POS.Y);
    gfx.lineTo(POS.X+r.DIR.X*32, POS.Y+r.DIR.Y*32);
    gfx.strokeStyle = 'red';
    gfx.closePath();
    gfx.stroke();

    //Draw ray points

    let points = r.CHECK_INTERSECTION_BOX(wall.COLLIDER, true);

    if (points) 
        for (let p = 0; p < points.length; p++)
            gfx.strokeRect(points[p].X-4, points[p].Y-4, 8, 8);
});

lx.OnMouseMove(function(pos) {
    r.Direction(pos.X-lx.GetDimensions().width/2, pos.Y-lx.GetDimensions().height/2);
});