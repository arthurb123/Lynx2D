/** 
 * Initializes Lynx2D.
 * @param {Element} target - The DOM element in which the canvas gets instantiated, can be undefined (default is body).
*/

this.Initialize = function(target) {
    //Setup canvas

    this.CONTEXT.CANVAS = document.createElement('canvas');
    this.CONTEXT.CANVAS.id = 'lynx-canvas';
    this.CONTEXT.CANVAS.style = 'background-color: #282828;';
    this.CONTEXT.CANVAS.innerHTML = 'HTML5 canvas not supported on this browser.';
    this.CONTEXT.CANVAS.oncontextmenu = function(e) { 
        e.preventDefault(); 
        return false; 
    };
    
    //Setup graphics
    
    this.CONTEXT.GRAPHICS = this.CONTEXT.CANVAS.getContext('2d');

    //Older framework usability

    let targetIsString = (typeof target === 'string');

    //Check if target is supplied
    //and add to target (standard is body)
    
    if (target == undefined ||
        targetIsString) {
        if (targetIsString)
            document.title = target;

        target = document.body;
        this.CONTEXT.CANVAS.style = 'background-color: #282828; position: absolute; top: 0px; left: 0px;';
    }

    target.appendChild(this.CONTEXT.CANVAS);
    
    //Setup window

    window.onresize = function() {
        let width = target.offsetWidth,
            height = target.offsetWidth;

        if (target == document.body) {
            width = self.innerWidth;
            height = self.innerHeight;
        }

        let dx = width - lx.CONTEXT.CANVAS.width,
            dy = height - lx.CONTEXT.CANVAS.height;
             
        lx.GAME.ON_RESIZE_EVENTS.forEach(function(cb) {
            cb({
                dx: dx,
                dy: dy,
                oldWidth: lx.CONTEXT.CANVAS.width,
                oldHeight: lx.CONTEXT.CANVAS.height,
                width: width,
                height: height
            }); 
        });
        
        lx.CONTEXT.CANVAS.width = width;
        lx.CONTEXT.CANVAS.height = height;
    };

    window.onresize();
    
    //Create standard controller

    if (this.CONTEXT.CONTROLLER == undefined)
        this.CreateController();
    
    return this;
};

/** 
 * Starts the game loop.
 * @param {number} fps - The desired FPS, can be undefined (default is 60).
*/

this.Start = function(fps) {
    //Init game loop

    if (fps == undefined)
        fps = 60;

    this.GAME.INIT(fps);
    
    return this;
};

/** 
 * Get/Set the background color.
 * @param {string} color - Sets the background color if specified.
 * @return {string} Gets the background color if left empty.
*/

this.Background = function(color) {
    if (this.CONTEXT.CANVAS == undefined) {
        if (color != undefined) 
            return this;
        else 
            return;
    }
    
    if (color == undefined) 
        return this.CONTEXT.CANVAS.style.backgroundColor;
    else
        this.CONTEXT.CANVAS.style.backgroundColor = color;
    
    return this;
};

/** 
 * Get/Set the rendering scale (default is 1).
 * @param {number} scale - Sets the rendering scale if specified.
 * @return {number} Gets the rendering scale if left empty.
*/

this.Scale = function(scale) {
    if (scale == undefined)
        return this.GAME.SCALE;
    else
        this.GAME.SCALE = scale;
};

/** 
 * Gets the dimensions of the canvas.
 * @return {Object} Gets {width, height}.
*/

this.GetDimensions = function() {
    if (this.CONTEXT.CANVAS == undefined) {
        this.GAME.LOG.ERROR(
            'DimensionRetrievalError', 
            'Could not get canvas dimensions, Lynx2D is probably not initialized yet.'
        );
        
        return {
            width: self.innerWidth,
            height: self.innerHeight
        }
    }
    
    return {
        width: this.CONTEXT.CANVAS.width,
        height: this.CONTEXT.CANVAS.height
    };
};

/** 
 * Loads a Scene, executing it's callback.
 * @param {Scene} color - The scene to be loaded.
*/

this.LoadScene = function(scene) {
    //Clear previous data
    this.GAME.RESET();
    
    //Create new controller
    this.CreateController();
    
    //Call new scene
    scene.CALLBACK();
    
    //[ENGINE-FEATURE] Notify engine of scene change
    if (scene.ENGINE_ID != undefined)
        console.log("ENGINE_INTERACTION_LOAD_SCENE(" + scene.ENGINE_ID + ")");
    
    return this;
};

/** 
 * Creates a new controller.
*/

