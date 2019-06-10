/**
 * Lynx2D Emitter
 * @constructor
 * @param {Sprite} sprite - The emitter particle sprite.
 * @param {number} x - The emitter x position (or x offset).
 * @param {number} y - The emitter y position (or y  offset).
 * @param {number} amount - The amount of particles per emission.
 * @param {number} duration - The duration of every particle.
 */

this.Emitter = function(sprite, x, y, amount, duration) {
    this.BUFFER_ID = -1;
    this.BUFFER_LAYER = 0;
    this.SPRITE = sprite;
    this.MOVEMENT = {
        MIN_VX: -1,
        MAX_VX: 1,
        MIN_VY: -1,
        MAX_VY: 1,
        DECELERATES: true
    };
    this.POS = {
        X: x,
        Y: y
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
    this.UPDATES = true;
    
    /** 
     * Setup the Emitter's emission velocity and size.
     * @param {number} min_vx - The minimum x velocity.
     * @param {number} max_vx - The maximum x velocity.
     * @param {number} min_vy - The minimum y velocity.
     * @param {number} max_vy - The maximum y velocity.
     * @param {number} min_size - The minimum particle size.
     * @param {number} max_size - The maximum particle size.
    */

    this.Setup = function(min_vx, max_vx, min_vy, max_vy, min_size, max_size) {
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
     * @return {object} Gets {X,Y} if left empty.
    */

    this.Range = function(x_range, y_range) {
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
    
    this.Speed = function(speed) {
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
    
    this.MovementDecelerates = function(decelerates) {
        if (decelerates != undefined) this.MOVEMENT.DECELERATES = decelerates;
        else return this.MOVEMENT.DECELERATES;
        
        return this;
    };

    /** 
     * Get/set the Emitter's position.
     * @param {number} x - Sets the x position if specified.
     * @param {number} y - Sets the y position if specified.
     * @return {object} Gets {X,Y} if left empty.
    */
    
    this.Position = function(x, y) {
        if (x != undefined && y != undefined) 
            this.POS = {
                X: x,
                Y: y
            };
        else 
            return this.POS;
        
        return this;
    };

    /** 
     * Get/set the Emitter's following target.
     * @param {GameObject} target - Sets following target if specified.
     * @return {GameObject} Gets following target if left empty.
    */
    
    this.Follows = function(target) {
        if (target != undefined) 
            this.TARGET = target;
        else 
            return this.TARGET;
        
        return this;
    };

    /** 
     * Stop following the target.
    */
    
    this.StopFollowing = function() {
        this.TARGET = undefined; 
        this.POS = {
            X: this.OFFSET.X,
            Y: this.OFFSET.Y
        };
        
        return this;
    };

    /** 
     * Shows the Emitter on the specified layer.
     * @param {number} layer - The layer the Emitter should be shown on.
    */
    
    this.Show = function(layer) {
        if (this.BUFFER_ID != -1) this.Hide();
        
        this.PARTICLES = [];
        
        this.BUFFER_ID = lx.GAME.ADD_TO_BUFFER(this, layer);
        this.BUFFER_LAYER = layer;
        
        return this;
    };

    /** 
     * Hide the GameObject.
    */
    
    this.Hide = function() {
        if (this.BUFFER_ID == -1) return;
        
        lx.GAME.BUFFER[this.BUFFER_LAYER][this.BUFFER_ID] = undefined; 
        
        this.BUFFER_ID = -1;
        this.BUFFER_LAYER = 0;
        
        return this;
    };

    /** 
     * Show the Emitter on the specified layer, and emit a specified amount of times before being hidden.
     * @param {number} layer - The layer the Emitter should be shown on.
     * @param {number} amount - The amount of times the Emitter should emit.
    */
    
    this.Emit = function(layer, amount) {
        this.TIMER.CURRENT = this.TIMER.STANDARD;
        this.HIDES_AFTER_AMOUNT = amount;
        
        this.Show(layer);
        
        return this;
    };

    this.RENDER = function() {
        for (let i = 0; i < this.PARTICLES.length; i++) {
            lx.CONTEXT.GRAPHICS.save();
            lx.CONTEXT.GRAPHICS.globalAlpha = this.PARTICLES[i].OPACITY;
            lx.DrawSprite(
                this.SPRITE, 
                this.PARTICLES[i].POS.X, 
                this.PARTICLES[i].POS.Y, 
                this.PARTICLES[i].SIZE, 
                this.PARTICLES[i].SIZE
            );
            lx.CONTEXT.GRAPHICS.restore();
        }
    };
    
    this.UPDATE = function() {
        if (this.TARGET != undefined) 
            this.POS = {
                X: this.TARGET.POS.X+this.OFFSET.X,
                Y: this.TARGET.POS.Y+this.OFFSET.Y
            };

        let VX = this.MOVEMENT.MAX_VX/lx.GAME.PHYSICS.STEPS,
            VY = this.MOVEMENT.MAX_VY/lx.GAME.PHYSICS.STEPS;
        
        for (let i = 0; i < this.PARTICLES.length; i++) {
            if (this.PARTICLES[i].TIMER.CURRENT >= this.PARTICLES[i].TIMER.STANDARD) 
                this.PARTICLES.splice(i, 1);
            else {
                if (this.MOVEMENT.DECELERATES) {
                    if (this.PARTICLES[i].MOVEMENT.VX > 0) {
                        if (this.PARTICLES[i].MOVEMENT.VX-VX < 0) 
                            this.PARTICLES[i].MOVEMENT.VX = 0;
                        else 
                            this.PARTICLES[i].MOVEMENT.VX-=VX;
                    }
                    if (this.PARTICLES[i].MOVEMENT.VY > 0) {
                        if (this.PARTICLES[i].MOVEMENT.VY-VY < 0) 
                            this.PARTICLES[i].MOVEMENT.VY = 0;
                        else 
                            this.PARTICLES[i].MOVEMENT.VY-=VY;
                    }
                    if (this.PARTICLES[i].MOVEMENT.VX < 0) {
                        if (this.PARTICLES[i].MOVEMENT.VX+VX > 0) 
                            this.PARTICLES[i].MOVEMENT.VX = 0;
                        else 
                            this.PARTICLES[i].MOVEMENT.VX+=VX;
                    }
                    if (this.PARTICLES[i].MOVEMENT.VY < 0) {
                        if (this.PARTICLES[i].MOVEMENT.VY+VY > 0) 
                            this.PARTICLES[i].MOVEMENT.VY = 0;
                        else 
                            this.PARTICLES[i].MOVEMENT.VY+=VY;
                    }
                }
                
                this.PARTICLES[i].POS.X += this.PARTICLES[i].MOVEMENT.VX;
                this.PARTICLES[i].POS.Y += this.PARTICLES[i].MOVEMENT.VY;

                this.PARTICLES[i].TIMER.CURRENT++;

                if (this.PARTICLES[i].OPACITY > 0) 
                    this.PARTICLES[i].OPACITY-=1/this.PARTICLES[i].TIMER.STANDARD;
                if (this.PARTICLES[i].OPACITY < 0) 
                    this.PARTICLES[i].OPACITY = 0;
            }
        }
        
        if (this.TIMER.CURRENT >= this.TIMER.STANDARD) {            
            for (let i = 0; i < this.AMOUNT;  i++) {
                if (this.PARTICLES.length >= lx.GAME.SETTINGS.LIMITERS.PARTICLES) 
                    break;
                
                this.PARTICLES.unshift({
                    POS: {
                        X: this.POS.X-this.SIZE.MAX/2+Math.random()*this.RANGE.X-Math.random()*this.RANGE.X,
                        Y: this.POS.Y-this.SIZE.MAX/2+Math.random()*this.RANGE.Y-Math.random()*this.RANGE.Y
                    },
                    SIZE: this.SIZE.MIN+Math.random()*(this.SIZE.MAX-this.SIZE.MIN),
                    MOVEMENT: {
                        VX: Math.random()*this.MOVEMENT.MIN_VX+Math.random()*this.MOVEMENT.MAX_VX,
                        VY: Math.random()*this.MOVEMENT.MIN_VY+Math.random()*this.MOVEMENT.MAX_VY
                    },
                    TIMER: {
                        STANDARD: this.DURATION,
                        CURRENT: 0
                    },
                    OPACITY: 1
                });
            }
            
            this.TIMER.CURRENT = 0;
            
            if (this.HIDES_AFTER_AMOUNT != undefined) {
                if (this.HIDES_AFTER_AMOUNT <= 0) {
                    this.Hide();
                    this.HIDES_AFTER_AMOUNT = undefined;
                } else this.HIDES_AFTER_AMOUNT--;
            }
        } else 
            this.TIMER.CURRENT++;
    };
};