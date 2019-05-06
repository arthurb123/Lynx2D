/** 
 * Get/Set if image smoothing is enabled.
 * @param {boolean} smoothes - Sets image smoothing if specified.
 * @return {boolean} Gets image smoothing if left empty.
*/

this.Smoothing = function(smoothes) {
    if (smoothes == undefined) 
        return this.GAME.SETTINGS.AA;
    else 
        this.GAME.SETTINGS.AA = smoothes;  
    
    return this;
};

/** 
 * Get/Set the desired framerate.
 * @param {number} fps - Sets the desired framerate if specified.
 * @return {number} Gets the desired framerate if left empty.
*/

this.Framerate = function(fps) {
    if (fps == undefined) 
        return this.GAME.SETTINGS.FPS;
    else 
        this.GAME.SETTINGS.FPS = fps;  
    
    return this;
};

/** 
 * Get/Set the particle limit.
 * @param {number} amount - Sets the particle limit if specified.
 * @return {number} Gets the particle limit if left empty.
*/

this.ParticleLimit = function(amount) {
    if (amount != undefined) 
        this.GAME.SETTINGS.LIMITERS.PARTICLES = amount;
    else 
        return this.GAME.SETTINGS.LIMITERS.PARTICLES;
    
    return this;
};

/** 
 * Get/Set the volume (0-1) of a channel.
 * @param {number} channel - The channel.
 * @param {number} volume - Sets the volume of the channel if specified.
 * @return {number} Gets the volume of the channel if volume is undefined.
*/

this.ChannelVolume = function(channel, volume) {
    if (channel != undefined && volume != undefined) 
        this.GAME.AUDIO.SET_CHANNEL_VOLUME(channel, volume);
    else if (channel != undefined) 
        return this.GAME.AUDIO.GET_CHANNEL_VOLUME(channel);
    
    return this;
};