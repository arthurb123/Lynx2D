/**
 * Lynx2D GameObject
 * @extends Showable
 * @constructor
 * @param {Sprite} sprite - The sprite of the GameObject, can be undefined.
 * @param {number} x - The GameObject x position (can be undefined, default is 0).
 * @param {number} y - The GameObject y position (can be undefined, default is 0).
 * @param {number} w - The GameObject width (can be undefined, assumes Sprite width).
 * @param {number} h - The GameObject height (can be undefined, assumes Sprite height).
 */

this.GameObject = class extends Showable {
    constructor (sprite, x, y, w, h) {
        super(x, y);

        this.SPRITE = sprite;
        this.CLICK_ID = [];
        this.OPACITY = 1.0;

        //Handle sizing

        this.SIZE = {
            W: 0,
            H: 0
        };

        if (w != undefined && h != undefined) 
            this.SIZE = {
                W: w,
                H: h
            };
        else if (sprite != undefined)
            this.SIZE = sprite.SPRITE_SIZE;
        else
            lx.GAME.LOG.ERROR(
                'GameObjectCreationError', 
                'Created a GameObject without a proper size.'
            );

        //Movement object

        this.MOVEMENT = {
            VX: 0,
            VY: 0,
            VMAX_X: 2,
            VMAX_Y: 2,
            WEIGHT: 1,
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
    };
    
    //Calls super, so does not need extra documentation
    
    Show(layer) {
        if (this.COLLIDER != undefined) 
            this.COLLIDER.Enable();
        
        return super.Show(layer);
    };
    
    //Calls super, so does not need extra documentation
    
    Hide() {
        if (this.COLLIDER != undefined) 
            this.COLLIDER.Disable();
        
        return super.Hide();
    };

    /** 
     * Get/Set the GameObject's Sprite.
     * @param {Sprite} sprite - Sets sprite if specified.
     * @return {Sprite} Gets sprite if left empty.
    */
    
    Sprite(sprite) {
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
    
    Identifier(ID) {
        if (ID == undefined) return this.ID;
        else this.ID = ID;
        
        return this;
    };
    
    /** 
     * Get/Set the GameObject's size.
     * @param {number} width - Sets width if specified, also sets height if the height is not specified.
     * @param {number} height - Sets height if specified.
     * @return {Object} Gets { W, H } if left empty.
    */
    
    Size(width, height) {
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
     * Get/Set the GameObject's rotation (in radians).
     * @param {number} angle - Sets new rotation if specified.
     * @return {number} Gets rotation if left empty.
    */
    
    Rotation(angle) {
        if (this.SPRITE == undefined &&
            this.ANIMATION == undefined) 
            return this;
        
        if (angle == undefined) {
            if (this.SPRITE != undefined &&
                this.ANIMATION == undefined)
                return this.SPRITE.Rotation();
            else if (this.ANIMATION != undefined)
                return this.ANIMATION.Rotation();
        }
        else {
            if (this.SPRITE != undefined &&
                this.ANIMATION == undefined)
                this.SPRITE.Rotation(angle);
            else if (this.ANIMATION != undefined)
                this.ANIMATION.Rotation(angle);

            if (this.COLLIDER != undefined)
                this.COLLIDER.Rotation(angle);
        }
        
        return this;
    };

    /** 
     * Get/Set the GameObject's opacity.
     * @param {number} opacity - Sets opacity if specified (0-1). 
     * @return {number} Gets opacity if left empty.
    */
    
    Opacity(opacity) {
        if (opacity == undefined) 
            return this.OPACITY;
        else 
            this.OPACITY = opacity;
        
        return this;
    };
    
    /** 
     * Get/Set the clip of the GameObject's Sprite.
     * @param {number} c_x - Sets clip x position if specified.
     * @param {number} c_y - Sets clip y position if specified.
     * @param {number} c_w - Sets clip width if specified.
     * @param {number} c_h - Sets clip height if specified.
     * @return {Object} Gets { X, Y, W, H } if left empty.
    */
    
    Clip(c_x, c_y, c_w, c_h) {
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
                lx.GAME.LOG.ERROR(
                    'ClippingError', 
                    'Clipping while an animation is playing is not possible.'
                );
        }
        
        return this;
    };
        
    /** 
     * Focusses the GameObject.
    */
        
    Focus() {
        lx.GAME.FOCUS_GAMEOBJECT(this);  
        
        return this;
    };

    /** 
     * Get/Set the GameObject's movement velocity. (can exceed max velocity upon set)
     * @param {number} vx - Sets x velocity if specified.
     * @param {number} vy - Sets y velocity if specified.
     * @return {Object} Gets { VX, VY } if left empty.
    */
    
    Movement(vx, vy) {
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
     * Adds velocity to the GameObject.
     * @param {number} vel_x - The x velocity to add.
     * @param {number} vel_y - The y velocity to add.
    */
    
    AddVelocity(vel_x, vel_y) {
        this.MOVEMENT.APPLY(vel_x, vel_y);
        
        return this;
    };
        
    /** 
     * Get/Set the GameObject's max velocities.
     * @param {number} max_vel_x - Sets max x velocity if specified. (Max x velocity also applies to the max y velocity if it is undefined) 
     * @param {number} max_vel_y - Sets max y velocity if specified. 
     * @return {Object} Gets { VX, VY } if left empty.
    */
    
    MaxVelocity(max_vel_x, max_vel_y) {
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
    
    MovementDecelerates(decelerates) {
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

    Weight(weight) {
        if (weight == undefined)
            return this.MOVEMENT.WEIGHT;
        else
            this.MOVEMENT.WEIGHT = weight;

        return this;
    };
    
    /** 
     * Creates a standard top down controller for the GameObject (WASD keys).
     * @param {number} x_speed - The x acceleration speed.
     * @param {number} y_speed - The y acceleration speed.
     * @param {number} max_vel_x - The max x velocity. (Max x velocity also applies to the max y velocity if it is undefined) 
     * @param {number} max_vel_y - The max y velocity.
    */
    
    SetTopDownController(x_speed, y_speed, max_vel_x, max_vel_y) {    
        lx.CONTEXT.CONTROLLER.TARGET = this;
        lx.OnKey('W', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(0, -y_speed); });
        lx.OnKey('A', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(-x_speed, 0); });
        lx.OnKey('S', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(0, y_speed); });
        lx.OnKey('D', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(x_speed, 0); });
        
        this.MaxVelocity(max_vel_x, max_vel_y);
        
        return this;
    };
    
    /** 
     * Creates a standard horizontal controller for the GameObject (AD keys).
     * @param {number} speed - The (x) acceleration speed.
     * @param {number} max_vel - The max (x and y) velocity.
    */
    
    SetSideWaysController(speed, max_vel) {
        lx.CONTEXT.CONTROLLER.TARGET = this;
        lx.OnKey('A', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(-speed, 0); });
        lx.OnKey('D', function() { lx.CONTEXT.CONTROLLER.TARGET.AddVelocity(speed, 0); });
        
        this.MaxVelocity(max_vel);
        
        return this;
    };
    
    /** 
     * Creates a standard box collider based on the GameObject's size.
     * @param {boolean} is_static - If static is true the collider can not be moved.
     * @param {function} callback - The collision callback, provides collision data as an object. (can be undefined)
    */
    
    CreateCollider(is_static, callback) {
        let pos = this.Position(),
            size = this.Size();

        this.COLLIDER = new lx.BoxCollider(
            pos.X, pos.Y, 
            size.W, size.H, 
            is_static, 
            callback
        );
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
    
    ApplyCollider(collider) {
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
    
    ClearCollider() {
        if (this.COLLIDER == undefined) return;
        
        this.COLLIDER.Disable();
        this.COLLIDER = undefined;
        
        return this;
    };
    
    /** 
     * Displays an Animation on the GameObject instead of it's Sprite.
     * @param {Animation} animation - The animation to show.
    */
    
    ShowAnimation(animation) {
        this.ANIMATION = animation;
        
        return this;
    };
    
    /**
     * Clears the current Animation and restores the Sprite.
    */
    
    ClearAnimation() {
        this.ANIMATION = undefined;
        
        return this;
    };
    
    /** 
     * Displays a color overlay on the GameObject.
     * @param {string} color - The color to be overlayed.
     * @param {number} duration - The duration of the color overlay, can be undefined.
    */

    ShowColorOverlay(color, duration) {
        if (this.ANIMATION != undefined) 
            this.ANIMATION.GET_CURRENT_FRAME().ShowColorOverlay(color, duration);
        else
            this.SPRITE.ShowColorOverlay(color, duration);

        return this;
    };
    
    /** 
     * Hides the current color overlay on the GameObject.
    */

    HideColorOverlay() {
        this.SPRITE.HideColorOverlay();

        return this;
    };
    
    /** 
     * Places a callback function in the GameObject's render loop, this gets called after the initial rendering.
     * @param {function} callback - The callback to be looped, provides rendering data as an object.
    */
    
    Draws(callback) {
        this.DRAWS = callback;  
        
        return this;
    };
    
    /** 
     * Clears the draws callback function being looped.
    */
    
    ClearDraws() {
        this.DRAWS = undefined;
        
        return this;
    };

    /** 
     * Places a callback function in the GameObject's render loop, this gets called before the initial rendering.
     * @param {function} callback - The callback to be looped, provides rendering data as an object.
    */
    
    PreDraws(callback) {
        this.PRE_DRAWS = callback;  
        
        return this;
    };

    /** 
     * Clears the pre draws callback function being looped.
    */
    
    ClearPreDraws() {
        this.PRE_DRAWS = undefined;
        
        return this;
    };
    
    /** 
     * Adds a mouse click event listener to the GameObject.
     * @param {number}   button - The button that triggers the event (0-2).
     * @param {function} callback - The event callback, provides mouse data as an object.
    */
    
    OnMouse(button, callback) {
        if (this.CLICK_ID[button] != undefined) {
            lx.GAME.LOG.ERROR(
                'GameObjectMouseError', 
                'GameObject already has a click handler for button ' + button + '.'
            );
            
            return this;
        } else 
            this.CLICK_ID[button] = lx.GAME.ADD_GO_MOUSE_EVENT(this, button, callback);
        
        return this;
    };
    
    /** 
     * Removes the mouse click event listener on the specified button.
     * @param {number}   button - The button that triggers the event (0-2).
    */
    
    RemoveMouse(button) {
        if (this.CLICK_ID[button] == undefined) 
            return this;
        else 
            lx.GAME.REMOVE_GO_MOUSE_EVENT(this.CLICK_ID[button]);
            
        return this;
    };

    /** 
     * Removes all mouse click event listeners.
    */
    
    ClearMouse() {
        for (let i = 0; i < this.CLICK_ID.length; i++)  
            this.RemoveMouse(i);
    };
    
    /** 
     * Adds a on mouse hover update callback.
     * @param {function} callback - The event callback, provides GameObject data { position, size }.
    */
    
    OnHover(callback) {
        if (this.ON_HOVER != undefined) {
            lx.GAME.LOG.ERROR(
                'GameObjectHoverError', 
                'GameObject already has a mouse hover handler.'
            );

            return this;
        } else
            this.ON_HOVER = callback;

        return this;
    };
    
    /** 
     * Adds a on mouse hover draw callback.
     * @param {function} callback - The event callback, provides drawing and GameObject data { graphics, position, size }.
    */

    OnHoverDraw(callback) {
        if (this.ON_HOVER_DRAW != undefined) {
            lx.GAME.LOG.ERROR(
                'GameObjectHoverDrawError', 
                'GameObject already has a mouse hover draw handler.'
            );

            return this;
        } else
            this.ON_HOVER_DRAW = callback;

        return this;
    };
    
    /** 
     * Removes the on mouse hover update callback.
    */
    
    RemoveHover() {
        this.ON_HOVER = undefined;

        return this;
    };
    
    /** 
     * Removes the on mouse hover draw callback.
    */

    RemoveHoverDraw() {
        this.ON_HOVER_DRAW = undefined;

        return this;
    };

    //Private methods
    
    RENDER() {        
        if (lx.GAME.ON_SCREEN(this.POS, this.SIZE)) {
            //Pre draws loop
                        
            if (this.PRE_DRAWS != undefined) 
                this.PRE_DRAWS({
                    graphics: lx.CONTEXT.GRAPHICS,
                    position: this.POS,
                    size: this.SIZE
                });

            //Draw sprite or animation
            
            if (this.ANIMATION == undefined) {
                if (this.SPRITE != undefined)
                    this.SPRITE.RENDER(
                        lx.GAME.TRANSLATE_FROM_FOCUS(this.POS), 
                        this.SIZE, 
                        this.OPACITY
                    );
            }
            else
                this.ANIMATION.RENDER(
                    lx.GAME.TRANSLATE_FROM_FOCUS(this.POS), 
                    this.SIZE, 
                    this.OPACITY
                );
            
            //Hover draw
            
            if (this.ON_HOVER_DRAW != undefined &&
                lx.GAME.GET_MOUSE_IN_BOX(this.POS, this.SIZE))
                this.ON_HOVER({
                    graphics: lx.CONTEXT.GRAPHICS,
                    position: this.POS,
                    size: this.SIZE
                });
            
            //Draws loop
            
            if (this.DRAWS != undefined) 
                this.DRAWS({
                    graphics: lx.CONTEXT.GRAPHICS,
                    position: this.POS,
                    size: this.SIZE
                });
        }
    };
    
    UPDATE() {
        if (this.TARGET != undefined) 
            this.POS = {
                X: this.TARGET.POS.X+this.OFFSET.X,
                Y: this.TARGET.POS.Y+this.OFFSET.Y
            };
        
        if (this.ANIMATION != undefined) 
            this.ANIMATION.UPDATE();
        if (this.LOOPS != undefined) 
            this.LOOPS();
        if (this.ON_HOVER != undefined &&
            lx.GAME.GET_MOUSE_IN_BOX(this.POS, this.SIZE))
            this.ON_HOVER({
                position: this.POS,
                size: this.SIZE
            });

        this.MOVEMENT.UPDATE();

        this.POS.X += this.MOVEMENT.VX;
        this.POS.Y += this.MOVEMENT.VY;
        
        if (this.COLLIDER != undefined) 
            this.COLLIDER.POS = {
                X: this.POS.X+this.COLLIDER.OFFSET.X,
                Y: this.POS.Y+this.COLLIDER.OFFSET.Y
            };
    };
};