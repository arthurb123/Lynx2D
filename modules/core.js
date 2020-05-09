this.CONTEXT = {};
this.GAME = {
    RUNNING: false,
    DEBUG: false,
    DRAW_COLLIDERS: false,
    BUFFER: [],
    UI: [],
    COLLIDERS: [],
    EVENTS: [],
    MOVE_MOUSE_EVENTS: [],
    GO_MOUSE_EVENTS: [],
    UI_MOUSE_EVENTS: [],
    ON_RESIZE_EVENTS: [],
    LAYER_DRAW_EVENTS: [],
    LOOPS: [],
    SCALE: 1,
    INIT: function(FPS) {
        //Setup metrics

        this.METRICS.DATE = new Date().getSeconds();
        this.METRICS.DATA.COUNTER = new lx.UIMultiText(
            [
                new lx.UIText('FPS: 0 (0)'), 
                new lx.UIText('UPS: 0 (60)')
            ], 
            25, 35, 16
        );

        //Set FPS if provided

        if (FPS) 
            this.SETTINGS.FPS = FPS;

        //Start game loop
        
        this.RUNNING = true;
        this.REQUEST_FRAME();
    },
    METRICS: {
        DATE: 0,
        DATA: {
            FRAMES: 0,
            UPDATES: 0,
            R_DT: 0,
            U_DT: 0,
            TIMESTAMP: 0,
            P_TIMESTAMP: 0
        },
        UPDATE: function() {
            if (this.DATE != new Date().getSeconds()) {
                //Update to the current time (second)

                this.DATE = new Date().getSeconds();
                
                if (lx.GAME.DEBUG) {
                    //Grab the text lines

                    let fpsText = this.DATA.COUNTER.TextLine(0);
                    let upsText = this.DATA.COUNTER.TextLine(1);

                    //Set the new text lines

                    fpsText.Text(
                        'FPS: ' + this.DATA.FRAMES + ' (' + lx.GAME.SETTINGS.FPS + ')'
                    );
                    upsText.Text(
                        'UPS: ' + this.DATA.UPDATES + ' (' + lx.GAME.SETTINGS.UPS + ')'
                    );

                    //Handle text coloring based on the
                    //margin of missed frames or updates

                    let FPS_DIFF = this.DATA.FRAMES  - lx.GAME.SETTINGS.FPS;
                    let UPS_DIFF = this.DATA.UPDATES - lx.GAME.SETTINGS.UPS;

                    if (FPS_DIFF < -lx.GAME.SETTINGS.FPS*.2) 
                        fpsText.Color('#ff4d4d');
                    else if (FPS_DIFF < -lx.GAME.SETTINGS.FPS*.1) 
                        fpsText.Color('#ff8533');
                    else 
                        fpsText.Color('whitesmoke');
                        
                    if (UPS_DIFF < -lx.GAME.SETTINGS.UPS*.2) 
                        upsText.Color('#ff4d4d');
                    else if (UPS_DIFF < -lx.GAME.SETTINGS.UPS*.1) 
                        upsText.Color('#ff8533');
                    else 
                        upsText.Color('whitesmoke');
                }

                //Reset recorded frame and update count
                
                this.DATA.FRAMES = 0;
                this.DATA.UPDATES = 0;
            }
        }
    },
    LOG: {
        RECORDED: [],
        MAX_RECORDS: 10,
        WARNING: function(TYPE, MESSAGE) {
            this.PRINT(TYPE, MESSAGE, 'orange');
        },
        ERROR: function(TYPE, MESSAGE) {
            this.PRINT(TYPE, MESSAGE, 'red');
        },
        PRINT: function(TYPE, MESSAGE, COLOR) {
            for (let R = 0; R < this.RECORDED.length; R++)
                if (this.RECORDED[R] === MESSAGE)
                    return;

            this.RECORDED.push(lx.HASH_CODE(MESSAGE));
            if (this.RECORDED.length >= this.MAX_RECORDS)
                this.RECORDED.splice(0, 1);

            let CONTENT = (MESSAGE.stack ? MESSAGE.stack : MESSAGE);
            console.log('%c' + TYPE + ':%c ' + CONTENT, 'color: ' + COLOR + ';', '');

        }
    },
    SETTINGS: {
        FPS: 60,
        UPS: 60,
        VSYNC: false,
        AA: true,
        LIMITERS: {
            PARTICLES: 300   
        }
    },
    PHYSICS: {
        STEPS: 60
    },
    TIMESTAMP: function() {
        return (window.performance && window.performance.now) ? window.performance.now() : new Date().getTime();
    },
    CLEAR: function() {
        lx.CONTEXT.GRAPHICS.clearRect(
            0, 
            0, 
            lx.CONTEXT.GRAPHICS.canvas.width, 
            lx.CONTEXT.GRAPHICS.canvas.height
        );  
    },
    RESET: function() {
        this.BUFFER = [];
        this.EVENTS = [];
        this.UI = [];
        this.COLLIDERS = [];
        this.LAYER_DRAW_EVENTS = [];
        this.LOOPS = [];
        this.GO_MOUSE_EVENTS = [];
        this.UI_MOUSE_EVENTS = [];
        this.ON_RESIZE_EVENTS = [];
        this.MOVE_MOUSE_EVENTS = [];

        delete lx.CONTEXT.CONTROLLER.TARGET;
        delete this.FOCUS;
    },
    LOOP: function() {
        //Only update and render if the
        //game/framework is running

        if (lx.GAME.RUNNING) {
            lx.GAME.METRICS.DATA.TIMESTAMP = lx.GAME.TIMESTAMP();

            //Check delay and add to
            //the delta time

            const DELAY = Math.min(1, (lx.GAME.METRICS.DATA.TIMESTAMP - lx.GAME.METRICS.DATA.P_TIMESTAMP) / 1000);
            
            lx.GAME.METRICS.DATA.U_DT += DELAY;
            lx.GAME.METRICS.DATA.R_DT += DELAY;

            //Handle update and rendering
            //until the desired step is met

            //Updating is handled with a while
            //loop, because if update cycles are
            //missed they need to be compensated
            //for

            let UPDATE_STEP = 1/lx.GAME.SETTINGS.UPS;
            while (lx.GAME.METRICS.DATA.U_DT >= UPDATE_STEP) {
                lx.GAME.METRICS.DATA.U_DT -= UPDATE_STEP;

                lx.GAME.UPDATE();
            }

            //Rendering is handled per loop iteration
            //because it does not matter if render cycles
            //are missed, this just impacts the current
            //framerate

            let RENDER_STEP = 1/lx.GAME.SETTINGS.FPS;
            if (lx.GAME.SETTINGS.VSYNC)
                RENDER_STEP = 0;

            if (lx.GAME.METRICS.DATA.R_DT >= RENDER_STEP) {
                lx.GAME.METRICS.DATA.R_DT -= RENDER_STEP;

                lx.GAME.RENDER();
            }

            //Set the previous timestamp
            //to the current one

            lx.GAME.METRICS.DATA.P_TIMESTAMP = lx.GAME.METRICS.DATA.TIMESTAMP;
        }

        //Request the next frame

        lx.GAME.REQUEST_FRAME();
    },
    UPDATE: function() {
        //Events

        this.EVENTS.forEach(function(obj) {
            if (obj != undefined) 
                if (obj.TYPE == 'key' && lx.CONTEXT.CONTROLLER.KEYS[obj.EVENT] || 
                    obj.TYPE == 'mousebutton' && 
                    lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[obj.EVENT]) 
                    for (let i = 0; i < obj.CALLBACK.length; i++) 
                        if (obj.CALLBACK[i] != undefined) 
                            try {
                                let worldPosition = lx.CONTEXT.CONTROLLER.MOUSE.POS;
                                
                                if (lx.GAME.FOCUS != undefined) {
                                    let FOCUS_POS = lx.GAME.FOCUS.Position();
                                    let DIM       = lx.GetDimensions();
                                    
                                    worldPosition = lx.GAME.TRANSLATE_FROM_FOCUS({
                                        X: FOCUS_POS.X+worldPosition.X-DIM.width,
                                        Y: FOCUS_POS.Y+worldPosition.Y-DIM.height
                                    });
                                }
                                
                                obj.CALLBACK[i]({ 
                                    mousePosition: lx.CONTEXT.CONTROLLER.MOUSE.POS, 
                                    worldPosition: worldPosition,
                                    state: 1 
                                });
                            } catch (err) {
                                lx.GAME.LOG.ERROR('EventUpdateError', err);
                            };
        });
        
        //GameObjects

        for (let l = 0; l < this.BUFFER.length; l++) 
            if (this.BUFFER[l] != undefined) {
                let done = 0;
                
                for (let o = 0; o < this.BUFFER[l].length; o++) {
                    if (this.BUFFER[l][o] != undefined) {
                        try {
                            this.BUFFER[l][o].UPDATE();
                            done++;
                        } catch (err) {
                            lx.GAME.LOG.ERROR('GameObjectUpdateError', err);
                        };
                    }
                    else {
                        try {
                            this.BUFFER[l].splice(o, 1);
                            for (let n = o; n < this.BUFFER[l].length; n++)
                                if (this.BUFFER[l][n] != undefined)
                                    this.BUFFER[l][n].BUFFER_ID = n;
                            o--;
                        }
                        catch (err) {
                            lx.GAME.LOG.ERROR('BufferCleaningError', err);
                        };
                    }
                };
                
                if (done == 0)
                    this.BUFFER[l] = [];
            }
    
        //Colliders

        let COLLIDED = {};
        this.COLLIDERS.forEach(function(coll1) {
            if (coll1 != undefined) 
                lx.GAME.COLLIDERS.forEach(function(coll2) {
                    //Check if collision should be checked

                    if (coll2 != undefined && 
                        coll1.COLLIDER_ID != coll2.COLLIDER_ID &&
                        COLLIDED[coll1] != coll2) 
                        try {
                            //Check for collision

                            if (coll2.CHECK_COLLISION(coll1)) {
                                //If collision occurred;
                                //Set collided to make sure
                                //the collision does not get checked
                                //again for the other collider

                                COLLIDED[coll2] = coll1;
                            }
                        } catch (err) {
                            lx.GAME.LOG.ERROR('ColliderUpdateError', err);
                        };
                });
        });

        //Loop

        this.LOOPS.forEach(function(loop) {
            try {
                if (loop != undefined) 
                    loop(); 
            } catch (err) {
                lx.GAME.LOG.ERROR('LoopHandleError', err);
            };
        });
        
        //UI

        this.UI.forEach(function(element) {
            try {
                if (element != undefined) 
                    element.UPDATE();
            } catch (err) {
                lx.GAME.LOG.ERROR('UIElementUpdateError', err);
            };
        });
        
        //Audio

        this.AUDIO.UPDATE();

        //Catch framerate boundary

        if (lx.GAME.SETTINGS.FPS <= 0)
            lx.GAME.SETTINGS.FPS = 1;

        //Update Log
        
        this.METRICS.UPDATE();
        
        this.METRICS.DATA.UPDATES++;
    },
    RENDER: function() {
        //Clear and initialize rendering preferences

        this.CLEAR();

        lx.CONTEXT.GRAPHICS.imageSmoothingEnabled = this.SETTINGS.AA;
        
        //Render buffer

        for (let i = 0; i < this.BUFFER.length; i++) {
            try {
                if (this.BUFFER[i] != undefined) 
                    this.BUFFER[i].forEach(function(obj) {
                        if (obj != undefined) 
                            obj.RENDER();
                    });
            } catch (err) {
                lx.GAME.LOG.ERROR('BufferRenderError', err);
            };

            try {
                if (this.LAYER_DRAW_EVENTS[i] != undefined) 
                    for (let ii = 0; ii < this.LAYER_DRAW_EVENTS[i].length; ii++)
                        if (this.LAYER_DRAW_EVENTS[i][ii] != undefined) 
                            this.LAYER_DRAW_EVENTS[i][ii](lx.CONTEXT.GRAPHICS);
            } catch (err) {
                lx.GAME.LOG.ERROR('LayerDrawEventError', err);
            };
        }
        
        //Debug: FPS and UPS

        if (this.DEBUG) {
            //FPS and UPS

            this.METRICS.DATA.COUNTER.RENDER();
        }
        
        //Debug: Draw colliders

        if (this.DRAW_COLLIDERS) 
            this.COLLIDERS.forEach(function(obj) {
                if (obj != undefined) 
                    obj.RENDER();
            });
        
        //User Interface

        for (let i = 0; i < this.UI.length; i++) 
            if (this.UI[i] != undefined) 
                if (this.UI[i].UI_ID != undefined) 
                    this.UI[i].RENDER();
                else 
                    this.UI[i] = undefined;
        
        //Update frames

        this.METRICS.DATA.FRAMES++;
    },
    REQUEST_FRAME: function() {
        window.requestAnimationFrame(lx.GAME.LOOP)
    },
    ADD_TO_BUFFER: function(OBJECT, LAYER) {
        if (this.BUFFER[LAYER] == undefined) 
            this.BUFFER[LAYER] = [];
        
        for (let i = 0; i < this.BUFFER[LAYER].length+1; i++) 
            if (this.BUFFER[LAYER][i] == undefined) {
                this.BUFFER[LAYER][i] = OBJECT;
                return i;
            }
    },
    SWITCH_BUFFER_POSITION: function(OBJECT1, OBJECT2) {
        if (OBJECT1.BUFFER_ID === -1 ||
            OBJECT2.BUFFER_ID === -1 ||
            OBJECT1.BUFFER_LAYER !== OBJECT2.BUFFER_LAYER)
            return;
        
        let BUFFER_ID = OBJECT1.BUFFER_ID;  
        
        OBJECT1.BUFFER_ID = OBJECT2.BUFFER_ID;
        OBJECT2.BUFFER_ID = BUFFER_ID;
        
        this.BUFFER[OBJECT1.BUFFER_LAYER][OBJECT1.BUFFER_ID] = OBJECT1;
        this.BUFFER[OBJECT1.BUFFER_LAYER][OBJECT2.BUFFER_ID] = OBJECT2;
    },
    ADD_LOOPS: function(CALLBACK) {
        if (CALLBACK == undefined) 
            return -1;
        
        for (let i = 0; i < this.LOOPS.length+1; i++) 
            if (this.LOOPS[i] == undefined) {
                this.LOOPS[i] = CALLBACK;
                return i;
            }
    },
    ADD_EVENT: function(TYPE, EVENT, CALLBACK) {
        for (let i = 0; i < this.EVENTS.length; i++)
            if (this.EVENTS[i] != undefined && 
                this.EVENTS[i].TYPE == TYPE && 
                this.EVENTS[i].EVENT == EVENT) 
                for (let ii = 0; ii <= this.EVENTS[i].CALLBACK.length; ii++)
                    if (this.EVENTS[i].CALLBACK[ii] == undefined) {
                        this.EVENTS[i].CALLBACK[ii] = CALLBACK;

                        return ii;
                    }
            
        for (let i = 0; i < this.EVENTS.length+1; i++) 
            if (this.EVENTS[i] == undefined) {
                this.EVENTS[i] = {
                    TYPE: TYPE,
                    EVENT: EVENT,
                    CALLBACK: [CALLBACK]
                };
                
                return i;
            }
    },
    INVALIDATE_EVENT: function(TYPE, EVENT) {
        for (let i = 0; i < this.EVENTS.length; i++) 
            if (this.EVENTS[i] != undefined && 
                this.EVENTS[i].TYPE == TYPE && 
                this.EVENTS[i].EVENT == EVENT) 
                for (let ii = 0; ii < this.EVENTS[i].CALLBACK.length; ii++)
                    if (this.EVENTS[i].CALLBACK[ii] != undefined) {
                        let worldPosition = lx.CONTEXT.CONTROLLER.MOUSE.POS;
                                
                        if (this.FOCUS != undefined) {
                            let FOCUS_POS = this.FOCUS.Position();
                            let DIM       = lx.GetDimensions();
                            
                            worldPosition = this.TRANSLATE_FROM_FOCUS({
                                X: FOCUS_POS.X+worldPosition.X-DIM.width,
                                Y: FOCUS_POS.Y+worldPosition.Y-DIM.height
                            });
                        }
                        
                        this.EVENTS[i].CALLBACK[ii]({
                            mousePosition: lx.CONTEXT.CONTROLLER.MOUSE.POS,
                            worldPosition: worldPosition,
                            state: 0
                        });
                    }
    },
    CLEAR_EVENT: function(TYPE, EVENT, CB_ID) {
        for (let i = 0; i < this.EVENTS.length; i++) {
            if (this.EVENTS[i].TYPE == TYPE && this.EVENTS[i].EVENT == EVENT) {
                if (CB_ID != undefined)
                    this.EVENTS[i].CALLBACK[CB_ID] = undefined;
                else
                    this.EVENTS.splice(i, 1);
                
                return;   
            }
        }
    },
    ADD_COLLIDER: function(COLLIDER) {
        for (let i = 0; i < this.COLLIDERS.length+1; i++) {
            if (this.COLLIDERS[i] == undefined) {
                this.COLLIDERS[i] = COLLIDER;
                return i;
            }
        }
    },
    ADD_UI_ELEMENT: function(UI_ELEMENT) {
        for (let i = 0; i < this.UI.length+1; i++)
            if (this.UI[i] == undefined) {
                this.UI[i] = UI_ELEMENT;
                return i;
            }
    },
    FOCUS_GAMEOBJECT: function(GAMEOBJECT) {
        this.FOCUS = GAMEOBJECT;
    },
    TRANSLATE_FROM_FOCUS: function(POS) {
        if (this.FOCUS == undefined) 
            return POS;
        else {
            let FOCUS_POS  = this.FOCUS.Position();
            let FOCUS_SIZE = this.FOCUS.Size();
            let DIM        = lx.GetDimensions();

            if (FOCUS_SIZE   == undefined ||
                FOCUS_SIZE.W == undefined ||
                FOCUS_SIZE.H == undefined)
                this.FOCUS.Size(0, 0);
            
            return {
                X: Math.floor(Math.round(POS.X)-Math.round(FOCUS_POS.X)+DIM.width/(2*this.SCALE)-FOCUS_SIZE.W/2) * this.SCALE,
                Y: Math.floor(Math.round(POS.Y)-Math.round(FOCUS_POS.Y)+DIM.height/(2*this.SCALE)-FOCUS_SIZE.H/2) * this.SCALE
            };
        }
    },
    UNTRANSLATE_FROM_FOCUS: function(POS) {
        if (this.FOCUS == undefined) 
            return POS;
        else {
            let FOCUS_POS  = this.FOCUS.Position();
            let FOCUS_SIZE = this.FOCUS.Size();
            let DIM        = lx.GetDimensions();

            if (FOCUS_SIZE   == undefined ||
                FOCUS_SIZE.W == undefined ||
                FOCUS_SIZE.H == undefined)
                this.FOCUS.Size(0, 0);
            
            return {
                X: Math.floor(Math.round(POS.X)+Math.round(FOCUS_POS.X)-DIM.width/2+FOCUS_SIZE.W/2),
                Y: Math.floor(Math.round(POS.Y)+Math.round(FOCUS_POS.Y)-DIM.height/2+FOCUS_SIZE.H/2)
            };
        }
    },
    ON_SCREEN: function(POS, SIZE) {
        let DIM = lx.GetDimensions();

        //If a focus exists, calculate the
        //absolute distance towards the focus.
        //If it exceeds half the screen size we
        //can assume it is off-screen.

        if (this.FOCUS != undefined) {
            let FOCUS_POS = this.FOCUS.Position();

            let ABS_DIFF_X = Math.abs(FOCUS_POS.X-POS.X);
            let ABS_DIFF_Y = Math.abs(FOCUS_POS.Y-POS.Y);

            return ABS_DIFF_X <= DIM.width/2+SIZE.W
                && ABS_DIFF_Y <= DIM.height/2+SIZE.H;
        }
        
        //Otherwise assume the default screen
        //dimensions and check bounds

        return POS.X+SIZE.W > 0
            && POS.Y+SIZE.H > 0
            && POS.X < DIM.width
            && POS.Y < DIM.height;
    },
    ADD_LAYER_DRAW_EVENT: function(LAYER, CALLBACK) {
        if (this.BUFFER[LAYER] == undefined) 
            this.BUFFER[LAYER] = [];
        if (this.LAYER_DRAW_EVENTS[LAYER] == undefined) 
            this.LAYER_DRAW_EVENTS[LAYER] = [];
        
        for (let i = 0; i < this.LAYER_DRAW_EVENTS[LAYER].length+1; i++) {
            if (this.LAYER_DRAW_EVENTS[LAYER][i] == undefined) {
                this.LAYER_DRAW_EVENTS[LAYER][i] = CALLBACK;
                return i;
            }
        }
        
        return -1;
    },
    CLEAR_LAYER_DRAW_EVENT: function(LAYER) {
        this.LAYER_DRAW_EVENTS[LAYER] = undefined;  
    },
    AUDIO: {
        CAN_PLAY: false,
        SOUNDS: [],
        CHANNELS: [],
        SET_CHANNEL_VOLUME: function (CHANNEL, VOL) {
            this.CHANNELS[CHANNEL] = VOL;
        },
        GET_CHANNEL_VOLUME: function (CHANNEL) {
            if (this.CHANNELS[CHANNEL] == undefined) 
                this.SET_CHANNEL_VOLUME(CHANNEL, 1);
            
            return this.CHANNELS[CHANNEL];
        },
        ADD: function (SRC, CHANNEL, DELAY, LOOPS) {
            if (!this.CAN_PLAY || SRC == "") return;
            
            if (this.CHANNELS[CHANNEL] == undefined) 
                this.SET_CHANNEL_VOLUME(CHANNEL, 1);
            
            for (let i = 0; i <= this.SOUNDS.length; i++) {
                if (this.SOUNDS[i] == undefined) {
                    this.SOUNDS[i] = {
                        CUR: 0,
                        SRC: SRC,
                        CHANNEL: CHANNEL,
                        SPATIAL: false,
                        DELAY: DELAY,
                        LOOPS: LOOPS,
                        PLAYING: false
                    };
                    
                    return i;
                }
            }
        },
        ADD_SPATIAL: function(POS, SRC, CHANNEL, DELAY, LOOPS) {
            if (!this.CAN_PLAY || SRC == "") return;
            
            if (this.CHANNELS[CHANNEL] == undefined) 
                this.SET_CHANNEL_VOLUME(CHANNEL, 1);
            
            for (let i = 0; i <= this.SOUNDS.length; i++) {
                if (this.SOUNDS[i] == undefined) {
                    this.SOUNDS[i] = {
                        CUR: 0,
                        POS: POS,
                        SRC: SRC,
                        SPATIAL: true,
                        CHANNEL: CHANNEL,
                        DELAY: DELAY,
                        LOOPS: LOOPS,
                        PLAYING: false
                    };
                    
                    return i;
                }
            }
        },
        CALCULATE_SPATIAL: function(POS, CHANNEL) {
            POS = lx.GAME.TRANSLATE_FROM_FOCUS(POS);
            
            let DX = 1-Math.abs(POS.X - lx.GetDimensions().width/2)/(lx.GetDimensions().width/2),
                DY = 1-Math.abs(POS.Y - lx.GetDimensions().height/2)/(lx.GetDimensions().height/2);
            
            let VOL = this.CHANNELS[CHANNEL];
            
            if (DX >= DY)
                VOL *= DX;
            else
                VOL *= DY;
            
            if (VOL < 0 ||
                POS.X < 0 || 
                POS.Y < 0 ||
                POS.X > lx.GetDimensions().width ||
                POS.Y > lx.GetDimensions().height)
                VOL = 0;
            
            return VOL;
        },
        UPDATE: function () {
            if (!this.CAN_PLAY) return;
            
            for (let i = 0; i < this.SOUNDS.length; i++) {
                if (this.SOUNDS[i] == undefined) 
                    continue;
                
                if (this.SOUNDS[i].PLAYING) 
                {
                    if (this.SOUNDS[i].SPATIAL)
                        this.SOUNDS[i].AUDIO.volume = this.CALCULATE_SPATIAL(this.SOUNDS[i].POS, this.SOUNDS[i].CHANNEL);
                        
                    continue;
                }
                
                this.SOUNDS[i].CUR++;
                if (this.SOUNDS[i].DELAY == undefined || this.SOUNDS[i].CUR >= this.SOUNDS[i].DELAY) {
                    let temp = new Audio();
                    temp.type = 'audio/mpeg';
                    temp.src = this.SOUNDS[i].SRC;
                    temp.play_id = i;
                    temp.onended = function() {
                        if (lx.GAME.AUDIO.SOUNDS[this.play_id].LOOPS)
                            lx.GAME.AUDIO.SOUNDS[this.play_id].AUDIO.play();
                        else
                            lx.GAME.AUDIO.SOUNDS[this.play_id] = undefined;
                    }
                    
                    if (!this.SOUNDS[i].SPATIAL) 
                        temp.volume = this.CHANNELS[this.SOUNDS[i].CHANNEL];
                    else 
                        temp.volume = this.CALCULATE_SPATIAL(this.SOUNDS[i].POS, this.SOUNDS[i].CHANNEL);
                    
                    this.SOUNDS[i].PLAYING = true;
                    this.SOUNDS[i].AUDIO = temp;
                    this.SOUNDS[i].AUDIO.play();
                }
            }
        },
        REMOVE: function(ID) {
            if (ID == undefined || this.SOUNDS[ID] == undefined || !this.SOUNDS[ID].PLAYING)
                return;
            
            this.SOUNDS[ID].AUDIO.pause();
            this.SOUNDS[ID].AUDIO.currentTime = 0;
            
            this.SOUNDS[ID] = undefined;
        }
    },
    ADD_GO_MOUSE_EVENT: function (GO, BUTTON, CALLBACK) {
        for (let i = 0; i < this.GO_MOUSE_EVENTS.length+1; i++)
            if (this.GO_MOUSE_EVENTS[i] == undefined) {
                this.GO_MOUSE_EVENTS[i] = {
                    GO: GO,
                    BUTTON: BUTTON,
                    CALLBACK: CALLBACK  
                };
                
                return i;
            }
        
        return -1;
    },
    REMOVE_GO_MOUSE_EVENT: function (ID) {
        this.GO_MOUSE_EVENTS[ID] = undefined;
    },
    ADD_UI_MOUSE_EVENT: function (UI, BUTTON, CALLBACK) {
        for (let i = 0; i < this.UI_MOUSE_EVENTS.length+1; i++)
            if (this.UI_MOUSE_EVENTS[i] == undefined) {
                this.UI_MOUSE_EVENTS[i] = {
                    UI, UI,
                    BUTTON: BUTTON,
                    CALLBACK: CALLBACK  
                };
                
                return i;
            }
        
        return -1;
    },
    REMOVE_UI_MOUSE_EVENT: function (ID) {
        this.UI_MOUSE_EVENTS[ID] = undefined;
    },
    HANDLE_MOUSE_CLICK: function (BUTTON) {
        //GameObject mouse events

        for (let i = 0; i < this.GO_MOUSE_EVENTS.length; i++) {
            let EVENT = this.GO_MOUSE_EVENTS[i];

            if (EVENT != undefined && EVENT.BUTTON == BUTTON)
                if (EVENT.GO == undefined)
                    this.REMOVE_GO_MOUSE_EVENT(i);
                else if (lx.GAME.GET_MOUSE_IN_BOX(
                    EVENT.GO.POS,
                    EVENT.GO.SIZE
                ))
                    EVENT.CALLBACK({
                        mousePosition: lx.CONTEXT.CONTROLLER.MOUSE.POS,
                        state: 1
                    });
        };

        //UI mouse events
                    
        for (let i = 0; i < this.UI_MOUSE_EVENTS.length; i++) {
            let EVENT = this.UI_MOUSE_EVENTS[i];

            if (EVENT != undefined && EVENT.BUTTON == BUTTON)
                if (EVENT.UI == undefined)
                    this.REMOVE_UI_MOUSE_EVENT(i);
                else if (lx.GAME.GET_MOUSE_IN_BOX(
                    EVENT.UI.POS,
                    EVENT.UI.SIZE,
                    (EVENT.UI.TARGET != undefined)
                )) {
                    EVENT.CALLBACK({
                        mousePosition: lx.GetMousePosition(),
                        state: 1
                    });
                }
        };
    },
    GET_MOUSE_IN_BOX: function (POS, SIZE, TRANSLATE) {
        if (this.FOCUS != undefined) 
            if (TRANSLATE || TRANSLATE == undefined)
                POS = this.TRANSLATE_FROM_FOCUS(POS);
        
        SIZE = {
            W: SIZE.W * this.SCALE,
            H: SIZE.H * this.SCALE
        };

        let MOUSE = lx.GetMousePosition();
        
        if (POS.X <= MOUSE.X        && 
            POS.X+SIZE.W >= MOUSE.X && 
            POS.Y <= MOUSE.Y        && 
            POS.Y+SIZE.H >= MOUSE.Y)
                return true;
        
        return false;
    },
    ADD_ON_RESIZE_EVENT: function(CALLBACK) {
        for (let i = 0; i < this.ON_RESIZE_EVENTS.length+1; i++)
            if (this.ON_RESIZE_EVENTS[i] == undefined) {
                this.ON_RESIZE_EVENTS[i] = CALLBACK;
                break;
            }
    },
    CREATE_SNAPSHOT: function() {
        return {
            BUFFER: this.BUFFER,
            UI: this.UI,
            COLLIDERS: this.COLLIDERS,
            FOCUS: this.FOCUS,
            EVENTS: this.EVENTS,
            LOOPS: this.LOOPS,
            GO_MOUSE_EVENTS: this.GO_MOUSE_EVENTS,
            MOVE_MOUSE_EVENTS: this.MOVE_MOUSE_EVENTS,
            LAYER_DRAW_EVENTS: this.LAYER_DRAW_EVENTS,
            AUDIO_CHANNELS: this.AUDIO.CHANNELS,
            AUDIO_SOUNDS: this.AUDIO.SOUNDS,
            CONTROLLER_TARGET: lx.CONTEXT.CONTROLLER.TARGET
        };
    },
    RESTORE_SNAPSHOT: function(SNAPSHOT) {
        this.BUFFER = SNAPSHOT.BUFFER;
        this.UI = SNAPSHOT.UI;
        this.COLLIDERS = SNAPSHOT.COLLIDERS;
        this.FOCUS = SNAPSHOT.FOCUS;
        this.EVENTS = SNAPSHOT.EVENTS;
        this.LOOPS = SNAPSHOT.LOOPS;
        this.GO_MOUSE_EVENTS = SNAPSHOT.GO_MOUSE_EVENTS;
        this.MOVE_MOUSE_EVENTS = SNAPSHOT.MOVE_MOUSE_EVENTS;
        this.LAYER_DRAW_EVENTS = SNAPSHOT.LAYER_DRAW_EVENTS;
        this.AUDIO.CHANNELS = SNAPSHOT.AUDIO_CHANNELS;
        this.AUDIO.SOUNDS = SNAPSHOT.AUDIO_SOUNDS;

        lx.CONTEXT.CONTROLLER.TARGET = SNAPSHOT.CONTROLLER_TARGET;
    }
};