this.CreateController = function() {
    //Create a new controller
    this.CONTEXT.CONTROLLER = {
        KEYS: [],
        STOPPED_KEYS: [],
        MOUSE: {
            POS: {
                X: 0,
                Y: 0
            },
            BUTTONS: [],
            STOPPED_BUTTONS: []
        }
    };
    
    //Init/clear set game events
    this.GAME.EVENTS = [];
    
    //Append event listeners
    
    //Key events
    
    document.addEventListener('keydown', function(EVENT) { 
        lx.GAME.AUDIO.CAN_PLAY = true; 
        
        if (lx.CONTEXT.CONTROLLER.STOPPED_KEYS[String.fromCharCode(EVENT.keyCode).toLowerCase()]) return; 
        
        if (EVENT.keyCode === 27)
                lx.CONTEXT.CONTROLLER.KEYS['escape'] = true;
        
        lx.CONTEXT.CONTROLLER.KEYS[String.fromCharCode(EVENT.keyCode).toLowerCase()] = true;
        lx.CONTEXT.CONTROLLER.KEYS[EVENT.keyCode] = true;
    });
    
    document.addEventListener('keyup', function(EVENT) { 
        if (!lx.CONTEXT.CONTROLLER.STOPPED_KEYS[String.fromCharCode(EVENT.keyCode).toLowerCase()]) 
            lx.GAME.INVALIDATE_EVENT('key', String.fromCharCode(EVENT.keyCode).toLowerCase());
        
        lx.CONTEXT.CONTROLLER.STOPPED_KEYS[String.fromCharCode(EVENT.keyCode).toLowerCase()] = false; 
        
        if (EVENT.keyCode === 27)
            lx.CONTEXT.CONTROLLER.KEYS['escape'] = false;
        
        lx.CONTEXT.CONTROLLER.KEYS[String.fromCharCode(EVENT.keyCode).toLowerCase()] = false;
        lx.CONTEXT.CONTROLLER.KEYS[EVENT.keyCode] = false;
    });
    
    //Mouse events
    
    this.CONTEXT.CANVAS.addEventListener('mousedown', function(EVENT) { 
        lx.GAME.AUDIO.CAN_PLAY = true; 
        
        if (lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[EVENT.button]) return; 
        
        lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[EVENT.button] = true; 
        lx.GAME.HANDLE_MOUSE_CLICK(EVENT.button); 
    });
    
    this.CONTEXT.CANVAS.addEventListener('mouseup', function(EVENT) { 
        if (!lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[EVENT.button])
            lx.GAME.INVALIDATE_EVENT('mousebutton', EVENT.button);
        
        lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[EVENT.button] = false; 
        lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[EVENT.button] = false; 
    });
    
    document.addEventListener('mousemove', function(EVENT) { 
        lx.CONTEXT.CONTROLLER.MOUSE.POS = { X: EVENT.pageX, Y: EVENT.pageY }; 
        if (lx.CONTEXT.CONTROLLER.MOUSE.ON_HOVER != undefined) lx.CONTEXT.CONTROLLER.MOUSE.ON_HOVER(lx.CONTEXT.CONTROLLER.MOUSE.POS); 
    });
    
    //Touch events
    
    const options = {
        passive: true
    };

    this.CONTEXT.CANVAS.addEventListener('touchstart', function(EVENT) {
        lx.GAME.AUDIO.CAN_PLAY = true;

        let TOUCH = EVENT.touches[0];
        lx.CONTEXT.CONTROLLER.MOUSE.POS = { X: TOUCH.pageX, Y: TOUCH.pageY };

        if (lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[0]) return;
        lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[0] = true;
        lx.GAME.HANDLE_MOUSE_CLICK(0);
    }, options);
    this.CONTEXT.CANVAS.addEventListener('touchend', function(EVENT) {
        if (!lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[0])
            lx.GAME.INVALIDATE_EVENT('mousebutton', 0);

        lx.CONTEXT.CONTROLLER.MOUSE.STOPPED_BUTTONS[0] = false;
        lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[0] = false;
    }, options);
    
    return this;
};

/** 
 * Gets the current focus.
 * @return {GameObject} The current focus.
*/

this.GetFocus = function() {
    return this.GAME.FOCUS;
};

/** 
 * Resets the current focus.
*/

this.ResetFocus = function() {
    this.GAME.FOCUS = undefined;  
    
    return this;
};

//Deprecated reset focus function

this.ResetCentering = function() {
    lx.GAME.LOG.ERROR(
        'OldResetFocusError', 
        'The ResetCentering method has ' + 
        'been renamed to ResetFocus, for now ' +
        'it will work but this should be ' +
        'changed. Please check the documentation ' +
        'for updated objects and methods.'
    );

    this.ResetFocus();
};