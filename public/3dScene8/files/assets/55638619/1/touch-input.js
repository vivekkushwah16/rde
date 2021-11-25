var TouchInput = pc.createScript('touchInput');

TouchInput.attributes.add('sensitivity', {type: 'number', default: 0.4, title: 'Sensitivity'});
TouchInput.attributes.add('gazeControllerEntity', {type: 'entity', title: 'Gaze Controller Entity'});

// initialize code called once per entity
TouchInput.prototype.initialize = function() {
    this._vrController = this.gazeControllerEntity.script.gazeController;
    this._lastTouchPoint = new pc.Vec2();

    if (this.app.touch && this._vrController) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this._onTouchStart, this);
        this.app.touch.on(pc.EVENT_TOUCHEND, this._onTouchEndCancel, this);
        this.app.touch.on(pc.EVENT_TOUCHCANCEL, this._onTouchStartEndCancel, this);
        this.app.touch.on(pc.EVENT_TOUCHMOVE, this._onTouchMove, this);

        this.on('destroy', function() {
            this.app.touch.off(pc.EVENT_TOUCHSTART, this._onTouchStart, this);
            this.app.touch.off(pc.EVENT_TOUCHEND, this._onTouchEndCancel, this);
            this.app.touch.off(pc.EVENT_TOUCHCANCEL, this._onTouchStartEndCancel, this);
            this.app.touch.off(pc.EVENT_TOUCHMOVE, this._onTouchMove, this);
        });
    }
};


TouchInput.prototype._onTouchStart = function(event) {
    // We only care about the first touch for camera rotation. As the user touches the screen, 
    // we stored the current touch position
    var touches = event.touches;
    if (touches.length == 1) {
        this._vrController.onButtonDown();
        this._lastTouchPoint.set(touches[0].x, touches[0].y);
    }
};


TouchInput.prototype._onTouchEndCancel = function(event) {
    // We only care about the first touch for camera rotation. As the user touches the screen, 
    // we stored the current touch position
    var touches = event.touches;
    
    if (touches.length === 0) {        
        this._vrController.onButtonUp();
                
        if (!this._isOnVrIconArea(this._lastTouchPoint.x, this._lastTouchPoint.y)) {
            event.event.preventDefault();
        }
        
    } else if (touches.length == 1) {       
        this._lastTouchPoint.set(touches[0].x, touches[0].y);  
        
        if (!this._isOnVrIconArea(touches[0].x, touches[0].y)) {
            event.event.preventDefault();
        }
    }
};


TouchInput.prototype._onTouchMove = function(event) {    
    // We only care about the first touch for camera rotation. Work out the difference moved since the last event
    // and use that to update the camera target position 
    var touches = event.touches;
    if (touches.length == 1) {
        var touch = touches[0];

        this._vrController.pitch += (touch.y - this._lastTouchPoint.y) * this.sensitivity;
        this._vrController.yaw += (touch.x - this._lastTouchPoint.x) * this.sensitivity;    

        this._lastTouchPoint.set(touch.x, touch.y);
    }
};


TouchInput.prototype._isOnVrIconArea = function (x, y) {
    var height = window.screen.height;
    var width = window.screen.width;
    
    if (height < width) {
        if (x < 150 && y < 150) {
            return true;
        }

        if (y > height * 0.9) {
            return true;
        }
    }
    
    return false;
};