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
    
    this.Static = function(boolean) {
        if (boolean == undefined) 
            return this.STATIC;
        else 
            this.STATIC = boolean;
        
        return this;
    };
    
    this.Solid = function(boolean) {
        if (boolean == undefined) 
            return this.SOLID;
        else 
            this.SOLID = boolean;
        
        return this;
    };
    
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
    
    this.Identifier = function(id) {
        if (id == undefined) 
            return this.IDENTIFIER;
        else 
            this.IDENTIFIER = id;
        
        return this;
    };
    
    this.Enable = function() {
        if (this.ENABLED) 
            return;
        
        this.COLLIDER_ID = lx.GAME.ADD_COLLIDER(this);
        
        this.ENABLED = true;
        
        return this;
    };
    
    this.Disable = function() {
        if (!this.ENABLED) return;
        
        lx.GAME.COLLIDERS[this.COLLIDER_ID] = undefined;
        this.COLLIDER_ID = undefined;
        
        this.ENABLED = false;
        
        return this;
    };
    
    if (callback != undefined) 
        this.OnCollide = callback;
    else 
        this.OnCollide = function() {};
    
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