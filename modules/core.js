this.CONTEXT = {};
this.GAME = {
    RUNNING: false,
    DEBUG: false,
    DRAW_COLLIDERS: false,
    BUFFER: [],
    EVENTS: [],
    GO_MOUSE_EVENTS: [],
    UI: [],
    COLLIDERS: [],
    LOOPS: [],
    LAYER_DRAW_EVENTS: [],
    ON_RESIZE_EVENTS: [],
    SCALE: 1,
    INIT: function(FPS) {
        //Setup logger

        this.LOG.DATE = new Date().getSeconds();
        this.LOG.DATA.COUNTER = new lx.UIText('0 FPS | 0 UPS', 25, 35, 16);

        //Set FPS if provided

        if (FPS != undefined) 
            this.SETTINGS.FPS = FPS;

        //Start game loop
        
        this.RUNNING = true;
        this.REQUEST_FRAME();
        
        //Debug: Game Start

        if (this.DEBUG)
            console.log(
                this.LOG.TIMEFORMAT() + 'Started game loop at ' + this.SETTINGS.FPS + ' FPS!'
            );
    },
    LOG: {
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
                this.DATE = new Date().getSeconds();
                
                this.DATA.COUNTER.Text(
                    this.DATA.FRAMES + ' FPS | ' + this.DATA.UPDATES + ' UPS'
                );
                
                this.DATA.FRAMES = 0;
                this.DATA.UPDATES = 0;
            }
        },
        TIMEFORMAT: function() {
            return 'Lynx2D ['+new Date().toTimeString().substring(0,8)+'] - ';
        }
    },
    SETTINGS: {
        FPS: 60,
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
        
        delete this.FOCUS;
    },
    LOOP: function() {
        //Only update and render if the
        //game/framework is running

        if (lx.GAME.RUNNING) {
            lx.GAME.LOG.DATA.TIMESTAMP = lx.GAME.TIMESTAMP();

            //Check delay and add to
            //the delta time

            const DELAY = Math.min(1, (lx.GAME.LOG.DATA.TIMESTAMP - lx.GAME.LOG.DATA.P_TIMESTAMP) / 1000);
            
            lx.GAME.LOG.DATA.U_DT += DELAY;
            lx.GAME.LOG.DATA.R_DT += DELAY;

            //Handle update and rendering
            //until the desired step is met

            //Updating is handled with a while
            //loop, because if update cycles are
            //missed they need to be compensated
            //for

            let UPDATE_STEP = 1/60;

            while (lx.GAME.LOG.DATA.U_DT >= UPDATE_STEP) {
                lx.GAME.LOG.DATA.U_DT -= UPDATE_STEP;

                lx.GAME.UPDATE();
            }

            //Rendering is handled per loop iteration
            //because it does not matter if render cycles
            //are missed, this just impacts the current
            //framerate

            let RENDER_STEP = 1/lx.GAME.SETTINGS.FPS;
            if (lx.GAME.SETTINGS.VSYNC)
                RENDER_STEP = 0;

            if (lx.GAME.LOG.DATA.R_DT >= RENDER_STEP) {
                lx.GAME.LOG.DATA.R_DT -= RENDER_STEP;

                lx.GAME.RENDER();
            }

            //Set the previous timestamp
            //to the current one

            lx.GAME.LOG.DATA.P_TIMESTAMP = lx.GAME.LOG.DATA.TIMESTAMP;
        }

        //Request the next frame

        lx.GAME.REQUEST_FRAME();
    },
    UPDATE: function(DT) {
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
                                
                                if (lx.GAME.FOCUS != undefined)
                                    worldPosition = lx.GAME.TRANSLATE_FROM_FOCUS({
                                        X: lx.GAME.FOCUS.POS.X+worldPosition.X-lx.GetDimensions().width,
                                        Y: lx.GAME.FOCUS.POS.Y+worldPosition.Y-lx.GetDimensions().height
                                    });
                                
                                obj.CALLBACK[i]({ 
                                    mousePosition: lx.CONTEXT.CONTROLLER.MOUSE.POS, 
                                    worldPosition: worldPosition,
                                    state: 1 
                                });
                            } catch (err) {
                                console.log(err)
                            };
        });
        
        //GameObjects

        for (let i = 0; i < this.BUFFER.length; i++) 
            if (this.BUFFER[i] != undefined) {
                let done = 0;
                
                this.BUFFER[i].forEach(function(obj) {
                    if (obj != undefined && obj.UPDATES) {
                        try {
                            obj.UPDATE();
                            
                            done++;
                        } catch (err) {
                            console.log(err);
                        };
                    }
                });
                
                if (done == 0)
                    this.BUFFER[i] = [];
            }
    
        //Colliders

        this.COLLIDERS.forEach(function(coll1) {
            if (coll1 != undefined) 
                lx.GAME.COLLIDERS.forEach(function(coll2) {
                    if (coll2 != undefined && 
                        coll1.COLLIDER_ID != coll2.COLLIDER_ID) 
                        try {
                            let collision = false;
                            
                            //Check for collision
                            
                            collision = coll2.CheckCollision(coll1);

                            //Act accordingly

                            if (collision) {
    
                                //Callback on collision to
                                //both colliders

                                coll1.OnCollide({
                                    self: coll1,
                                    trigger: coll2,
                                    direction: collision.direction,
                                    gameObject: collision.gameObject,
                                    static: coll2.Static(),
                                    solid: coll2.Solid()
                                });
                            }
                        } catch (err) {
                            console.log(err);
                        };
                });
        });

        //Loop

        this.LOOPS.forEach(function(loop) {
            try {
                if (loop != undefined) 
                    loop(); 
            } catch (err) {
                console.log(err);  
            };
        });
        
        //UI

        this.UI.forEach(function(element) {
            try {
                if (element != undefined) 
                    element.UPDATE();
            } catch (err) {
                console.log(err);  
            };
        });
        
        //Audio

        this.AUDIO.UPDATE();

        //Catch framerate boundary

        if (lx.GAME.SETTINGS.FPS <= 0)
            lx.GAME.SETTINGS.FPS = 1;

        //Update Log
        
        this.LOG.UPDATE();
        
        this.LOG.DATA.UPDATES++;
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

                if (this.LAYER_DRAW_EVENTS[i] != undefined) 
                    for (let ii = 0; ii < this.LAYER_DRAW_EVENTS[i].length; ii++)
                        if (this.LAYER_DRAW_EVENTS[i][ii] != undefined) 
                            this.LAYER_DRAW_EVENTS[i][ii](lx.CONTEXT.GRAPHICS);
            } catch (err) {
                console.log(err);
            };
        }
        
        //Debug: FPS and UPS

        if (this.DEBUG) {
            //FPS and UPS

            this.LOG.DATA.COUNTER.RENDER();
        }
        
        //Debug: Draw colliders

        if (this.DRAW_COLLIDERS) 
            this.COLLIDERS.forEach(function(obj) {
                if (obj != undefined) 
                    lx.CONTEXT.GRAPHICS.strokeRect(
                        lx.GAME.TRANSLATE_FROM_FOCUS(obj.POS).X, 
                        lx.GAME.TRANSLATE_FROM_FOCUS(obj.POS).Y, 
                        obj.SIZE.W*lx.GAME.SCALE, 
                        obj.SIZE.H*lx.GAME.SCALE
                    ); 
            });
        
        //User Interface

        for (let i = 0; i < this.UI.length; i++) 
            if (this.UI[i] != undefined) 
                if (this.UI[i].UI_ID != undefined) 
                    this.UI[i].RENDER();
                else 
                    this.UI[i] = undefined;
        
        //Update frames

        this.LOG.DATA.FRAMES++;
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
                                
                        if (this.FOCUS != undefined)
                            worldPosition = this.TRANSLATE_FROM_FOCUS({
                                X: this.FOCUS.POS.X+worldPosition.X-lx.GetDimensions().width,
                                Y: this.FOCUS.POS.Y+worldPosition.Y-lx.GetDimensions().height
                            });
                        
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
        for (let i = 0; i < this.UI.length+1; i++) {
            if (this.UI[i] == undefined) {
                this.UI[i] = UI_ELEMENT;
                return i;
            }
        }
    },
    FOCUS_GAMEOBJECT: function(GAMEOBJECT) {
        this.FOCUS = GAMEOBJECT;
    },
    TRANSLATE_FROM_FOCUS: function(POS) {
        if (this.FOCUS == undefined) return POS;
        else {
            if (this.FOCUS.SIZE == undefined)
                this.FOCUS.SIZE = {
                    W: 0,
                    H: 0
                };
            else if (this.FOCUS.SIZE.W == undefined || this.FOCUS.SIZE.H == undefined)
            {
                this.FOCUS.SIZE.W = 0;
                this.FOCUS.SIZE.H = 0;
            }
            
            return {
                X: Math.floor(Math.round(POS.X)-Math.round(this.FOCUS.Position().X)+lx.GetDimensions().width/(2*this.SCALE)-this.FOCUS.SIZE.W/2) * this.SCALE,
                Y: Math.floor(Math.round(POS.Y)-Math.round(this.FOCUS.Position().Y)+lx.GetDimensions().height/(2*this.SCALE)-this.FOCUS.SIZE.H/2) * this.SCALE
            };
        }
    },
    UNTRANSLATE_FROM_FOCUS: function(POS) {
        if (this.FOCUS == undefined) return POS;
        else {
            if (this.FOCUS.SIZE == undefined)
                this.FOCUS.SIZE = {
                    W: 0,
                    H: 0
                };
            else if (this.FOCUS.SIZE.W == undefined || this.FOCUS.SIZE.H == undefined)
            {
                this.FOCUS.SIZE.W = 0;
                this.FOCUS.SIZE.H = 0;
            }
            
            return {
                X: Math.floor(Math.round(POS.X)+Math.round(this.FOCUS.Position().X)-lx.GetDimensions().width/2+this.FOCUS.SIZE.W/2),
                Y: Math.floor(Math.round(POS.Y)+Math.round(this.FOCUS.Position().Y)-lx.GetDimensions().height/2+this.FOCUS.SIZE.H/2)
            };
        }
    },
    ON_SCREEN: function(POS, SIZE) {
        if (this.FOCUS != undefined) {
            if (Math.abs(this.FOCUS.Position().X-POS.X) <= lx.GetDimensions().width/2+SIZE.W && Math.abs(this.FOCUS.Position().Y-POS.Y) <= lx.GetDimensions().height/2+SIZE.H) return true;
            else return false;
        } else {
            if (POS.X+SIZE.W > 0 && POS.X < lx.GetDimensions().width && POS.Y+SIZE.H > 0 && POS.Y < lx.GetDimensions().height) return true;
            else return false;
        }
    },
    ADD_LAYER_DRAW_EVENT: function(LAYER, CALLBACK) {
        if (this.BUFFER[LAYER] == undefined) this.BUFFER[LAYER] = [];
        if (this.LAYER_DRAW_EVENTS[LAYER] == undefined) this.LAYER_DRAW_EVENTS[LAYER] = [];
        
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
    HANDLE_MOUSE_CLICK: function (BUTTON) {
        for (let i = 0; i < this.GO_MOUSE_EVENTS.length; i++)
            if (this.GO_MOUSE_EVENTS[i] != undefined && this.GO_MOUSE_EVENTS[i].BUTTON == BUTTON)
                if (this.GO_MOUSE_EVENTS[i].GO == undefined)
                    this.GO_MOUSE_EVENTS[i] = undefined;
                else if (lx.GAME.GET_MOUSE_IN_BOX(
                    this.GO_MOUSE_EVENTS[i].GO.POS, 
                    this.GO_MOUSE_EVENTS[i].GO.SIZE
                ))
                this.GO_MOUSE_EVENTS[i].CALLBACK({
                    mousePosition: lx.CONTEXT.CONTROLLER.MOUSE.POS,
                    state: 1
                });
                    
        //...
    },
    GET_MOUSE_IN_BOX: function (POS, SIZE) {
        if (this.FOCUS != undefined) 
            POS = this.TRANSLATE_FROM_FOCUS(POS);
        
        SIZE = {
            W: SIZE.W * this.SCALE,
            H: SIZE.H * this.SCALE
        };
        
        if (POS.X <= lx.CONTEXT.CONTROLLER.MOUSE.POS.X && POS.X+SIZE.W >= lx.CONTEXT.CONTROLLER.MOUSE.POS.X && 
            POS.Y <= lx.CONTEXT.CONTROLLER.MOUSE.POS.Y && POS.Y+SIZE.H >= lx.CONTEXT.CONTROLLER.MOUSE.POS.Y)
                return true;
        
        return false;
    },
    ADD_ON_RESIZE_EVENT: function(CALLBACK) {
        for (let i = 0; i < this.ON_RESIZE_EVENTS.length+1; i++)
            if (this.ON_RESIZE_EVENTS[i] == undefined) {
                this.ON_RESIZE_EVENTS[i] = CALLBACK;
                break;
            }
    }
};