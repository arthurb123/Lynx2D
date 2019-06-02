/**
 * Lynx2D Classical Noise
 * @constructor
 * @param {number} seed - The seed, can be left undefined
 */

this.Noise = function(seed) { 
    if (seed == undefined) 
        seed = Math.round(Math.random()*10000);

    this.GRAD = [[1,1],[-1,1],[1,-1],[-1,-1], 
                 [1,0],[-1,0],[1,0],[-1,0], 
                 [0,1],[0,-1],[0,1],[0,-1]]; 

    this.RANDOM = function() {
        let x = Math.sin(seed++) * 10000;

        return x - Math.floor(x);
    };

    this.P = [];
    for (let i=0; i<256; i++) 
        this.P[i] = Math.floor(this.RANDOM()*256);

    this.PERM = []; 
    for(var i=0; i<512; i++) 
        this.PERM[i]=this.P[i & 255];

    this.DOT = function(g, x, y) { 
        return g[0]*x + g[1]*y; 
    };

    this.MIX = function(a, b, t) { 
        return (1.0-t)*a + t*b; 
    };

    this.FADE = function(t) { 
        return t*t*t*(t*(t*6.0-15.0)+10.0); 
    };

    /** 
     * Get classical noise at the position.
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @return {number} A number ranging from -1 to 1.
    */

    this.Get = function(x, y) { 
        let X = Math.floor(x),
            Y = Math.floor(y); 
  
        x = x - X;
        y = y - Y;
  
        X = X & 255; 
        Y = Y & 255; 
  
        let gi00 = this.PERM[X+this.PERM[Y]] % 12,
            gi01 = this.PERM[X+this.PERM[Y+1]] % 12,
            gi10 = this.PERM[X+1+this.PERM[Y]] % 12,
            gi11 = this.PERM[X+1+this.PERM[Y+1]] % 12; 

        let n00 = this.DOT(this.GRAD[gi00], x, y),
            n10 = this.DOT(this.GRAD[gi10], x-1, y),
            n01 = this.DOT(this.GRAD[gi01], x, y-1),
            n11 = this.DOT(this.GRAD[gi11], x-1, y-1);

        let u = this.FADE(x),
            v = this.FADE(y);
 
        let nx0 = this.MIX(n00, n10, u),
            nx1 = this.MIX(n01, n11, u), 
            nxy = this.MIX(nx0, nx1, v);

        return nxy; 
    };
};