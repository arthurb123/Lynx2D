this.FindGameObjectWithCollider = function(collider) {
    for (let i = 0; i < this.GAME.BUFFER.length; i++) {
        if (this.GAME.BUFFER[i] != undefined) {
            for (let ii = 0; ii < this.GAME.BUFFER[i].length; ii++) {
                if (this.GAME.BUFFER[i][ii] != undefined && this.GAME.BUFFER[i][ii].COLLIDER != undefined && this.GAME.BUFFER[i][ii].COLLIDER.COLLIDER_ID == collider.COLLIDER_ID) return this.GAME.BUFFER[i][ii];
            }
        }   
    }
};

this.FindGameObjectWithIdentifier = function(identifier) {
    for (let i = 0; i < this.GAME.BUFFER.length; i++) {
        if (this.GAME.BUFFER[i] != undefined) {
            for (let ii = 0; ii < this.GAME.BUFFER[i].length; ii++) {
                if (this.GAME.BUFFER[i][ii] != undefined && this.GAME.BUFFER[i][ii].ID != undefined && this.GAME.BUFFER[i][ii].ID == identifier) return this.GAME.BUFFER[i][ii];
            }
        }   
    }
};

this.FindGameObjectsWithIdentifier = function(identifier) {
    let result = [];
    
    for (let i = 0; i < this.GAME.BUFFER.length; i++) {
        if (this.GAME.BUFFER[i] != undefined) {
            for (let ii = 0; ii < this.GAME.BUFFER[i].length; ii++) {
                if (this.GAME.BUFFER[i][ii] != undefined && this.GAME.BUFFER[i][ii].ID != undefined && this.GAME.BUFFER[i][ii].ID == identifier) result[result.length] = this.GAME.BUFFER[i][ii];
            }
            
            return result;
        }   
    }
};