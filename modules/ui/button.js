/**
 * Lynx2D UI Button
 * @extends UIElement
 * @constructor
 * @param {UIText | string} text - The button Text, if it is a string a standard UIText is created (can be undefined).
 * @param {UITexture | string} texture - The button Texture, if it is a string a colored UITexture is created (can be undefined).
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
            if (this.ON_CLICK) {
                lx.StopMouse(0);

                this.ON_CLICK();
            }
        };

        this.WAS_FOCUSSED = false;
        this.OPACITY = 1;

        this.ON_CLICK       = () => {};
        this.ON_MOUSE_OVER  = () => {};
        this.ON_MOUSE_ENTER = () => {};
        this.ON_MOUSE_LEAVE = () => {};

        //Text handling

        if (typeof text === 'string')
            text = new lx.UIText(text);

        this.Text(text);

        //Texture handling

        if (typeof texture === 'string')
            texture = new lx.UITexture(texture);

        this.Texture(texture);

        //Check for violations

        if (text == undefined && texture == undefined)
            lx.GAME.LOG.WARNING(
                'ButtonViolation',
                'Created a button without a text and texture.'
            );
    }

    /**
     * Get/Set the on click callback.
     * @param {Function} callback - Sets the callback if specified.
     * @return {Function} Gets the callback if left empty.
    */

    OnClick(callback) {
        if (callback)
            this.ON_CLICK = callback;
        else
            return this.ON_CLICK;

        return this;
    };

    /**
     * Get/Set the on mouse over callback.
     * @param {Function} callback - Sets the callback if specified.
     * @return {Function} Gets the callback if left empty.
     */

    OnMouseOver(callback) {
        if (callback)
            this.ON_MOUSE_OVER = callback;
        else
            return this.ON_MOUSE_OVER;

        return this;
    };

    /**
     * Get/Set the on mouse enter callback.
     * @param {Function} callback - Sets the callback if specified.
     * @return {Function} Gets the callback if left empty.
     */

    OnMouseEnter(callback) {
        if (callback)
            this.ON_MOUSE_ENTER = callback;
        else
            return this.ON_MOUSE_ENTER;

        return this;
    };

    /**
     * Get/Set the on mouse leave callback.
     * @param {Function} callback - Sets the callback if specified.
     * @return {Function} Gets the callback if left empty.
     */

    OnMouseLeave(callback) {
        if (callback)
            this.ON_MOUSE_LEAVE = callback;
        else
            return this.ON_MOUSE_LEAVE;

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
        let POS  = this.Position();
        let SIZE = this.Size();

        if (this.TARGET)
            POS = lx.GAME.TRANSLATE_FROM_FOCUS(POS);

        if (this.TEXTURE)
            this.TEXTURE.RENDER(POS, SIZE, this.OPACITY);
        if (this.TEXT) {
            this.TEXT.RENDER({
                X: POS.X + SIZE.W/2,
                Y: POS.Y + SIZE.H/2 + this.TEXT.SIZE*(1/3)
            }, this.OPACITY);
        }
    };

    UPDATE() {
        if (this.LOOPS)
            this.LOOPS();

        let POS  = this.Position();
        let SIZE = this.Size();

        let HAS_TARGET = this.TARGET != undefined;
        if (HAS_TARGET)
            POS = lx.GAME.TRANSLATE_FROM_FOCUS(POS);

        //Check if mouse is over button

        let MOUSE_OVER = lx.GAME.GET_MOUSE_IN_BOX(
            POS,
            SIZE,
            HAS_TARGET
        );

        if (MOUSE_OVER) {
            if (!this.WAS_FOCUSSED)
                this.ON_MOUSE_ENTER();

            this.OPACITY = .875;
            this.WAS_FOCUSSED = true;

            document.body.style.cursor = 'pointer';

            this.ON_MOUSE_OVER();

            if (lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[0])
                this.CALLBACK();
        } else if (this.WAS_FOCUSSED) {
            this.OPACITY = 1;
            this.WAS_FOCUSSED = false;

            document.body.style.cursor = 'default';

            this.ON_MOUSE_LEAVE();
        }
    };
};