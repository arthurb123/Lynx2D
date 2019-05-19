/** 
 * Initializes Lynx2D.
 * @param {Element} target - The DOM element in which the canvas gets instantiated, can be undefined (default is body).
*/

this.Initialize = function(target) {
    //Setup canvas

    this.CONTEXT.CANVAS = document.createElement('canvas');
    this.CONTEXT.CANVAS.id = 'lynx-canvas';
    this.CONTEXT.CANVAS.style = 'background-color: #282828;';
    this.CONTEXT.CANVAS.oncontextmenu = function(e) { e.preventDefault(); return false; };
    
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
 * Gets the dimensions of the canvas.
 * @return {object} Gets {width, height}.
*/

this.GetDimensions = function() {
    if (this.CONTEXT.CANVAS == undefined) {
        console.log(this.GAME.LOG.TIMEFORMAT + 'Could not get canvas dimensions, Lynx2D is not initialized!')
        
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

        lx.CONTEXT.CONTROLLER.MOUSE.POS = { X: EVENT.pageX, Y: EVENT.pageY };

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

this.ResetCentering = function() {
    this.GAME.FOCUS = undefined;  
    
    return this;
};