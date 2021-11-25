var MouseInput = pc.createScript('mouseInput');

MouseInput.attributes.add('sensitivity', {type: 'number', default: 0.3, title: 'Sensitivity'});
MouseInput.attributes.add('gazeControllerEntity', {type: 'entity', title: 'Gaze Controller Entity'});

var canLockMouse = true;

// initialize code called once per entity
MouseInput.prototype.initialize = function() {
    this._vrController = this.gazeControllerEntity.script.gazeController;
    
    if (this._vrController) {
        var self = this;
        
        var onMouseOut = function (e) {
           self.onMouseOut(e);
        };
        
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this._onMouseDown, this);
        this.app.mouse.on(pc.EVENT_MOUSEUP, this._onMouseUp, this);
        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this._onMouseMove, this);
       
        // Remove the listeners so if this entity is destroyed
        this.on('destroy', function() {
            this.app.mouse.off(pc.EVENT_MOUSEDOWN, this._onMouseDown, this);
            this.app.mouse.off(pc.EVENT_MOUSEUP, this._onMouseUp, this);
            this.app.mouse.off(pc.EVENT_MOUSEMOVE, this._onMouseMove, this);
        });
    }
    
    // Disabling the context menu stops the browser displaying a menu when
    // you right-click the page
    this.app.mouse.disableContextMenu();
    
    this.app.on('lockCamera', function(){
       canLockMouse = false; 
    });
    this.app.on('unlockCamera', function(){
        canLockMouse = true;
    });
    setInterval(function(){
     this.app.mouse.disablePointerLock();   
    },1000);
     
};

MouseInput.prototype.update= function(dt){
    
     //this.app.mouse.disablePointerLock();
};

MouseInput.prototype._onMouseDown = function (event) {
    // Attempt to lock the pointer
    if (!pc.Mouse.isPointerLocked() && canLockMouse) {
        if (event.event.target.id && event.event.target.id == 'application-canvas') {
        //    this.app.mouse.enablePointerLock();
        }
    }
    
    switch (event.button) {
        case pc.MOUSEBUTTON_LEFT: {
            this._vrController.onButtonDown();
            this._secsSinceLmbDown = 0;
        } break;
    }    
};


MouseInput.prototype._onMouseUp = function (event) {
    switch (event.button) {
        case pc.MOUSEBUTTON_LEFT: {                
            this._vrController.onButtonUp();
        } break;
    }
};


MouseInput.prototype._onMouseMove = function (event) {    
    if (pc.Mouse.isPointerLocked() || this.app.mouse.isPressed(pc.MOUSEBUTTON_LEFT)) {
        this._vrController.pitch -= event.dy * this.sensitivity;
        this._vrController.yaw -= event.dx * this.sensitivity;
    }
};
