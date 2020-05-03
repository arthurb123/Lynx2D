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
     * Saves the Scene's current state and content
     * in memory.
    */

    Save() {
        //Create a snapshot of the current state

        let snapshot = lx.GAME.CREATE_SNAPSHOT();
        
        //Save to memory

        this.SAVE_DATA = snapshot;
        this.SAVED_STATE_AVAILABLE = true;
    };
    
    /** 
     * Restores the Scene's current state and content
     * from memory.
     * @returns {boolean} - Indicates if the restoration was successful.
    */
    
    Restore() {
        //Check if a saved state is available
        
        if (!this.SAVED_STATE_AVAILABLE) 
            return false;

        //Reset game

        lx.GAME.RESET();

        //Restore saved state

        lx.GAME.RESTORE_SNAPSHOT(snapshot);

        //Return successful

        return true;
    };
};