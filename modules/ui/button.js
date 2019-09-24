/**
 * Lynx2D UI Button
 * @extends UIElement
 * @constructor
 * @param {UIText} text - The button text (can be undefined).
 * @param {UITexture} texture - The button texture (can be undefined).
 * @param {number} x - The button x position (can be undefined, default is 0).
 * @param {number} y - The button y position (can be undefined, default is 0).
 * @param {number} w - The button width (can be undefined, default is 128).
 * @param {number} h - The button height (can be undefined, default is 32).
 */

this.UIButton = class extends UIElement {
    constructor(text, texture, x, y, w, h) {
        super(x, y);

        this.SIZE = {
            W: (w == undefined ? 128 : w),
            H: (h == undefined ? 32 : h)
        };
        this.CALLBACK = function() {            
            if (this.ON_CLICK != undefined) {
                lx.StopMouse(0);

                this.ON_CLICK();
            }
        };
        this.WAS_FOCUSSED = false;
        this.OPACITY = 1;

        //Text and texture handling

        this.Text(text);
        this.Texture(texture);
        if (text == undefined && texture == undefined)
            lx.GAME.LOG.ERROR(
                'ButtonCreationError',
                'Created a button without either a text or texture, or both.'
            );
    }

    /**
     * Get/Set the on click callback.
     * @param {Function} callback - Sets the callback if specified.
     * @return {Function} Gets the callback if left empty.
    */

    OnClick(callback) {
        if (callback != undefined)
            this.ON_CLICK = callback;
        else
            return this.ON_CLICK;

        return this;
    };

    /**
     * Get/Set the Text.
     * @param {UIText} text - Sets the Text if specified, automatically gets center aligned.
     * @return {UIText} Gets the Text if left empty.
    */

    Text(text) {
        if (text != undefined) {
            this.TEXT = text;
            this.TEXT.Alignment('center');
        }
        else 
            return this.TEXT;
        
        return this;
    };

    /**
     * Get/Set the Texture.
     * @param {UITexture} text - Sets the Texture if specified.
     * @return {UITexture} Gets the Texture if left empty.
    */

   Texture(texture) {
        if (texture != undefined) 
            this.TEXTURE = texture;  
        else 
            return this.TEXTURE;
        
        return this;
    };

    /** 
     * Get/Set the Button size.
     * @param {number} width - Sets width if specified, also sets height if the height is not specified.
     * @param {number} height - Sets height if specified.
     * @return {Object} Gets { W, H } if left empty.
    */
    
    Size(width, height) {
        if (width == undefined && height == undefined) 
            return this.SIZE;
        else {
            if (height == undefined)
                height = width;

            this.SIZE = {
                W: width,
                H: height
            };
        }
        
        return this;
    };

    //Private methods

    RENDER() {
        let POS = {
            X: this.POS.X,
            Y: this.POS.Y
        };

        if (this.TARGET != undefined) 
            POS = lx.GAME.TRANSLATE_FROM_FOCUS({ 
                X: this.TARGET.POS.X+this.OFFSET.X, 
                Y: this.TARGET.POS.Y+this.OFFSET.Y 
            });

        if (this.TEXTURE != undefined)
            this.TEXTURE.RENDER(POS, this.SIZE, this.OPACITY);
        if (this.TEXT != undefined) {
            this.TEXT.RENDER({
                X: POS.X + this.SIZE.W/2,
                Y: POS.Y + this.SIZE.H/2 + this.TEXT.SIZE*(1/3)
            }, this.OPACITY);
        }
    };

    UPDATE() {
        if (this.LOOPS != undefined)
            this.LOOPS();

        let HAS_TARGET = this.TARGET != undefined;
        let POS = {
            X: this.POS.X + (HAS_TARGET ? this.TARGET.POS.X : 0),
            Y: this.POS.Y + (HAS_TARGET ? this.TARGET.POS.Y : 0)
        };

        //Check if mouse is over button

        let MOUSE_OVER = lx.GAME.GET_MOUSE_IN_BOX(
            POS,
            this.SIZE,
            HAS_TARGET
        );

        if (MOUSE_OVER) {
            this.OPACITY = .875;
            this.WAS_FOCUSSED = true;

            document.body.style.cursor = 'pointer';

            if (lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[0])
                this.CALLBACK();
        } else if (this.WAS_FOCUSSED) {
            this.OPACITY = 1;
            this.WAS_FOCUSSED = false;

            document.body.style.cursor = 'default';
        }
    };
};