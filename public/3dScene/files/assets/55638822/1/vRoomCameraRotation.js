var VRoomCameraRotation = pc.createScript('vRoomCameraRotation');


VRoomCameraRotation.attributes.add("mouseLookSensitivity", {type: "number", default: 0, title: "Mouse Look Sensitivity", description: ""});
VRoomCameraRotation.attributes.add("touchLookSensitivity", {type: "number", default: 0, title: "Touch Look Sensitivity", description: ""});

VRoomCameraRotation.attributes.add("sphere", {type: "entity", title: "Sphere"});

VRoomCameraRotation.prototype.initialize = function () {
    var self=this;
    // Camera euler angle rotation around x and y axes
    var quat = this.entity.getLocalRotation();
    this.ex = this.getPitch(quat) * pc.math.RAD_TO_DEG;
    this.ey = this.getYaw(quat) * pc.math.RAD_TO_DEG;
    
    //
     this._offsetParent = this.entity.parent;
     this._hasStageParams = false;
    //
    
    this.targetEx = this.ex;
    this.targetEy = this.ey;
            
    this.moved = false;
    this.lmbDown = false;

    // Disabling the context menu stops the browser displaying a menu when
    // you right-click the page
    this.app.mouse.disableContextMenu();

    this.lastTouchPosition = new pc.Vec2();

    this.addEventCallbacks();
        
    this.on("destroy", function () {
        this.removeEventCallbacks();
    });
    
    this.app.xr.on('start', function() {
        this.entity.setLocalEulerAngles(0, 0, 0);
    }, this);
    
    this.canLook = true;
    
    // this.app.on('lockCamera', function(){
    //     self.canLook = false; 
    //     // console.log("look camera re "+ self.canLook);
    //   // self.deact();
    // });
    
   
    
    // this.app.on('unlockCamera', function(){
    //      var quat = self.entity.getLocalRotation();
    //      self.ex = self.getPitch(quat) * pc.math.RAD_TO_DEG;
    //      self.ey = self.getYaw(quat) * pc.math.RAD_TO_DEG;
    //      self.targetEx = self.ex;
    //      self.targetEy = self.ey;
    //      self.canLook = true;
    // });
};

VRoomCameraRotation.prototype.deact = function () {
    var self=this;
     // setTimeout(function(){
    
         // var quat = self.entity.getLocalRotation();
         self.ex =0; //self.getPitch(quat) * pc.math.RAD_TO_DEG;
         self.ey = 0;//self.getYaw(quat) * pc.math.RAD_TO_DEG;
         self.ez = 0;//self.getYaw(quat) * pc.math.RAD_TO_DEG;
         self.targetEx = self.ex;
         self.targetEy = self.ey;
         self.targetEz = self.ez;
         // self.canLook = true;
     // },3000);
};

VRoomCameraRotation.prototype.teleport = function (targetFloorPosition) {
    // Have to take the camera XZ offset into account otherwise it is possible for the user
    // to drift to much from the center of the guardian area
    
    var yOffset = pc.DEFAULT_HUMAN_HEIGHT;
    
    if (this._hasStageParams) {
        yOffset = 0;
    }
    
    var offset = new pc.Vec3().sub2(this.entity.getPosition(), this._offsetParent.getPosition()).scale(-1);
    var temp=new pc.Vec3(targetFloorPosition.x + offset.x, targetFloorPosition.y + yOffset, targetFloorPosition.z + offset.z);
    this._offsetParent.script.cameraLerp.updatePosInstant(temp);
};

VRoomCameraRotation.prototype.addEventCallbacks = function() {
    if (this.app.mouse) {
        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
    }
    
    if (this.app.touch) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
        this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
        this.app.touch.on(pc.EVENT_TOUCHCANCEL, this.onTouchCancel, this);   
    }
};

VRoomCameraRotation.prototype.removeEventCallbacks = function() {
    if (this.app.mouse) {
        this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this);
    }
    
    if (this.app.touch) {
        this.app.touch.off(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        this.app.touch.off(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
        this.app.touch.off(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
        this.app.touch.off(pc.EVENT_TOUCHCANCEL, this.onTouchCancel, this);   
    }
};

// Taken from http://stackoverflow.com/questions/23310299/quaternion-from-tait-bryan-angles
// Not completely accurate, usually a couple of degrees out
VRoomCameraRotation.prototype.getYaw = function (quaternion) {
    var q = quaternion;
    var x = q.x * q.x;
    var y = q.y * q.y;
    
    return Math.atan2(2 * q.y * q.w - 2 * q.z * q.x, 1 - 2 * y - 2 * x);    
};

VRoomCameraRotation.prototype.getPitch = function(quaternion) {
    var q = quaternion;
    return -Math.asin(2 * q.z * q.y + 2 * q.x * q.w);
};

VRoomCameraRotation.prototype.update = function (dt) {
     if(!this.canLook){ return; }
    // Update the camera's orientation
    this.ex = pc.math.lerp(this.ex, this.targetEx, dt / 0.2);
    this.ey = pc.math.lerp(this.ey, this.targetEy, dt / 0.2);
        
    if (! this.app.xr.active) {
        this.entity.setLocalEulerAngles(this.ex, this.ey, 0);
    }
    
    this.sphere.setPosition(this.entity.getPosition());
};

VRoomCameraRotation.prototype.moveCamera = function(dx, dy, lookSensitivity) {
     if(!this.canLook){ return; }
    // Update the current Euler angles, clamp the pitch.
    if (!this.moved) {
        // first move event can be very large
        this.moved = true;
        return;
    }
        
    this.targetEx += dy * lookSensitivity;
    this.targetEx = pc.math.clamp(this.targetEx, -90, 90);
    this.targetEy += dx * lookSensitivity;  
};

VRoomCameraRotation.prototype.onMouseMove = function (event) {    
    if (!this.lmbDown)
        return;
    
    this.moveCamera(event.dx, event.dy, this.mouseLookSensitivity);
};

VRoomCameraRotation.prototype.onMouseDown = function (event) {
    if (event.button === 0) {
        this.lmbDown = true;
    }
};

VRoomCameraRotation.prototype.onMouseUp = function (event) {
    if (event.button === 0) {
        this.lmbDown = false;
    }
};

VRoomCameraRotation.prototype.onTouchStart = function(event) {
    if (event.touches.length == 1) {
        this.lmbDown = true;
        var touch = event.touches[0];
        this.lastTouchPosition.set(touch.x, touch.y);
    }
    event.event.preventDefault();
};

VRoomCameraRotation.prototype.onTouchEnd = function(event) {
    if (event.touches.length === 0) {
        this.lmbDown = false;
    } else if (event.touches.length == 1) {
        var touch = event.touches[0];
        this.lastTouchPosition.set(touch.x, touch.y);  
    }
};

VRoomCameraRotation.prototype.onTouchMove = function(event) {
    var touch = event.touches[0];
    if (event.touches.length == 1) {
        this.moveCamera((touch.x - this.lastTouchPosition.x), (touch.y - this.lastTouchPosition.y), this.touchLookSensitivity);
    }
    this.lastTouchPosition.set(touch.x, touch.y);
};

VRoomCameraRotation.prototype.onTouchCancel = function(event) {
    this.lmbDown = false;
};
// swap method called for script hot-reloading
// inherit your script state here
// Camera360.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/
// swap method called for script hot-reloading
// inherit your script state here
// VRoomCameraRotation.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/