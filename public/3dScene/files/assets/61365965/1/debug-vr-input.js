// A quick script to use the vr controller without an actual VR controller :)

var DebugVrInput = pc.createScript('debugVrInput');

DebugVrInput.attributes.add('vrControllerEntity', {type: 'entity', title: 'VR Controller'});
DebugVrInput.attributes.add('handMoveSpeed', {type: 'number', default: 1.5, title: 'Hand Move Speed'});
DebugVrInput.attributes.add('tapThreshold', {type: 'number', default: 0.25, title: 'Tap Threshold (secs)'});

// initialize code called once per entity
DebugVrInput.prototype.initialize = function() {
    this._vrController = this.vrControllerEntity.script.sixDofController;
    if (!this._vrController.enabled) {
        this._vrController = this.vrControllerEntity.script.threeDofController;            
    }
    
    this._secsSinceLmbDown = 0;  
    
    this._prevGamepadButtonDown = false;
    
    this.on('state', this._onStateChanged, this);
};

DebugVrInput.prototype.postInitialize = function () {
    this.app.fire('vrinput:enabled');
};

DebugVrInput.moveDiff = new pc.Vec3();
DebugVrInput.controllerPosition = new pc.Vec3();
DebugVrInput.DEFAULT_QUAT = new pc.Quat();

// update code called every frame
DebugVrInput.prototype.update = function(dt) {
    var moveDiff = DebugVrInput.moveDiff.set(0, 0, 0);
    var controllerPosition = DebugVrInput.controllerPosition;
    
    var keyboard = this.app.keyboard;
    var mouse = this.app.mouse;
        
    if (keyboard.isPressed(pc.KEY_UP) || keyboard.isPressed(pc.KEY_W)) {
        moveDiff.z = -1;
    } else if (keyboard.isPressed(pc.KEY_DOWN) || keyboard.isPressed(pc.KEY_S)) {
        moveDiff.z = 1;
    } else if (keyboard.isPressed(pc.KEY_LEFT) || keyboard.isPressed(pc.KEY_A)) {
        moveDiff.x = -1;
    } else if (keyboard.isPressed(pc.KEY_RIGHT) || keyboard.isPressed(pc.KEY_D)) {
        moveDiff.x = 1;
    } else if (keyboard.isPressed(pc.KEY_PAGE_UP) || keyboard.isPressed(pc.KEY_E)) {
        moveDiff.y = 1;
    } else if (keyboard.isPressed(pc.KEY_PAGE_DOWN) || keyboard.isPressed(pc.KEY_Q)) {
        moveDiff.y = -1;
    }
    
    var gamepadButtonDown = false;
    if (this.app.gamepads) { 
        gamepadButtonDown = this.app.gamepads.isPressed(pc.PAD_1, pc.PAD_FACE_1);
        
        var axisX = this.app.gamepads.getAxis(pc.PAD_1, pc.PAD_R_STICK_X);
        var axisY = this.app.gamepads.getAxis(pc.PAD_1, pc.PAD_R_STICK_Y);
        
        if (axisX > 0.25) {
            moveDiff.x = 0.5; 
        }
        
        if (axisX < -0.25) {
            moveDiff.x = -0.5;
        }

        if (axisY > 0.25) {
            moveDiff.z = 0.5;
        }

        if (axisY < -0.25) {
            moveDiff.z = -0.5;
        }
    }
    
    if (mouse.wasPressed(pc.MOUSEBUTTON_LEFT) || (!this._prevGamepadButtonDown && gamepadButtonDown)) {
        this._vrController.onButtonDown();
        this._secsSinceLmbDown = 0;
    }
    
    if (mouse.wasReleased(pc.MOUSEBUTTON_LEFT) || (this._prevGamepadButtonDown && !gamepadButtonDown)) {
        if (this._secsSinceLmbDown <= this.tapThreshold) {
            this._vrController.onButtonTap();
        }

        this._vrController.onButtonUp();
    }
    
    this._prevGamepadButtonDown = gamepadButtonDown;
    
    controllerPosition.copy(this.vrControllerEntity.getLocalPosition());
    moveDiff.scale(this.handMoveSpeed * dt);
    controllerPosition.add(moveDiff);
    
    this.entity.setLocalPosition(controllerPosition);
    
    this._secsSinceLmbDown += dt;
};

DebugVrInput.prototype._onStateChanged = function (enabled) {
    if (enabled) {
        this.app.fire('vrinput:enabled');  
    } else {
        this.app.fire('vrinput:disabled');  
    }
};