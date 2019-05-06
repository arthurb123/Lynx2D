/**
 * Lynx2D GameObject
 * @class
 * @param {Sprite} sprite - The sprite of the GameObject, can be undefined.
 * @param {number}        x - The X position.
 * @param {number}        y - The Y position.
 * @param {number}        w - The width.
 * @param {number}        h - The height.
 */

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
        WEIGHT: 1.1,
        DECELERATES: true,
        UPDATE: function() {
            if (this.DECELERATES) {
                let DX = this.VMAX_X/(lx.GAME.PHYSICS.STEPS*this.WEIGHT),
                    DY = this.VMAX_Y/(lx.GAME.PHYSICS.STEPS*this.WEIGHT);

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
            if (VX > 0 && this.VX+VX <= this.VMAX_X || 
                VX < 0 && this.VX+VX >= -this.VMAX_X) 
                this.VX+=VX;
            else if (VX != 0) {
                if (this.VX+VX > this.VMAX_X) 
                    this.VX = this.VMAX_X;
                else if (this.VX+VX < -this.VMAX_X) 
                    this.VX = -this.VMAX_X;
            }
            
            if (VY > 0 && this.VY+VY <= this.VMAX_Y || 
                VY < 0 && this.VY+VY >= -this.VMAX_Y) 
                    this.VY+=VY;
            else if (VY != 0) {
                if (this.VY+VY > this.VMAX_Y) 
                    this.VY = this.VMAX_Y;
                else if (this.VY+VY < -this.VMAX_Y) 
                    this.VY = -this.VMAX_Y;
            }
        }
    };

    /** 
     * Get/Set the GameObject's Sprite.
     * @param {Sprite} sprite - Sets sprite if specified.
     * @return {Sprite} Gets sprite if left empty.
    */
    
    this.Sprite = function (sprite) {
        if (sprite == undefined) 
            return this.SPRITE;
        else 
            this.SPRITE = sprite;
        
        return this;
    };
    
    /** 
     * Get/Set the GameObject's identifier.
     * @param {string} ID - Sets identifier if specified.
     * @return {string} Gets identifier if left empty.
    */
    
    this.Identifier = function (ID) {
        if (ID == undefined) return this.ID;
        else this.ID = ID;
        
        return this;
    };
    
    /** 
     * Get/Set the GameObject's size.
     * @param {number} width - Sets width if specified, also sets height if the height is not specified.
     * @param {number} height - Sets height if specified.
     * @return {object} Gets { W, H } if left empty.
    */
    
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
    
    /** 
     * Get/Set the GameObject's position.
     * @param {number} x - Sets x position if specified.
     * @param {number} y - Sets y position if specified.
     * @return {object} Gets { X, Y } if left empty.
    */
    
    this.Position = function(x, y) {
        if (x == undefined || y == undefined) 
            return this.POS;
        else 
            this.POS = {
                X: x,
                Y: y
            };
        
        return this;
    };
    
    /** 
     * Get/Set the GameObject's movement velocity. (can exceed max velocity upon set)
     * @param {number} vx - Sets x velocity if specified.
     * @param {number} vy - Sets y velocity if specified.
     * @return {object} Gets { VX, VY } if left empty.
    */
    
    this.Movement = function(vx, vy) {
        if (vx == undefined || vy == undefined) 
        return {
            VX: this.MOVEMENT.VX,
            VY: this.MOVEMENT.VY
        };
        else {
            this.MOVEMENT.VX = vx;
            this.MOVEMENT.VY = vy;
        }
        
        return this;
    };
    
    /** 
     * Get/Set the GameObject's rotation (in radians).
     * @param {number} angle - Sets new rotation if specified.
     * @return {number} Gets rotation if left empty.
    */
    
    this.Rotation = function(angle) {
        if (this.SPRITE == undefined || this.SPRITE == null) 
            return -1;
        
        if (angle == undefined) 
            return this.SPRITE.Rotation();
        else 
            this.SPRITE.Rotation(angle);
        
        return this;
    };
    
    /** 
     * Get/Set the clip of the GameObject's Sprite.
     * @param {number} c_x - Sets clip x position if specified.
     * @param {number} c_y - Sets clip y position if specified.
     * @param {number} c_w - Sets clip width if specified.
     * @param {number} c_h - Sets clip height if specified.
     * @return {object} Gets { X, Y, W, H } if left empty.
    */
    
    this.Clip = function(c_x, c_y, c_w, c_h) {
        if (this.SPRITE == undefined || this.SPRITE == null) 
            return -1;
        
        if (this.ANIMATION == undefined) {
            if (c_x == undefined || 
                c_y == undefined || 
                c_w == undefined || 
                c_h == undefined) 
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
    
    /** 
     * Shows the GameObject on the specified layer.
     * @param {number} layer - The layer the GameObject should be shown on.
    */
    
    this.Show = function(layer) {
        if (this.BUFFER_ID != -1) 
            this.Hide();
        
        this.BUFFER_ID = lx.GAME.ADD_TO_BUFFER(this, layer);
        this.BUFFER_LAYER = layer;
        
        if (this.COLLIDER != undefined) 
            this.COLLIDER.Enable();
        
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
        
        if (this.COLLIDER != undefined) this.COLLIDER.Disable();
        
        return this;
    };
        
    /** 
     * Focusses the GameObject.
    */
        
    this.Focus = function() {
        lx.GAME.FOCUS_GAMEOBJECT(this);  
        
        return this;
    };
    
    /** 
     * Get/Set the GameObject's opacity.
     * @param {number} opacity - Sets opacity if specified (0-1). 
     * @return {number} Gets opacity if left empty.
    */
    
    this.Opacity = function(opacity) {
        if (opacity == undefined) 
            return this.OPACITY;
        else 
            this.OPACITY = opacity;
        
        return this;
    };
    
    /** 
     * Adds velocity to the GameObject.
     * @param {number} vel_x - The x velocity to add.
     * @param {number} vel_y - The y velocity to add.
    */
    
    this.AddVelocity = function(vel_x, vel_y) {
        this.MOVEMENT.APPLY(vel_x, vel_y);
        
        return this;
    };
        
    /** 
     * Get/Set the GameObject's max velocities.
     * @param {number} max_vel_x - Sets max x velocity if specified. (Max x velocity also applies to the max y velocity if it is undefined) 
     * @param {number} max_vel_y - Sets max y velocity if specified. 
     * @return {object} Gets { VX, VY } if left empty.
    */
    
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
    
    /** 
     * Get/Set if the GameObject decelerates.
     * @param {boolean} decelerates - Sets if movement decelerates.
     * @return {boolean} Gets if movement decelerates if left empty.
    */
    
    this.MovementDecelerates = function(decelerates) {
        if (decelerates != undefined)
            this.MOVEMENT.DECELERATES = decelerates;  
        else
            return this.MOVEMENT.DECELERATES;
        
        return this;
    };
    
    /** 
     * Get/Set the GameObject's weight, this affects movement deceleration (1 by default).
     * @param {number} weight - Sets weight if specified. 
     * @return {number} Gets weight if left empty.
    */

    this.Weight = function(weight) {
        if (weight == undefined)
            return this.MOVEMENT.WEIGHT;
        else
            this.MOVEMENT.WEIGHT = weight;

        return this;
    };
    
    /** 
     * Creates a standard top down controller for the GameObject.
     * @param {number} x_speed - The x acceleration speed.
     * @param {number} y_speed - The y acceleration speed.
     * @param {number} max_vel_x - The max x velocity. (Max x velocity also applies to the max y velocity if it is undefined) 
     * @param {number} max_vel_y - The max y velocity.
    */
    
    this.SetTopDownController = function(x_speed, y_speed, max_vel_x, max_vel_y) {    
        lx.CONTEXT.CONTROLLER.TARGET = this;
        lx.OnKey('W', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(0, -y_speed); });
        lx.OnKey('A', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(-x_speed, 0); });
        lx.OnKey('S', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(0, y_speed); });
        lx.OnKey('D', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(x_speed, 0); });
        
        this.MaxVelocity(max_vel_x, max_vel_y);
        
        return this;
    };
    
    /** 
     * Creates a standard top down controller for the GameObject.
     * @param {number} speed - The (x) acceleration speed.
     * @param {number} max_vel - The max (x and y) velocity.
    */
    
    this.SetSideWaysController = function(speed, max_vel) {
        lx.CONTEXT.CONTROLLER.TARGET = this;
        lx.OnKey('A', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(-speed, 0); });
        lx.OnKey('D', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(speed, 0); });
        
        this.MaxVelocity(max_vel);
        
        return this;
    };
    
    /** 
     * Creates a standard collider based on the GameObject's size.
     * @param {boolean} is_static - If static is true the collider can not be moved.
     * @param {function} callback - The collision callback, provides collision data as an object. (can be undefined)
    */
    
    this.CreateCollider = function(is_static, callback) {
        let pos = this.Position(),
            size = this.Size();

        this.COLLIDER = new lx.Collider(pos.X, pos.Y, size.W, size.H, is_static, callback);
        this.COLLIDER.OFFSET = {
            X: 0,
            Y: 0
        };
        this.COLLIDER.Enable();
        
        return this;
    };
    
    /** 
     * Applies a collider to the GameObject.
     * @param {Collider} collider - The collider to be applied.
    */
    
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
    
    /** 
     * Removes the GameObject's Collider.
    */
    
    this.ClearCollider = function() {
        if (this.COLLIDER == undefined) return;
        
        this.COLLIDER.Disable();
        this.COLLIDER = undefined;
        
        return this;
    };
    
        /** 
     * Displays an Animation on the GameObject instead of it's Sprite.
     * @param {Animation} animation - The animation to show.
    */
    
    this.ShowAnimation = function(animation) {
        this.ANIMATION = animation;
        
        return this;
    };
    
    /**
     * Clears the current Animation and restores the Sprite.
    */
    
    this.ClearAnimation = function() {
        this.ANIMATION = undefined;
        
        return this;
    };
    
    /** 
     * Displays a color overlay on the GameObject.
     * @param {string} color - The color to be overlayed.
     * @param {number} duration - The duration of the color overlay, can be undefined.
    */

    this.ShowColorOverlay = function(color, duration) {
        if (this.ANIMATION != undefined) 
            this.ANIMATION.GET_CURRENT_FRAME().ShowColorOverlay(color, duration);
        else
            this.SPRITE.ShowColorOverlay(color, duration);

        return this;
    };
    
    /** 
     * Hides the current color overlay on the GameObject.
    */

    this.HideColorOverlay = function() {
        this.SPRITE.HideColorOverlay();

        return this;
    };
    
    /** 
     * Places a callback function in the GameObject's update loop.
     * @param {function} callback - The callback to be looped.
    */
    
    this.Loops = function(callback) {
        this.LOOPS = callback;
        
        return this;
    };
    
    /** 
     * Clears the update callback function being looped.
    */
    
    this.ClearLoops = function() {
        this.LOOPS = undefined;
        
        return this;
    };
    
    /** 
     * Places a callback function in the GameObject's render loop.
     * @param {function} callback - The callback to be looped, provides rendering data as an object.
    */
    
    this.Draws = function(callback) {
        this.DRAWS = callback;  
        
        return this;
    };
    
    /** 
     * Clears the rendering callback function being looped.
    */
    
    this.ClearDraws = function() {
        this.DRAWS = undefined;  
        
        return this;
    };
    
    /** 
     * Adds a mouse click event listener to the GameObject.
     * @param {number}   button - The button that triggers the event (0-2).
     * @param {function} callback - The event callback, provides mouse data as an object.
    */
    
    this.OnMouse = function(button, callback) {
        if (this.CLICK_ID[button] != undefined) {
            console.log(lx.GAME.LOG.TIMEFORMAT() + 'GameObject already has a click handler for button ' + button + '.');
            
            return this;
        } else 
            this.CLICK_ID[button] = lx.GAME.ADD_GO_MOUSE_EVENT(this, button, callback);
        
        return this;
    };
    
    /** 
     * Removes the mouse click event listener on the specified button.
     * @param {number}   button - The button that triggers the event (0-2).
    */
    
    this.RemoveMouse = function(button) {
        if (this.CLICK_ID[button] == undefined) return this;
        else lx.GAME.REMOVE_GO_MOUSE_EVENT(this.CLICK_ID[button]);
            
        return this;
    };

    /** 
     * Removes all mouse click event listeners.
    */
    
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