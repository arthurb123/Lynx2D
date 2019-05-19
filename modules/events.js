/** 
 * Add a on key event callback.
 * @param {string} key - The key which triggers the callback.
 * @param {function} callback - The callback function which provides event data.
*/

this.OnKey = function(key, callback) {
    if (isNaN(key))
        this.GAME.ADD_EVENT('key', key.toLowerCase(), callback);
    else
        this.GAME.ADD_EVENT('key', key, callback);
    
    return this;
};

/** 
 * Clear on key event callbacks from a key.
 * @param {string} key - The key which event callbacks need to be cleared.
*/

this.ClearKey = function(key) {
    this.GAME.CLEAR_EVENT('key', key.toLowerCase());
    
    return this;
};

/** 
 * Stop the on key event from being called, until the key is pressed again.
 * @param {string} key - The key which needs to be stopped.
*/

this.StopKey = function(key) {
    lx.CONTEXT.CONTROLLER.KEYS[key.toLowerCase()] = false;
    lx.CONTEXT.CONTROLLER.STOPPED_KEYS[key.toLowerCase()] = true;
    
    return this;
};

/** 
 * Add a on mouse event callback.
 * @param {number} mouse - The mouse button which triggers the callback. (0, 1, 2)
 * @param {function} callback - The callback function which provides event data.
*/

this.OnMouse = function(button, callback) {
    this.GAME.ADD_EVENT('mousebutton', button, callback);
    
    return this;
};

/** 
 * Clear on mouse event callbacks from a button.
 * @param {number} button - The button which event callbacks need to be cleared.
*/

this.ClearMouse = function(button) {
    this.GAME.CLEAR_EVENT('mousebutton', button);
    
    return this;
};

/** 
 * Stop the on mouse event from being called, until the button is pressed again.
 * @param {number} button - The button which needs to be stopped.
*/

this.StopMouse = function(button) {
    lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[button] = false;
    lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[button] = true;
    
    return this;
};

/** 
 * Set the on mouse move event callback.
 * @param {function} callback - The callback function which provides event data.
*/

this.OnMouseMove = function(callback) {
    if (lx.CONTEXT.CONTROLLER != undefined) 
        lx.CONTEXT.CONTROLLER.MOUSE.ON_HOVER = callback;
    
    return this;
};

/**
 * Clear the on mouse move event callback.
*/

this.ClearMouseMove = function() {
    lx.CONTEXT.CONTROLLER.MOUSE.ON_HOVER = undefined;

    return this;
};

/** 
 * Add an update callback.
 * @param {function} callback - The callback function.
*/

this.Loops = function(callback) {
    this.GAME.ADD_LOOPS(callback);
    
    return this;
};

/** 
 * Remove all update callbacks
*/

this.ClearLoops = function() {
    this.GAME.LOOPS = [];
    
    return this;
};