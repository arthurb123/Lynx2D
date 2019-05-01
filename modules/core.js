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
        this.FOCUS = undefined;
    },
    LOOP: function() {
        if (lx.GAME.RUNNING) {
            lx.GAME.LOG.DATA.TIMESTAMP = lx.GAME.TIMESTAMP();
            
            lx.GAME.LOG.DATA.U_DT = 
                lx.GAME.LOG.DATA.U_DT + Math.min(1, (lx.GAME.LOG.DATA.TIMESTAMP - lx.GAME.LOG.DATA.P_TIMESTAMP) / 1000);
            lx.GAME.LOG.DATA.R_DT = 
                lx.GAME.LOG.DATA.R_DT + Math.min(1, (lx.GAME.LOG.DATA.TIMESTAMP - lx.GAME.LOG.DATA.P_TIMESTAMP) / 1000);

            while (lx.GAME.LOG.DATA.U_DT >= 1/60) {
                lx.GAME.LOG.DATA.U_DT = lx.GAME.LOG.DATA.U_DT - 1/60;
                lx.GAME.UPDATE();
            }

            while (lx.GAME.LOG.DATA.R_DT >= 1/lx.GAME.SETTINGS.FPS) {
                lx.GAME.LOG.DATA.R_DT = lx.GAME.LOG.DATA.R_DT - 1/lx.GAME.SETTINGS.FPS;
                lx.GAME.RENDER();
            }

            lx.GAME.LOG.DATA.P_TIMESTAMP = lx.GAME.LOG.DATA.TIMESTAMP;
        }

        lx.GAME.REQUEST_FRAME();
    },
    UPDATE: function(DT) {
        //Events

        this.EVENTS.forEach(function(obj) {
            if (obj != undefined) 
                if (obj.TYPE == 'key' && lx.CONTEXT.CONTROLLER.KEYS[obj.EVENT] || 
                    obj.TYPE == 'mousebutton' && lx.CONTEXT.CONTROLLER.MOUSE.BUTTONS[obj.EVENT]) 
                    for (var i = 0; i < obj.CALLBACK.length; i++) 
                        if (obj.CALLBACK[i] != undefined) 
                            try {
                                obj.CALLBACK[i]({ 
                                    mousePosition: lx.CONTEXT.CONTROLLER.MOUSE.POS, 
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
                            //Check for collision

                            let collision = coll2.CheckCollision(coll1);

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

        //Update Log
        
        this.LOG.UPDATE();
        
        this.LOG.DATA.UPDATES++;
    },
    RENDER: function() {
        //Clear and initialize rendering preferences

        this.CLEAR();

        lx.CONTEXT.GRAPHICS.imageSmoothingEnabled = this.SETTINGS.AA;
        
        //Render buffer

        for (var i = 0; i < this.BUFFER.length; i++) {
            try {
                if (this.BUFFER[i] != undefined) 
                    this.BUFFER[i].forEach(function(obj) {
                        if (obj != undefined) 
                            obj.RENDER();
                    });

                if (this.LAYER_DRAW_EVENTS[i] != undefined) 
                    for (var ii = 0; ii < this.LAYER_DRAW_EVENTS[i].length; ii++)
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
                        obj.SIZE.W, 
                        obj.SIZE.H
                    ); 
            });
        
        //User Interface

        for (var i = 0; i < this.UI.length; i++) 
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
        
        for (var i = 0; i < this.BUFFER[LAYER].length+1; i++) 
            if (this.BUFFER[LAYER][i] == undefined) {
                this.BUFFER[LAYER][i] = OBJECT;
                return i;
            }
    },
    ADD_LOOPS: function(CALLBACK) {
        if (CALLBACK == undefined) 
            return;
        
        for (var i = 0; i < this.LOOPS.length+1; i++) 
            if (this.LOOPS[i] == undefined) {
                this.LOOPS[i] = CALLBACK;
                break;
            }
    },
    ADD_EVENT: function(TYPE, EVENT, CALLBACK) {
        for (var i = 0; i < this.EVENTS.length; i++) {
            if (this.EVENTS[i] != undefined && 
                this.EVENTS[i].TYPE == TYPE && 
                this.EVENTS[i].EVENT == EVENT) {
                this.EVENTS[i].CALLBACK[this.EVENTS[i].CALLBACK.length] = CALLBACK;
                return;   
            }
        }
            
        for (var i = 0; i < this.EVENTS.length+1; i++) {
            if (this.EVENTS[i] == undefined) {
                this.EVENTS[i] = {
                    TYPE: TYPE,
                    EVENT: EVENT,
                    CALLBACK: [CALLBACK]
                };
                return i;
            }
        }
    },
    INVALIDATE_EVENT: function(TYPE, EVENT) {
        for (var i = 0; i < this.EVENTS.length; i++) 
            if (this.EVENTS[i] != undefined && 
                this.EVENTS[i].TYPE == TYPE && 
                this.EVENTS[i].EVENT == EVENT) 
                for (var ii = 0; ii < this.EVENTS[i].CALLBACK.length; ii++)
                    if (this.EVENTS[i].CALLBACK[ii] != undefined) 
                        this.EVENTS[i].CALLBACK[ii]({
                            mousePosition: lx.CONTEXT.CONTROLLER.MOUSE.POS,
                            state: 0
                        });
    },
    CLEAR_EVENT: function(TYPE, EVENT) {
        for (var i = 0; i < this.EVENTS.length; i++) {
            if (this.EVENTS[i].TYPE == TYPE && this.EVENTS[i].EVENT == EVENT) {
                this.EVENTS[i] = undefined;
                return;   
            }
        }
    },
    ADD_COLLIDER: function(COLLIDER) {
        for (var i = 0; i < this.COLLIDERS.length+1; i++) {
            if (this.COLLIDERS[i] == undefined) {
                this.COLLIDERS[i] = COLLIDER;
                return i;
            }
        }
    },
    ADD_UI_ELEMENT: function(UI_ELEMENT) {
        for (var i = 0; i < this.UI.length+1; i++) {
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
                X: Math.floor(Math.round(POS.X)-Math.round(this.FOCUS.Position().X)+lx.GetDimensions().width/2-this.FOCUS.SIZE.W/2),
                Y: Math.floor(Math.round(POS.Y)-Math.round(this.FOCUS.Position().Y)+lx.GetDimensions().height/2-this.FOCUS.SIZE.H/2)
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
        
        for (var i = 0; i < this.LAYER_DRAW_EVENTS[LAYER].length+1; i++) {
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
            if (this.CHANNELS[CHANNEL] == undefined) this.SET_CHANNEL_VOLUME(CHANNEL, 1);
            
            return this.CHANNELS[CHANNEL];
        },
        ADD: function (SRC, CHANNEL, DELAY, LOOPS) {
            if (!this.CAN_PLAY || SRC == "") return;
            
            if (this.CHANNELS[CHANNEL] == undefined) this.SET_CHANNEL_VOLUME(CHANNEL, 1);
            
            for (var i = 0; i <= this.SOUNDS.length; i++) {
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
            
            if (this.CHANNELS[CHANNEL] == undefined) this.SET_CHANNEL_VOLUME(CHANNEL, 1);
            
            for (var i = 0; i <= this.SOUNDS.length; i++) {
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
            var VOL = 1-(Math.abs(POS.X - lx.GetDimensions().width/2)/lx.GetDimensions().width + Math.abs(POS.Y - lx.GetDimensions().height/2)/lx.GetDimensions().height);
            
            if (VOL < 0) VOL = 0;
            else if (VOL > this.CHANNELS[CHANNEL]) VOL = this.CHANNELS[CHANNEL];
            
            return VOL;
        },
        UPDATE: function () {
            if (!this.CAN_PLAY) return;
            
            for (var i = 0; i < this.SOUNDS.length; i++) {
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
                    var temp = new Audio();
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
        for (var i = 0; i < this.GO_MOUSE_EVENTS.length+1; i++)
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
        for (var i = 0; i < this.GO_MOUSE_EVENTS.length; i++)
            if (this.GO_MOUSE_EVENTS[i] != undefined && this.GO_MOUSE_EVENTS[i].BUTTON == BUTTON)
                if (this.GO_MOUSE_EVENTS[i].GO == undefined)
                    this.GO_MOUSE_EVENTS[i] = undefined;
                else if (lx.GAME.GET_MOUSE_IN_BOX(this.GO_MOUSE_EVENTS[i].GO.POS, this.GO_MOUSE_EVENTS[i].GO.SIZE))
                    this.GO_MOUSE_EVENTS[i].CALLBACK();
                    
        //...
    },
    GET_MOUSE_IN_BOX: function (POS, SIZE) {
        if (this.FOCUS != undefined) 
            POS = this.TRANSLATE_FROM_FOCUS(POS);
        
        if (POS.X <= lx.CONTEXT.CONTROLLER.MOUSE.POS.X && POS.X+SIZE.W >= lx.CONTEXT.CONTROLLER.MOUSE.POS.X && 
            POS.Y <= lx.CONTEXT.CONTROLLER.MOUSE.POS.Y && POS.Y+SIZE.H >= lx.CONTEXT.CONTROLLER.MOUSE.POS.Y)
                return true;
        
        return false;
    }
};