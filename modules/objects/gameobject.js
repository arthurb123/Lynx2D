this.GameObject = function (sprite, x, y, w, h) {
    this.SPRITE = sprite;
    this.BUFFER_ID = -1;
    this.CLICK_ID = [];
    this.BUFFER_LAYER = 0;
    this.UPDATES = true;
    this.OPACITY = 1.0;
    
    this.POS = {
        X: x,
        Y: y
    };
    
    this.MOVEMENT = {
        VX: 0,
        VY: 0,
        VMAX_X: 2,
        VMAX_Y: 2,
        WEIGHT: 1,
        DECELERATES: true,
        UPDATE: function() {
            if (this.DECELERATES) {
                let DX = this.VMAX_X/lx.GAME.PHYSICS.STEPS*this.WEIGHT,
                    DY = this.VMAX_Y/lx.GAME.PHYSICS.STEPS*this.WEIGHT;

                if (this.VX > 0) 
                    if (this.VX-DX < 0) 
                        this.VX = 0;
                    else 
                        this.VX-=DX;
                if (this.VY > 0) 
                    if (this.VY-DY < 0) 
                        this.VY = 0;
                    else 
                        this.VY-=DY;

                if (this.VX < 0) 
                    if (this.VX+DX > 0) 
                        this.VX = 0;
                    else 
                        this.VX+=DX;
                if (this.VY < 0) 
                    if (this.VY+DY > 0) 
                        this.VY = 0;
                    else 
                        this.VY+=DX;
            }
        },
        APPLY: function(VX, VY) {
            if (VX > 0 && this.VX+VX <= this.VMAX_X || VX < 0 && this.VX+VX >= -this.VMAX_X) 
                this.VX+=VX;
            else if (VX != 0) {
                if (this.VX+VX > this.VMAX_X) this.VX = this.VMAX_X;
                else if (this.VX+VX < -this.VMAX_X) this.VX = -this.VMAX_X;
            }
            
            if (VY > 0 && this.VY+VY <= this.VMAX_Y || VY < 0 && this.VY+VY >= -this.VMAX_Y) 
                this.VY+=VY;
            else if (VY != 0) {
                if (this.VY+VY > this.VMAX_Y) this.VY = this.VMAX_Y;
                else if (this.VY+VY < -this.VMAX_Y) this.VY = -this.VMAX_Y;
            }
        }
    };
    
    this.Identifier = function (ID) {
        if (ID == undefined) return this.ID;
        else this.ID = ID;
        
        return this;
    };
    
    this.Size = function(width, height) {
        if (width == undefined && height == undefined) 
            return this.SIZE;
        else {
            if (height == undefined)
                height = width;

            this.SIZE = {
                W: width,
                H: height
            };
        }
        
        return this;
    };
    
    this.Position = function(x, y) {
        if (x == undefined || y == undefined) return this.POS;
        else this.POS = {
            X: x,
            Y: y
        };
        
        return this;
    };
    
    this.Movement = function(vx, vy) {
        if (vx == undefined || vy == undefined) return {
            VX: this.MOVEMENT.VX,
            VY: this.MOVEMENT.VY
        };
        else {
            this.MOVEMENT.VX = vx;
            this.MOVEMENT.VY = vy;
        }
        
        return this;
    };
    
    this.Rotation = function(angle) {
        if (this.SPRITE == undefined || this.SPRITE == null) return -1;
        
        if (angle == undefined) return this.SPRITE.Rotation();
        else this.SPRITE.Rotation(angle);
        
        return this;
    };
    
    this.Opacity = function(factor) {
        if (factor == undefined) 
            return this.OPACITY;
        else 
            this.OPACITY = factor;
        
        return this;
    };
    
    this.Clip = function(c_x, c_y, c_w, c_h) {
        if (this.SPRITE == undefined || this.SPRITE == null) return -1;
        
        if (this.ANIMATION == undefined) {
            if (c_x == undefined || c_y == undefined || c_w == undefined || c_h == undefined) 
                return this.SPRITE.Clip();
            
            else 
                this.SPRITE.Clip(c_x, c_y, c_w, c_h);   
        }
        else {
            if (c_x == undefined || c_y == undefined || c_w == undefined || c_h == undefined) 
                return this.ANIMATION.GET_CURRENT_FRAME().Clip();
            
            else 
                console.log('Clipping Error: Clipping while an animation is playing is not possible');
        }
        
        return this;
    };
    
    this.MaxVelocity = function(max_vel_x, max_vel_y) {
        if (max_vel_x == undefined &&
            max_vel_y == undefined) 
            return {
                VX: this.MOVEMENT.VMAX_X,
                VY: this.MOVEMENT.VMAX_Y
            };
        else {
            this.MOVEMENT.VMAX_Y = this.MOVEMENT.VMAX_X = max_vel_x;
            
            if (max_vel_y != undefined)
                this.MOVEMENT.VMAX_Y = max_vel_y;
        }
        
        return this;
    };

    this.Weight = function(weight) {
        if (weight == undefined)
            return this.MOVEMENT.WEIGHT;
        else
            this.MOVEMENT.WEIGHT = weight;

        return this;
    };
    
    this.Show = function(layer) {
        if (this.BUFFER_ID != -1) this.Hide();
        
        this.BUFFER_ID = lx.GAME.ADD_TO_BUFFER(this, layer);
        this.BUFFER_LAYER = layer;
        
        if (this.COLLIDER != undefined) this.COLLIDER.Enable();
        
        return this;
    };
    
    this.Hide = function() {
        if (this.BUFFER_ID == -1) return;
        
        lx.GAME.BUFFER[this.BUFFER_LAYER][this.BUFFER_ID] = undefined;
        this.BUFFER_ID = -1;
        this.BUFFER_LAYER = 0;
        
        if (this.COLLIDER != undefined) this.COLLIDER.Disable();
        
        return this;
    };
    
    this.ShowAnimation = function(animation) {
        this.ANIMATION = animation;
        
        return this;
    };
    
    this.ClearAnimation = function() {
        this.ANIMATION = undefined;
        
        return this;
    };

    this.ShowColorOverlay = function(color, duration) {
        this.SPRITE.ShowColorOverlay(color, duration);

        return this;
    };

    this.HideColorOverlay = function() {
        this.SPRITE.HideColorOverlay();

        return this;
    };
    
    this.AddVelocity = function(vel_x, vel_y) {
        this.MOVEMENT.APPLY(vel_x, vel_y);
        
        return this;
    };
    
    this.MovementDecelerates = function(boolean) {
        this.MOVEMENT.DECELERATES = boolean;  
        
        return this;
    };
    
    this.SetTopDownController = function(x_speed, y_speed, max_vel_x, max_vel_y) {    
        lx.CONTEXT.CONTROLLER.TARGET = this;
        lx.OnKey('W', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(0, -y_speed); });
        lx.OnKey('A', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(-x_speed, 0); });
        lx.OnKey('S', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(0, y_speed); });
        lx.OnKey('D', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(x_speed, 0); });
        
        this.MaxVelocity(max_vel_x, max_vel_y);
        
        return this;
    };
    
    this.SetSideWaysController = function(speed, max_vel_x, max_vel_y) {
        lx.CONTEXT.CONTROLLER.TARGET = this;
        lx.OnKey('A', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(-speed, 0); });
        lx.OnKey('D', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(speed, 0); });
        
        this.MaxVelocity(max_vel_x, max_vel_y);
        
        return this;
    };
    
    this.ApplyCollider = function(collider) {
        if (collider == undefined) return;
        
        if (collider.ENABLED) {
            collider.Disable();
        }
        
        this.COLLIDER = collider;
        this.COLLIDER.OFFSET = {
            X: collider.POS.X,
            Y: collider.POS.Y
        };
        this.COLLIDER.Enable();
        
        return this;
    };
    
    this.ClearCollider = function() {
        if (this.COLLIDER == undefined) return;
        
        this.COLLIDER.Disable();
        this.COLLIDER = undefined;
        
        return this;
    };
    
    this.CreateCollider = function(is_static, callback) {
        this.COLLIDER = new lx.Collider(this.Position().X, this.Position().Y, this.Size().W, this.Size().H, is_static, callback);
        this.COLLIDER.OFFSET = {
            X: 0,
            Y: 0
        };
        this.COLLIDER.Enable();
        
        return this;
    };
    
    this.Focus = function() {
        lx.GAME.FOCUS_GAMEOBJECT(this);  
        
        return this;
    };
    
    this.Loops = function(callback) {
        this.LOOPS = callback;
        
        return this;
    };
    
    this.ClearLoops = function() {
        this.LOOPS = undefined;
        
        return this;
    };
    
    this.Draws = function(callback) {
        this.DRAWS = callback;  
        
        return this;
    };
    
    this.ClearDraws = function() {
        this.DRAWS = undefined;  
        
        return this;
    };
    
    this.OnMouse = function(button, callback) {
        if (this.CLICK_ID[button] != undefined) {
            console.log(lx.GAME.LOG.TIMEFORMAT() + 'GameObject already has a click handler for button ' + button + '.');
            
            return this;
        } else 
            this.CLICK_ID[button] = lx.GAME.ADD_GO_MOUSE_EVENT(this, button, callback);
        
        return this;
    };
    
    this.RemoveMouse = function(button) {
        if (this.CLICK_ID[button] == undefined) return this;
        else lx.GAME.REMOVE_GO_MOUSE_EVENT(this.CLICK_ID[button]);
            
        return this;
    };

    this.ClearMouse = function() {
        for (let i = 0; i < this.CLICK_ID.length; i++)  
            this.RemoveMouse(i);
    };
    
    this.RENDER = function() {  
        if (this.SPRITE == undefined || this.SPRITE == null) 
            return;
        
        if (lx.GAME.ON_SCREEN(this.POS, this.SIZE)) {
            if (this.ANIMATION == undefined) 
                this.SPRITE.RENDER(lx.GAME.TRANSLATE_FROM_FOCUS(this.POS), this.SIZE, this.OPACITY);
            else 
                this.ANIMATION.RENDER(lx.GAME.TRANSLATE_FROM_FOCUS(this.POS), this.SIZE, this.OPACITY);
            
            if (this.DRAWS != undefined) 
                this.DRAWS({
                    graphics: lx.CONTEXT.GRAPHICS,
                    position: this.POS,
                    size: this.SIZE
                });
        }
    };
    
    this.UPDATE = function() {
        if (this.LOOPS != undefined) 
            this.LOOPS();
        if (this.ANIMATION != undefined) 
            this.ANIMATION.UPDATE();

        this.MOVEMENT.UPDATE();

        this.POS.X += this.MOVEMENT.VX;
        this.POS.Y += this.MOVEMENT.VY;
        
        if (this.COLLIDER != undefined) 
            this.COLLIDER.POS = {
                X: this.POS.X+this.COLLIDER.OFFSET.X,
                Y: this.POS.Y+this.COLLIDER.OFFSET.Y
            };
    };
    
    if (w != undefined && h != undefined) 
        this.Size(w, h);

    else 
        console.log('GameObjectError: Created a GameObject without a specified size.');
};