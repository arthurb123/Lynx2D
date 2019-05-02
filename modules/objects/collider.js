/**
 * Lynx2D Collider
 * @constructor
 * @param {number} x - The collider x position (or x offset).
 * @param {number} y - The collider y position (or y offset).
 * @param {number} w - The collider width.
 * @param {number} h - The collider height.
 * @param {boolean} is_static - If static is true the collider can not be moved.
 * @param {function} callback - The collision callback, provides collision data as an object. (Can be undefined)
 */

this.Collider = function (x, y, w, h, is_static, callback) {
    this.POS = {
        X: x,
        Y: y
    };
    this.OFFSET = {
        X: 0,
        Y: 0
    };
    this.SIZE = {
        W: w,
        H: h
    };
    this.STATIC = is_static;
    this.SOLID = true;
    this.ENABLED = false;

    //Setup callback
    
    if (callback != undefined) 
        this.OnCollide = callback;
    else 
        this.OnCollide = function() {};
    
    /** 
     * Get/Set the Collider's size.
     * @param {number} width - Sets the collider width if specified.
     * @param {number} height - Sets the collider height if specified.
     * @return {object} Gets { W, H } if left empty.
    */

    this.Size = function(width, height) {
        if (width == undefined || height == undefined) 
            return this.SIZE;
        else 
            this.SIZE = {
                W: width,
                H: height
            };
        
        return this;
    };

    /** 
     * Get/Set if the Collider is static. (Can not be moved by other colliders)
     * @param {boolean} is_static - Sets if the collider is static if specified.
     * @return {boolean} Gets if the collider is static if left empty.
    */
    
    this.Static = function(is_static) {
        if (is_static == undefined) 
            return this.STATIC;
        else 
            this.STATIC = is_static;
        
        return this;
    };

    /** 
     * Get/Set if the Collider is solid. (Does not pass through other colliders)
     * @param {boolean} is_solid - Sets if the collider is solid if specified.
     * @return {boolean} Gets if the collider is solid if left empty.
    */
    
    this.Solid = function(is_solid) {
        if (is_solid == undefined) 
            return this.SOLID;
        else 
            this.SOLID = is_solid;
        
        return this;
    };

    /** 
     * Get/Set the Collider's position (or offset).
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
     * Get/Set the Collider's identifier.
     * @param {string} ID - Sets identifier if specified.
     * @return {string} Gets identifier if left empty.
    */
    
    this.Identifier = function(ID) {
        if (ID == undefined) 
            return this.IDENTIFIER;
        else 
            this.IDENTIFIER = ID;
        
        return this;
    };

    /** 
     * Enables the Collider.
    */
    
    this.Enable = function() {
        if (this.ENABLED) 
            return;
        
        this.COLLIDER_ID = lx.GAME.ADD_COLLIDER(this);
        
        this.ENABLED = true;
        
        return this;
    };

    /** 
     * Disables the Collider.
    */
    
    this.Disable = function() {
        if (!this.ENABLED) return;
        
        lx.GAME.COLLIDERS[this.COLLIDER_ID] = undefined;
        this.COLLIDER_ID = undefined;
        
        this.ENABLED = false;
        
        return this;
    };
    
    this.CheckCollision = function(collider) {
        //If the collider has not been fully initialized yet, stop collision detection.

        if (this.POS.X != 0 && 
            this.POS.Y != 0 && 
            this.POS.X == this.OFFSET.X && 
            this.POS.Y == this.OFFSET.Y) 
            return false;

        //Check if collision occurred
        
        let result = !(((collider.POS.Y + collider.SIZE.H) < (this.POS.Y)) || 
                        (collider.POS.Y > (this.POS.Y + this.SIZE.H)) || 
                        ((collider.POS.X + collider.SIZE.W) < this.POS.X) || 
                        (collider.POS.X > (this.POS.X + this.SIZE.W)
                      ));

        //Check direction if occurance took place
        
        if (result) {
            let lowest, distances = [{
                tag: 'right',
                actual: Math.abs(this.POS.X-collider.POS.X-collider.SIZE.W)
            },
            {
                tag: 'left',
                actual: Math.abs(collider.POS.X-this.POS.X-this.SIZE.W)
            },
            {
                tag: 'down',
                actual: Math.abs(this.POS.Y-collider.POS.Y-collider.SIZE.H)
            },
            {
                tag: 'up',
                actual: Math.abs(collider.POS.Y-this.POS.Y-this.SIZE.H)
            }];

            //Check which directional distance is the smallest
            
            distances.forEach(function (obj) {
                if (lowest == undefined || 
                    obj.actual < lowest.actual) 
                    lowest = obj;
            });

            //Generate collider response

            let response = {
                direction: lowest.tag
            };
            
            //Adjust position respectively

            if (this.SOLID && 
                !collider.STATIC) {
                    let go = lx.FindGameObjectWithCollider(collider);

                    if (go != undefined) {
                        //Add the gameObject property to
                        //the collision response

                        response.gameObject = go;

                        //Adjust position

                        let pos = go.Position();
                        switch(lowest.tag) {
                            case 'right':
                                go.Position(pos.X-lowest.actual, pos.Y);
                                break;
                            case 'left':
                                go.Position(pos.X+lowest.actual, pos.Y);
                                break;
                            case 'down':
                                go.Position(pos.X, pos.Y-lowest.actual);
                                break;
                            case 'up':
                                go.Position(pos.X, pos.Y+lowest.actual);
                                break;
                        };
                }
            }
            
            //Return response

            return response;
        } 

        //Otherwise return result (false)

        else 
            return false;
    };
    
    if (is_static) 
        this.Enable();
};