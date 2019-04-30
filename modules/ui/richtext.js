this.UIRichText = function(string_array, x, y, size, color, font) {
    this.TEXT = string_array;
    this.POS = {
        X: x,
        Y: y
    };
    this.ALIGN = 'left';
    this.LINE_HEIGHT = size/4;

    if (font != undefined) this.FONT = font;
    else this.FONT = 'Verdana';
    if (color != undefined) this.COLOR = color;
    else this.COLOR = 'whitesmoke';
    if (size != undefined) this.SIZE = size;
    else this.SIZE = 14;
    
    this.Size = function(size) {
        if (size == undefined) return this.SIZE;
        else this.SIZE = size;
        
        return this;
    };
    
    this.LineHeight = function(line_height) {
        if (line_height == undefined) return this.LINE_HEIGHT;
        else this.LINE_HEIGHT = line_height;
        
        return this;
    };
    
    this.Position = function(x, y) {
        if (x == undefined || y == undefined) return this.POS;
        else this.POS = {
            X: x,
            Y: y
        };
        
        return this;
    };
    
    this.Text = function(string_array) {
        if (string_array != undefined) this.TEXT = string_array;  
        else return this.TEXT;
        
        return this;
    };
    
    this.TextLine = function(line, string) {
        if (line != undefined && string != undefined) this.TEXT[line] = string;
        else if (line != undefined) return this.TEXT[line];
        
        return this;
    };
    
    this.Alignment = function(alignment) {
        if (alignment == undefined) return this.ALIGN;
        else this.ALIGN = alignment;  
        
        return this;
    };
    
    this.Color = function(color) {
        if (color == undefined) return this.COLOR;
        else this.COLOR = color;
        
        return this;
    };
    
    this.Font = function(font) {
        if (font == undefined) return this.FONT;
        else this.FONT = font;
        
        return this;
    };
    
    this.Follows = function(target) {
        if (target != undefined) this.TARGET = target;
        else return this.TARGET;
        
        return this;
    };
    
    this.StopFollowing = function() {
        this.TARGET = undefined;
        
        return this;
    };
    
    this.RENDER = function() {
        lx.CONTEXT.GRAPHICS.save();
        lx.CONTEXT.GRAPHICS.font = this.SIZE + 'px ' + this.FONT;
        lx.CONTEXT.GRAPHICS.fillStyle = this.COLOR;
        lx.CONTEXT.GRAPHICS.textAlign = this.ALIGN;
        
        for (let i = 0; i < this.TEXT.length; i++) {
            let offset = i*this.LINE_HEIGHT+i*this.SIZE;
            
            if (this.TARGET != undefined) {
                if (lx.GAME.FOCUS != undefined) {
                    let POS = lx.GAME.TRANSLATE_FROM_FOCUS({ X: this.TARGET.POS.X+this.POS.X, Y: this.TARGET.POS.Y+this.POS.Y });
                    lx.CONTEXT.GRAPHICS.fillText(this.TEXT[i], POS.X, POS.Y+offset);
                }
                else lx.CONTEXT.GRAPHICS.fillText(this.TEXT[i], this.TARGET.POS.X+this.POS.X, this.TARGET.POS.Y+this.POS.Y+offset);
            }
            else lx.CONTEXT.GRAPHICS.fillText(this.TEXT[i], this.POS.X, this.POS.Y+offset);
        }
        
        lx.CONTEXT.GRAPHICS.restore();
    };
    
    this.UPDATE = function() {
        
    };
    
    this.Show = function() {
        if (this.UI_ID != undefined) return this;
        
        this.UI_ID = lx.GAME.ADD_UI_ELEMENT(this);
        
        return this;
    };
    
    this.Hide = function() {
        if (this.UI_ID == undefined) return this;
        
        lx.GAME.UI[this.UI_ID] = undefined;
        this.UI_ID = undefined;
        
        return this;
    };
};