/** 
 * Find the GameObject with the specified Collider.
 * @param {Collider} collider - The GameObject's Collider.
 * @return {GameObject} The GameObject which uses the Collider.
*/

this.FindGameObjectWithCollider = function(collider) {
    for (let i = 0; i < this.GAME.BUFFER.length; i++) {
        if (this.GAME.BUFFER[i] != undefined) {
            for (let ii = 0; ii < this.GAME.BUFFER[i].length; ii++) {
                if (this.GAME.BUFFER[i][ii] != undefined && this.GAME.BUFFER[i][ii].COLLIDER != undefined && this.GAME.BUFFER[i][ii].COLLIDER.COLLIDER_ID == collider.COLLIDER_ID) return this.GAME.BUFFER[i][ii];
            }
        }   
    }
};

/** 
 * Find the GameObject with the specified identifier.
 * @param {string} ID - The identifier.
 * @return {GameObject} The GameObject which has the identifier.
*/

this.FindGameObjectWithIdentifier = function(ID) {
    for (let i = 0; i < this.GAME.BUFFER.length; i++) 
        if (this.GAME.BUFFER[i] != undefined) 
            for (let ii = 0; ii < this.GAME.BUFFER[i].length; ii++) 
                if (this.GAME.BUFFER[i][ii] != undefined && 
                    this.GAME.BUFFER[i][ii].Identifier != undefined &&
                    this.GAME.BUFFER[i][ii].Identifier() === ID) 
                    return this.GAME.BUFFER[i][ii];
};

/** 
 * Find GameObjects with the specified identifier.
 * @param {string} ID - The identifier.
 * @return {GameObject[]} The GameObjects which have the identifier.
*/

this.FindGameObjectsWithIdentifier = function(ID) {
    let result = [];
    
    for (let i = 0; i < this.GAME.BUFFER.length; i++) 
        if (this.GAME.BUFFER[i] != undefined) {
            for (let ii = 0; ii < this.GAME.BUFFER[i].length; ii++)
                if (this.GAME.BUFFER[i][ii] != undefined && 
                    this.GAME.BUFFER[i][ii].Identifier != undefined &&
                    this.GAME.BUFFER[i][ii].Identifier() === ID) 
                    result[result.length] = this.GAME.BUFFER[i][ii];
            
            return result;
        }   
};