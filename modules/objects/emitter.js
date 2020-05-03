/**
 * Lynx2D Emitter
 * @extends Showable
 * @constructor
 * @param {Sprite} sprite - The emitter particle sprite.
 * @param {number} x - The emitter x position (or x offset).
 * @param {number} y - The emitter y position (or y  offset).
 * @param {number} amount - The amount of particles per emission.
 * @param {number} duration - The duration of every particle.
 */

this.Emitter = class extends Showable {
    constructor(sprite, x, y, amount, duration) {
        super(x, y);

        this.SPRITE = sprite;
        this.MOVEMENT = {
            MIN_VX: -1,
            MAX_VX: 1,
            MIN_VY: -1,
            MAX_VY: 1,
            DECELERATES: true
        };
        this.OFFSET = {
            X: x,
            Y: y
        };
        this.SIZE = {
            MIN: 8,
            MAX: 16
        };
        this.RANGE = {
            X: 1,
            Y: 1
        };
        this.TIMER = {
            STANDARD: 60,
            CURRENT: 60
        };
        this.AMOUNT = amount;
        this.DURATION = duration;
        this.PARTICLES = [];
    };
    
    /** 
     * Setup the Emitter's emission velocity and size.
     * @param {number} min_vx - The minimum x velocity.
     * @param {number} max_vx - The maximum x velocity (positive number is recommended).
     * @param {number} min_vy - The minimum y velocity.
     * @param {number} max_vy - The maximum y velocity (positive number is recommended).
     * @param {number} min_size - The minimum particle size.
     * @param {number} max_size - The maximum particle size.
    */

    Setup(min_vx, max_vx, min_vy, max_vy, min_size, max_size) {
        this.MOVEMENT.MIN_VX = min_vx;
        this.MOVEMENT.MAX_VX = max_vx;
        this.MOVEMENT.MIN_VY = min_vy;
        this.MOVEMENT.MAX_VY = max_vy;
        this.SIZE.MIN = min_size;
        this.SIZE.MAX = max_size;
        
        return this;
    };

    /** 
     * Get/set the Emitter's emission range.
     * @param {number} x_range - Sets the x range if specified.
     * @param {number} y_range - Sets the y range if specified.
     * @return {Object} Gets {X,Y} if left empty.
    */

    Range(x_range, y_range) {
        if (x_range != undefined && y_range != undefined)
            this.RANGE = {
                X: x_range,
                Y: y_range
            };
        else
            return this.RANGE;

        return this;
    };

     /** 
     * Get/set the Emitter's emission speed.
     * @param {number} speed - Sets the speed if specified.
     * @return {number} Get speed if left empty.
    */
    
    Speed(speed) {
        if (speed != undefined) 
            this.TIMER.STANDARD = speed;
        else 
            return this.TIMER.STANDARD;
        
        return this;
    };

     /** 
     * Get/set if the Emitter's particles decelerate.
     * @param {boolean} decelerates - Sets if decelerates if specified.
     * @return {boolean}} Gets if decelerates if specified.
    */
    
    MovementDecelerates(decelerates) {
        if (decelerates != undefined) 
            this.MOVEMENT.DECELERATES = decelerates;
        else 
            return this.MOVEMENT.DECELERATES;
        
        return this;
    };

    /** 
     * Show the Emitter on the specified layer, and emit a specified amount of times before being hidden.
     * @param {number} layer - The layer the Emitter should be shown on.
     * @param {number} amount - The amount of times the Emitter should emit.
    */
    
    Emit(layer, amount) {
        this.TIMER.CURRENT = this.TIMER.STANDARD;
        this.HIDES_AFTER_AMOUNT = amount;
        
        this.Show(layer);
        
        return this;
    };

    //Private methods

    RENDER() {
        for (let i = 0; i < this.PARTICLES.length; i++) {
            lx.DrawSprite(
                this.SPRITE.Opacity(this.PARTICLES[i].OPACITY), 
                this.PARTICLES[i].POS.X, 
                this.PARTICLES[i].POS.Y, 
                this.PARTICLES[i].SIZE, 
                this.PARTICLES[i].SIZE
            );
            this.SPRITE.Opacity(1);
        }
    };
    
    UPDATE() {
        if (this.TARGET != undefined) {
            let TARGET_POS = this.TARGET.Position();
            this.POS = {
                X: TARGET_POS.X+this.OFFSET.X,
                Y: TARGET_POS.Y+this.OFFSET.Y
            };
        }
        
        for (let i = 0; i < this.PARTICLES.length; i++) {
            if (this.PARTICLES[i].TIMER.CURRENT >= this.PARTICLES[i].TIMER.STANDARD) 
                this.PARTICLES.splice(i, 1);
            else {
                if (this.MOVEMENT.DECELERATES) {
                    let VX = this.PARTICLES[i].MOVEMENT.START_VX/lx.GAME.PHYSICS.STEPS,
                        VY = this.PARTICLES[i].MOVEMENT.START_VY/lx.GAME.PHYSICS.STEPS;

                    if (this.PARTICLES[i].MOVEMENT.VX > 0) {
                        if (this.PARTICLES[i].MOVEMENT.VX-VX < 0) 
                            this.PARTICLES[i].MOVEMENT.VX = 0;
                        else 
                            this.PARTICLES[i].MOVEMENT.VX-=VX;
                    }
                    else if (this.PARTICLES[i].MOVEMENT.VX < 0) {
                        if (this.PARTICLES[i].MOVEMENT.VX+VX > 0) 
                            this.PARTICLES[i].MOVEMENT.VX = 0;
                        else 
                            this.PARTICLES[i].MOVEMENT.VX+=VX;
                    }

                    if (this.PARTICLES[i].MOVEMENT.VY > 0) {
                        if (this.PARTICLES[i].MOVEMENT.VY-VY < 0) 
                            this.PARTICLES[i].MOVEMENT.VY = 0;
                        else 
                            this.PARTICLES[i].MOVEMENT.VY-=VY;
                    }
                    else if (this.PARTICLES[i].MOVEMENT.VY < 0) {
                        if (this.PARTICLES[i].MOVEMENT.VY+VY > 0) 
                            this.PARTICLES[i].MOVEMENT.VY = 0;
                        else 
                            this.PARTICLES[i].MOVEMENT.VY+=VY;
                    }
                }
                
                this.PARTICLES[i].POS.X += this.PARTICLES[i].MOVEMENT.VX;
                this.PARTICLES[i].POS.Y += this.PARTICLES[i].MOVEMENT.VY;

                if (this.PARTICLES[i].OPACITY > 0) 
                    this.PARTICLES[i].OPACITY -= 1/this.PARTICLES[i].TIMER.STANDARD;
                if (this.PARTICLES[i].OPACITY < 0)
                    this.PARTICLES[i].OPACITY = 0;

                this.PARTICLES[i].TIMER.CURRENT++;
            }
        }
        
        if (this.TIMER.CURRENT >= this.TIMER.STANDARD) {  
            if (this.HIDES_AFTER_AMOUNT != undefined) {
                if (this.HIDES_AFTER_AMOUNT <= 0) {
                    if (this.PARTICLES.length === 0) {
                        this.Hide();
                        this.HIDES_AFTER_AMOUNT = undefined;
                    }
                    else
                        return;
                } else
                    this.HIDES_AFTER_AMOUNT--;
            }
            
            for (let i = 0; i < this.AMOUNT;  i++) {
                if (this.PARTICLES.length >= lx.GAME.SETTINGS.LIMITERS.PARTICLES) 
                    break;
                
                let PARTICLE_DATA = {
                    POS: {
                        X: this.POS.X-this.SIZE.MAX/2+Math.random()*this.RANGE.X-Math.random()*this.RANGE.X,
                        Y: this.POS.Y-this.SIZE.MAX/2+Math.random()*this.RANGE.Y-Math.random()*this.RANGE.Y
                    },
                    MOVEMENT: {
                        VX: Math.random()*this.MOVEMENT.MIN_VX+Math.random()*this.MOVEMENT.MAX_VX,
                        VY: Math.random()*this.MOVEMENT.MIN_VY+Math.random()*this.MOVEMENT.MAX_VY
                    },
                    TIMER: {
                        STANDARD: this.DURATION,
                        CURRENT: 0
                    },
                    SIZE: this.SIZE.MIN+Math.random()*(this.SIZE.MAX-this.SIZE.MIN),
                    OPACITY: 1
                };

                PARTICLE_DATA.MOVEMENT.START_VX = 
                    Math.abs(PARTICLE_DATA.MOVEMENT.VX);
                PARTICLE_DATA.MOVEMENT.START_VY = 
                    Math.abs(PARTICLE_DATA.MOVEMENT.VY);

                this.PARTICLES.unshift(PARTICLE_DATA);
            }
            
            this.TIMER.CURRENT = 0;
        } else 
            this.TIMER.CURRENT++;
    };
};