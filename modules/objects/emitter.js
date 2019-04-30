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
    this.SIZE = {
        MIN: 8,
        MAX: 16
    };
    this.TIMER = {
        STANDARD: 60,
        CURRENT: 60
    };
    this.AMOUNT = amount;
    this.DURATION = duration;
    this.PARTICLES = [];
    this.UPDATES = true;
    
    this.RENDER = function() {
        for (let i = 0; i < this.PARTICLES.length; i++) {
            lx.CONTEXT.GRAPHICS.save();
            lx.CONTEXT.GRAPHICS.globalAlpha = this.PARTICLES[i].OPACITY;
            lx.DrawSprite(this.SPRITE, this.PARTICLES[i].POS.X, this.PARTICLES[i].POS.Y, this.PARTICLES[i].SIZE, this.PARTICLES[i].SIZE);
            lx.CONTEXT.GRAPHICS.restore();
        }
    };
    
    this.UPDATE = function() {
        if (this.TARGET != undefined) {
            this.POS = {
                X: this.TARGET.POS.X+this.OFFSET.X,
                Y: this.TARGET.POS.Y+this.OFFSET.Y
            };
        }
        
        for (let i = 0; i < this.PARTICLES.length; i++) {
            if (this.PARTICLES[i].TIMER.CURRENT >= this.PARTICLES[i].TIMER.STANDARD) this.PARTICLES.splice(i, 1);
            else {
                if (this.MOVEMENT.DECELERATES) {
                    if (this.PARTICLES[i].MOVEMENT.VX > 0) {
                        if (this.PARTICLES[i].MOVEMENT.VX-this.MOVEMENT.MAX_VX/lx.GAME.PHYSICS.STEPS < 0) this.PARTICLES[i].MOVEMENT.VX = 0;
                        else this.PARTICLES[i].MOVEMENT.VX-=this.MOVEMENT.MAX_VX/lx.GAME.PHYSICS.STEPS;
                    }
                    if (this.PARTICLES[i].MOVEMENT.VY > 0) {
                        if (this.PARTICLES[i].MOVEMENT.VY-this.MOVEMENT.MAX_VY/lx.GAME.PHYSICS.STEPS < 0) this.PARTICLES[i].MOVEMENT.VY = 0;
                        else this.PARTICLES[i].MOVEMENT.VY-=this.MOVEMENT.MAX_VY/lx.GAME.PHYSICS.STEPS;
                    }
                    if (this.PARTICLES[i].MOVEMENT.VX < 0) {
                        if (this.PARTICLES[i].MOVEMENT.VX+this.MOVEMENT.MAX_VX/lx.GAME.PHYSICS.STEPS > 0) this.PARTICLES[i].MOVEMENT.VX = 0;
                        else this.PARTICLES[i].MOVEMENT.VX+=this.MOVEMENT.MAX_VX/lx.GAME.PHYSICS.STEPS;
                    }
                    if (this.PARTICLES[i].MOVEMENT.VY < 0) {
                        if (this.PARTICLES[i].MOVEMENT.VY+this.MOVEMENT.MAX_VY/lx.GAME.PHYSICS.STEPS > 0) this.PARTICLES[i].MOVEMENT.VY = 0;
                        else this.PARTICLES[i].MOVEMENT.VY+=this.MOVEMENT.MAX_VY/lx.GAME.PHYSICS.STEPS;
                    }
                }
                
                this.PARTICLES[i].POS.X += this.PARTICLES[i].MOVEMENT.VX;
                this.PARTICLES[i].POS.Y += this.PARTICLES[i].MOVEMENT.VY;
                this.PARTICLES[i].TIMER.CURRENT++;
                if (this.PARTICLES[i].OPACITY > 0) this.PARTICLES[i].OPACITY-=1/this.PARTICLES[i].TIMER.STANDARD;
                if (this.PARTICLES[i].OPACITY < 0) this.PARTICLES[i].OPACITY = 0;
            }
        }
        
        if (this.TIMER.CURRENT >= this.TIMER.STANDARD) {            
            for (let i = 0; i < this.AMOUNT;  i++) {
                if (this.PARTICLES.length >= lx.GAME.SETTINGS.LIMITERS.PARTICLES) break;
                
                let id = this.PARTICLES.length;
                
                this.PARTICLES[id] = {
                    POS: {
                        X: this.POS.X-this.SIZE.MAX/2,
                        Y: this.POS.Y-this.SIZE.MAX/2
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
                };
            }
            
            this.TIMER.CURRENT = 0;
            
            if (this.HIDES_AFTER_AMOUNT != undefined) {
                if (this.HIDES_AFTER_AMOUNT <= 0) {
                    this.Hide();
                    this.HIDES_AFTER_AMOUNT = undefined;
                } else this.HIDES_AFTER_AMOUNT--;
            }
        } else this.TIMER.CURRENT++;
    };
    
    this.Setup = function(min_vx, max_vx, min_vy, max_vy, min_size, max_size) {
        this.MOVEMENT.MIN_VX = min_vx;
        this.MOVEMENT.MAX_VX = max_vx;
        this.MOVEMENT.MIN_VY = min_vy;
        this.MOVEMENT.MAX_VY = max_vy;
        this.SIZE.MIN = min_size;
        this.SIZE.MAX = max_size;
        
        return this;
    };
    
    this.Speed = function(speed) {
        if (speed != undefined) this.TIMER.STANDARD = speed;
        else return this.TIMER.STANDARD;
        
        return this;
    };
    
    this.MovementDecelerates = function(decelerates) {
        if (decelerates != undefined) this.MOVEMENT.DECELERATES = decelerates;
        else return this.MOVEMENT.DECELERATES;
        
        return this;
    };
    
    this.Position = function(x, y) {
        if (x != undefined && y != undefined) {
            if (this.OFFSET == undefined) this.POS = {
                X: x,
                Y: y
            };
            else this.OFFSET = {
                X: x,
                Y: y
            };
        }
        else return this.POS;
        
        return this;
    };
    
    this.Follows = function(target) {
        if (target != undefined) {
            this.TARGET = target;
            this.OFFSET = this.POS;
        }
        else return this.TARGET;
        
        return this;
    };
    
    this.StopFollowing = function() {
        this.TARGET = undefined; 
        this.POS = this.OFFSET;
        this.OFFSET = undefined;
        
        return this;
    };
    
    this.Show = function(layer) {
        if (this.BUFFER_ID != -1) this.Hide();
        
        this.PARTICLES = [];
        
        this.BUFFER_ID = lx.GAME.ADD_TO_BUFFER(this, layer);
        this.BUFFER_LAYER = layer;
        
        return this;
    };
    
    this.Hide = function() {
        if (this.BUFFER_ID == -1) return;
        
        lx.GAME.BUFFER[this.BUFFER_LAYER][this.BUFFER_ID] = undefined; 
        
        this.BUFFER_ID = -1;
        this.BUFFER_LAYER = 0;
        
        return this;
    };
    
    this.Emit = function(layer, amount) {
        this.TIMER.CURRENT = this.TIMER.STANDARD;
        this.HIDES_AFTER_AMOUNT = amount;
        
        this.Show(layer);
        
        return this;
    };
};