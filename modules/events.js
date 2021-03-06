/** 
 * Add a on key event callback.
 * @param {string} key - The key which triggers the callback.
 * @param {function} callback - The callback function which provides event data (object).
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
 * @param {function} callback - The callback function which provides event data (object).
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
 * Add a on mouse move event callback.
 * @param {function} callback - The callback function which provides event data (object).
*/

this.OnMouseMove = function(callback) {
    lx.GAME.MOVE_MOUSE_EVENTS.push(callback);
    
    return this;
};

/**
 * Clear all on mouse move event callbacks.
*/

this.ClearMouseMove = function() {
    lx.GAME.MOVE_MOUSE_EVENTS = [];

    return this;
};

/**
 * Get the current mouse position in screen or optionally in world space.
 * @param {boolean} toWorld - Get the mouse position in world space, by default false.
 * @return {Object} Gets the mouse position as { X, Y } in screen or world space.
 */

this.GetMousePosition = function(toWorld) {
    let mousePosition = lx.CONTEXT.CONTROLLER.MOUSE.POS;

    if (toWorld) {
        //Check if a focus exists, this is necessary for converting to
        //screen space.

        if (lx.GAME.FOCUS == undefined)
            lx.GAME.LOG.ERROR(
                'GetMousePositionError', 
                'Cannot get the mouse position in world space when there is no focus target.'
            );
        else {
            let focusPos = lx.GAME.FOCUS.Position();
            let dim      = lx.GetDimensions();

            mousePosition = lx.GAME.TRANSLATE_FROM_FOCUS({
                X: focusPos.X+mousePosition.X-dim.width,
                Y: focusPos.Y+mousePosition.Y-dim.height
            });
        }
    } 
    
    return mousePosition;
};

/** 
 * Add an on resize callback right before the actual resizing.
 * @param {function} callback - The callback function which provides resize data (object).
*/

this.OnResize = function(callback) {
    this.GAME.ADD_ON_RESIZE_EVENT(callback);
    
    return this;
};

/**
 * Clear all on resize event callbacks.
*/

this.ClearResize = function() {
    this.GAME.ON_RESIZE_EVENTS = [];
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