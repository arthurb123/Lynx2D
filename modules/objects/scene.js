/**
 * Lynx2D Scene
 * @constructor
 * @param {function} callback - The callback that gets executed once the Scene loads, all code should go in here.
 */

this.Scene = class {
    constructor (callback) {
        this.SAVED_STATE_AVAILABLE = false;
        this.CALLBACK = callback;
    };
    
    /** 
     * Saves the Scene's current state and content.
    */

    Save() {
        this.BUFFER = lx.GAME.BUFFER;
        this.UI = lx.GAME.UI;
        this.COLLIDERS = lx.GAME.COLLIDERS;
        this.FOCUS = lx.GAME.FOCUS;
        this.CONTROLLER_TARGET = lx.CONTEXT.CONTROLLER.TARGET;
        this.EVENTS = lx.GAME.EVENTS;
        this.LOOPS = lx.GAME.LOOPS;
        this.GO_MOUSE_EVENTS = lx.GAME.GO_MOUSE_EVENTS;
        this.LAYER_DRAW_EVENTS = lx.GAME.LAYER_DRAW_EVENTS;
        this.AUDIO_CHANNELS = lx.GAME.AUDIO.CHANNELS;
        this.AUDIO_SOUNDS = lx.GAME.AUDIO.SOUNDS;
        
        this.SAVED_STATE_AVAILABLE = true;
    };
    
    /** 
     * Restores the Scene's current state and content.
    */
    
    Restore() {
        //Check if a saved state is available
        
        if (!this.SAVED_STATE_AVAILABLE) 
            return;
        
        //Restore saved state

        lx.GAME.RESET();
        
        lx.GAME.BUFFER = this.BUFFER;
        lx.GAME.UI = this.UI;
        lx.GAME.COLLIDERS = this.COLLIDERS;
        lx.GAME.FOCUS = this.FOCUS;
        lx.CONTEXT.CONTROLLER.TARGET = this.CONTROLLER_TARGET;
        lx.GAME.EVENTS = this.EVENTS;
        lx.GAME.LOOPS = this.LOOPS;
        lx.GAME.GO_MOUSE_EVENTS = this.GO_MOUSE_EVENTS;
        lx.GAME.LAYER_DRAW_EVENTS = this.LAYER_DRAW_EVENTS;
        lx.GAME.AUDIO.CHANNELS = this.AUDIO_CHANNELS;
        lx.GAME.AUDIO.SOUNDS = this.AUDIO_SOUNDS;
    };
};