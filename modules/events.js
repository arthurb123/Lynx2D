this.OnKey = function(key, callback) {
    this.GAME.ADD_EVENT('key', key.toLowerCase(), callback);
    
    return this;
};

this.ClearKey = function(key) {
    this.GAME.CLEAR_EVENT('key', key.toLowerCase());
    
    return this;
};

this.StopKey = function(key) {
    lx.CONTEXT.CONTROLLER.KEYS[key.toLowerCase()] = false;
    lx.CONTEXT.CONTROLLER.STOPPED_KEYS[key.toLowerCase()] = true;
    
    return this;
};

this.StopMouse = function(key) {
    lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[key] = false;
    lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[key] = true;
    
    return this;
};

this.OnMouse = function(key, callback) {
    this.GAME.ADD_EVENT('mousebutton', key, callback);
    
    return this;
};

this.ClearMouse = function(key) {
    this.GAME.CLEAR_EVENT('mousebutton', key);
    
    return this;
};

this.OnMouseMove = function(callback) {
    if (lx.CONTEXT.CONTROLLER == undefined) return this;
    
    lx.CONTEXT.CONTROLLER.MOUSE.ON_HOVER = callback;
    
    return this;
};

this.Loops = function(callback) {
    this.GAME.ADD_LOOPS(callback);
    
    return this;
};

this.ClearLoop = function(id) {
    this.GAME.LOOPS.splice(id, 1);
    
    return this;
};

this.ClearLoops = function() {
    this.GAME.LOOPS = [];
    
    return this;
};