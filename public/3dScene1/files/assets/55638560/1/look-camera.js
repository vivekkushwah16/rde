var LookCamera = pc.createScript('lookCamera');

Object.defineProperty(LookCamera.prototype, "pitch", {
    get: function() {
        return this._pitch;
    },
    
    set: function(value) {
        this._pitch = pc.math.clamp(value, -90, 90);
    }
});


// Property to get and set the yaw of the camera around the pivot point (degrees)
Object.defineProperty(LookCamera.prototype, "yaw", {
    get: function() {
        return this._yaw;
    },
    
    set: function(value) {
        this._yaw = value;
    }
});

var canLook = true;


LookCamera.prototype.teleport = function (targetFloorPosition) {
    // Have to take the camera XZ offset into account otherwise it is possible for the user
    // to drift to much from the center of the guardian area
    
    var yOffset = pc.DEFAULT_HUMAN_HEIGHT;

    if (this._hasStageParams) {
        yOffset = 0;
    }
    
    var offset = new pc.Vec3().sub2(this.entity.getPosition(), this._offsetParent.getPosition()).scale(-1);
    this._offsetParent.setPosition(targetFloorPosition.x + offset.x, targetFloorPosition.y + yOffset, targetFloorPosition.z + offset.z);
};


LookCamera.prototype.getRotationDiff = function () {
    return this._rotationDiff;    
};


LookCamera.prototype.initialize = function () {
    this._offsetParent = this.entity.parent;
    
    // Camera euler angle rotation around x and y axes
    var rotation = this.entity.getRotation();
    this._yaw = pc.util.getYaw(rotation);
    this._pitch = this._getPitch(rotation, this._yaw);
    this._prevYaw = this._yaw;
    
    this._magicWindowEnabled = false;
    this._presenting = false;
    
    this._hasStageParams = false;
    
   /* if (this.app.vr && this.app.vr.display) {
        var appVrDisplay = this.app.vr.display;
        
        if (appVrDisplay.display.stageParameters) {        
            this._hasStageParams = true;
        }
        
        this.entity.camera.vrDisplay = appVrDisplay;
        appVrDisplay.on("presentchange", this._onVrPresentChange, this);
        
        if (appVrDisplay.capabilities.hasPosition) {
            if (this._hasStageParams) {
                var pos = this._offsetParent.getPosition();
                this._offsetParent.setPosition(pos.x, pos.y - pc.DEFAULT_HUMAN_HEIGHT, pos.z);//-----ground
            }
        }
        
        this._magicWindowEnabled = true;
    }*/
    
    this._prevRotation = new pc.Vec2(this._pitch, this._yaw);
    this._rotationDiff = new pc.Vec2(0, 0); 
    
    this._blackoutModel = this.entity.findByName('Blackout Plane');
    this._blackoutAlpha = 0;
    
    canLook = true;
    this.app.on('lockCamera', function(){
       canLook = false; 
        console.log("look camera re "+ canLook);
    });
    
    this.app.on('unlockCamera', function(){
        canLook = true;
    });
};


LookCamera.debugCameraOffset = new pc.Vec3();
LookCamera.BLACKOUT_LERP_FACTOR = 12;

LookCamera.prototype.update = function (dt) {     
    
    if(!canLook){ return; }
        
    if (this._magicWindowEnabled || this._presenting) {
        // If we are using the magic window, then only use the touch x to rotate the view horizontally
        this._offsetParent.setLocalEulerAngles(0, this.yaw, 0);
    }
    else {
        this._offsetParent.setLocalEulerAngles(this.pitch, this.yaw, 0);
    }
    
    if (this._presenting) {
        // If the user has changed the offset rotation manually, then we should enable the blackout
        if (this._prevYaw != this.yaw) {            
            this._blackoutAlpha = pc.math.lerp(this._blackoutAlpha, 1, Math.min(LookCamera.BLACKOUT_LERP_FACTOR * dt));
        } else {
            this._blackoutAlpha = pc.math.lerp(this._blackoutAlpha, 0, Math.min(LookCamera.BLACKOUT_LERP_FACTOR * dt / 3));
        }
    }
    
    if (this._blackoutAlpha > 0.001) {
        if (!this._blackoutModel.enabled) {
            this._blackoutModel.enabled = true;
        }
    } else {
        if (this._blackoutModel.enabled) {
            this._blackoutModel.enabled = false;
        }        
    }
    
    pc.util.setEntityAlpha(this._blackoutModel, this._blackoutAlpha);
    
    // Update the real camera angles
    var rotation = this.entity.getRotation();
    var yaw = pc.util.getYaw(rotation);
    var pitch = this._getPitch(rotation, yaw);
    
    this._rotationDiff.set(pitch - this._prevRotation.x, yaw - this._prevRotation.y); 
    this._prevRotation.set(pitch, yaw);
    
    this._prevYaw = this.yaw;
};


LookCamera.prototype._onVrPresentChange = function(display) {
    if (display.presenting) {
        this._offsetParent.setLocalEulerAngles(0, this.yaw, 0);
        this._presenting = true;
        
    } else {       
        if (this._magicWindowEnabled) {
            if (this.app.vr && this.app.vr.display) {
                var appVrDisplay = this.app.vr.display;
                this.entity.camera.vrDisplay = appVrDisplay;
            }
        }
        
        this._blackoutAlpha = 0;
        this._presenting = false;
    }
};


LookCamera.quatWithoutYaw = new pc.Quat();
LookCamera.yawOffset = new pc.Quat();

LookCamera.prototype._getPitch = function(quat, yaw) {
    var quatWithoutYaw = LookCamera.quatWithoutYaw;
    var yawOffset = LookCamera.yawOffset;
    
    yawOffset.setFromEulerAngles(0, -yaw, 0);
    quatWithoutYaw.mul2(yawOffset, quat);
    
    var transformedForward = new pc.Vec3();
    
    quatWithoutYaw.transformVector(pc.Vec3.FORWARD, transformedForward);
    
    return Math.atan2(transformedForward.y, -transformedForward.z) * pc.math.RAD_TO_DEG;
};