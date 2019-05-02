/**
 * Lynx2D Sound
 * @class
 * @param {string} src - The source of the audio file.
 * @param {number} channel - The channel the sound plays on, can be undefined (default is 0).
 */

this.Sound = function (src, channel) {
    this.SRC = src;
    this.POS = { 
        X: 0, 
        Y: 0 
    };
    this.PLAY_ID = [];

    //Check channel
    
    if (channel != undefined) 
        this.CHANNEL = channel;
    else 
        this.CHANNEL = 0;
        
    /** 
     * Get/Set the Sound's Channel.
     * @param {number} channel - Sets the channel if specified.
     * @return {number} Gets current channel if left empty.
    */

    this.Channel = function(channel) {
        if (channel != undefined) 
            this.CHANNEL = channel;
        else 
            return this.CHANNEL;
        
        return this;
    };

    /** 
     * Play the Sound.
     * @param {boolean} loops - Loops the sound after ending if specified, can be undefined.
     * @param {number} delay - Plays the sound after a delay if specified, can be undefined.
    */
    
    this.Play = function (loops, delay) {
        if (this.PLAY_ID != undefined && 
            lx.GAME.AUDIO.SOUNDS[this.PLAY_ID] != undefined)
            return;
        
        this.PLAY_ID = 
            lx.GAME.AUDIO.ADD(
                this.SRC, 
                this.CHANNEL, 
                delay, 
                loops
            );
        
        return this;
    };

    /** 
     * Play the Sound spatially, according to the Sound's position.
     * @param {boolean} loops - Loops the sound after ending if specified, can be undefined.
     * @param {number} delay - Plays the sound after a delay if specified, can be undefined.
    */
    
    this.PlaySpatial = function(loops, delay) {
        if (this.PLAY_ID != undefined && 
            lx.GAME.AUDIO.SOUNDS[this.PLAY_ID] != undefined)
            return;
        
        this.PLAY_ID = 
            lx.GAME.AUDIO.ADD_SPATIAL(
                this.POS, 
                this.SRC, 
                this.CHANNEL, 
                delay, 
                loops
            );
        
        return this;
    };

    /**
     * Stops the Sound if playing.
     */

    this.Stop = function() {
        if (this.PLAY_ID != undefined)
            lx.GAME.AUDIO.REMOVE(this.PLAY_ID);  
        
        this.PLAY_ID = undefined;
        
        return this;
    };

    /** 
     * Get/Set the Sound's Position.
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
};