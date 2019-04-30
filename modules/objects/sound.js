this.Sound = function (src, channel) {
    this.SRC = src;
    this.POS = { 
        X: 0, 
        Y: 0 
    };
    this.PLAY_ID = [];
    
    if (channel != undefined) 
        this.CHANNEL = channel;
    else 
        this.CHANNEL = 0;
    
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
    
    this.Stop = function() {
        if (this.PLAY_ID != undefined)
            lx.GAME.AUDIO.REMOVE(this.PLAY_ID);  
        
        this.PLAY_ID = undefined;
        
        return this;
    };
    
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
    
    this.Channel = function(channel) {
        if (channel != undefined) 
            this.CHANNEL = channel;
        else 
            return this.CHANNEL;
        
        return this;
    };
};