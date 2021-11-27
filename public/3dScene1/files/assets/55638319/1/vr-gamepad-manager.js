var VrGamepadManager = pc.createScript('vrGamepadManager');

VrGamepadManager.attributes.add('cameraEntity', {type: 'entity', title: 'Camera Entity'});
VrGamepadManager.attributes.add('cameraOffsetEntity', {type: 'entity', title: 'Camera Offset Entity', description: 'Optional'});

VrGamepadManager.attributes.add('fakeElbowOffset', {
    type: 'vec3', 
    default: [0.25, -0.6, -0.15],
    title: 'Fake Elbow Offset', 
    description: 'Local offset between the camera and a simulated fake right elbow. Used for 3DOF controllers like the Daydream'
});

VrGamepadManager.attributes.add('fakeWristOffset', {
    type: 'vec3', 
    default: [0, 0, -0.45],
    title: 'Fake Wrist Offset', 
    description: 'Local offset between the fake elbow and the fake wrist. Used for 3DOF controllers like the Daydream'
});


VrGamepadManager.prototype.initialize = function() {
    this.app.on('vrgamepad:controller:register', this._onRegisterController, this);
    this.app.on('vrgamepad:controller:deregister', this._onDeregisterController, this);
    
    this._padToControllerMappings = [];
    
    this._prevPadCount = 0;    
    this._prevPadRotation = {};
    this._padTorsoRotation = {};
};


VrGamepadManager.padPosition = new pc.Vec3();
VrGamepadManager.padRotation = new pc.Quat();

VrGamepadManager.prototype.update = function(dt) {     
    // Check if any pads have disconnected or connected during the course of the app
    // and if so, update the gamepad mappings to the hands
    var pads = this.app.gamepads.current;
    if (this._prevPadCount != pads.length) {
        this._updatePadToHandMappings();
    }
    
    this._prevPadCount = pads.length;
    
    var padPosition = VrGamepadManager.padPosition;
    var padRotation = VrGamepadManager.padRotation;
    
    // Update the VR hands position and rotation
    for (var i = 0; i < this._padToControllerMappings.length; ++i) {
        var map = this._padToControllerMappings[i];
        if (map.pad) {
            this._poseToWorld(dt, map.pad, padPosition, padRotation);
            map.entity.setPosition(padPosition);
            map.entity.setRotation(padRotation);
        }
    }
};


VrGamepadManager.prototype._updatePadToHandMappings = function () {
    var pads = this.app.gamepads.current;
        
    for (var i = 0; i < this._padToControllerMappings.length; ++i) {
        var map = this._padToControllerMappings[i];
        var prevPad = map.pad;
        map.pad = null;
        
        // Find the gamepad that represents this hand
        var count = 0;
        for (var j = 0; j < pads.length; ++j) {
            var pad = pads[j].pad;
            if (pad.hand) { 
                if (pad.hand == map.handType || map.handType == 'any') {
                    if (count == map.priority) {
                        map.pad = pad;
                        break;
                    }

                    count += 1;
                }
            }
        }  
        
        // If a pad is found that represents the hand, then send a connected event
        // if no pad was mapped before or if the previously mapped pad was different
        // If no pad is found, send a disconnected event 
        if (map.pad) {
            if (prevPad != map.pad) {
                map.entity.fire('vrgamepad:pad:connected', map.pad);
            }
        } else {
            map.entity.fire('vrgamepad:pad:disconnected');
        }  
    }  
};


VrGamepadManager.prototype._onRegisterController = function (handEntity, handType, priority) {
    var i = 0;
    var map = null;
    
    // Check if this entity has been previous registered
    for (i = 0; i < this._padToControllerMappings.length; ++i) {
        map = this._padToControllerMappings[i];
        if (map.entity == handEntity) {
            return;
        }
    }
    
    // Add mapping
    map = {};
    map.entity = handEntity;
    map.handType = handType;
    map.priority = priority;
    
    this._padToControllerMappings.push(map);
    
    this._updatePadToHandMappings();
};


VrGamepadManager.prototype._onDeregisterController = function (handEntity) {
    var i = 0;
    var len = this._padToControllerMappings.length;
    
    for (i = 0; i < len; ++i) {
        map = this._padToControllerMappings[i];
        if (map.entity == handEntity) {
            break;
        }
    }
    
    // Copy the last element into array entry we want to remove and 
    // remove the last element off the array (swap and pop trick)
    this._padToControllerMappings[i] = this._padToControllerMappings[len-1];
    this._padToControllerMappings.pop();
};


VrGamepadManager.posePosition = new pc.Vec3();
VrGamepadManager.poseRotation = new pc.Quat();
VrGamepadManager.poseTransform = new pc.Mat4();
VrGamepadManager.sitStandTransform = new pc.Mat4();
VrGamepadManager.outTransform = new pc.Mat4();
VrGamepadManager.elbowTransform = new pc.Mat4();
VrGamepadManager.elbowPosition = new pc.Vec3();
VrGamepadManager.cameraYawRotation = new pc.Quat();

VrGamepadManager.prevPadRotationClamped = new pc.Quat();
VrGamepadManager.currentPadRotationClamped = new pc.Quat();

VrGamepadManager.TORSO_ROTATION_SLERP = 2;
VrGamepadManager.TORSO_ROTATION_THRESHOLD = 45;

VrGamepadManager.DEFAULT_QUAT = new pc.Quat();
VrGamepadManager.DEFAULT_VEC_3_ONE = new pc.Vec3(1, 1, 1);

VrGamepadManager.prototype._poseToWorld  = function (dt, pad, outPosition, outRotation) {    
    var padPose = pad.pose;
    var padHand = pad.hand;
    
    // Convert the local space of the hand positional controllers to world space
    var pos = padPose.position;
    var ori = padPose.orientation;
    
    var p = VrGamepadManager.posePosition;
    var q = VrGamepadManager.poseRotation;
    var handTransform = VrGamepadManager.poseTransform;
    
    if (padPose.hasOrientation) {
        q.set(ori[0], ori[1], ori[2], ori[3]);
    } else {
        q.set(0, 0, 0, 1);
    }
        
    if (!this._prevPadRotation[pad.id]) {
        this._prevPadRotation[pad.id] = new pc.Quat().copy(q);
    }
    
    var prevPadRotation = this._prevPadRotation[pad.id];
    
    if (padPose.hasPosition) {
        // For 6DOF controllers
        p.set(pos[0], pos[1], pos[2]);
        handTransform.setTRS(p, q, VrGamepadManager.DEFAULT_VEC_3_ONE);
    } else {
        // Fake the hand position using a simulated elbow for 3DOF controllers
        var cameraYawRotation = VrGamepadManager.cameraYawRotation.setFromMat4(this.cameraEntity.getLocalTransform());
        var cameraYaw = this._getYaw(cameraYawRotation);         
        cameraYawRotation.setFromEulerAngles(0, cameraYaw, 0);   
        
        var cameraPosition = this.cameraEntity.getLocalPosition();
        
        if (!this._padTorsoRotation[pad.id]) {
            this._padTorsoRotation[pad.id] = new pc.Quat().copy(cameraYawRotation);
        }
        
        var torsoRotation = this._padTorsoRotation[pad.id];
        
        p.copy(this.fakeWristOffset);
        handTransform.setTRS(p, VrGamepadManager.DEFAULT_QUAT, VrGamepadManager.DEFAULT_VEC_3_ONE);
        
        // Fake the controller position with a fake elbow transform if the controller has no position        
        var elbowPosition = VrGamepadManager.elbowPosition;
        var elbowRotation = VrGamepadManager.elbowRotation;
        
        elbowPosition.copy(this.fakeElbowOffset);
        if (padHand == 'left') {
            elbowPosition.x *= -1;
        }
 
        elbowPosition.add(cameraPosition);
        
        // Check if the controller is moving, if so update the torso rotation
        var prevPadRotationClamped = VrGamepadManager.prevPadRotationClamped.copy(prevPadRotation);
        this._clampQuatToYAxis(prevPadRotationClamped);
        
        var currentPadRotationClamped = VrGamepadManager.currentPadRotationClamped.copy(q);
        this._clampQuatToYAxis(currentPadRotationClamped);        
        
        var deltaAngle = this._angleBetweenQuats(prevPadRotationClamped, currentPadRotationClamped);
        var angularVelocity = deltaAngle / dt;
        if (angularVelocity >= VrGamepadManager.TORSO_ROTATION_THRESHOLD) {
            torsoRotation.slerp(torsoRotation, cameraYawRotation, Math.min(VrGamepadManager.TORSO_ROTATION_SLERP * dt, 1));
        }        
        
        // Move the elbow offset to the right offset in torso space     
        torsoRotation.transformVector(elbowPosition, elbowPosition);
        
        var elbowTransform = VrGamepadManager.elbowTransform.setTRS(elbowPosition, q, VrGamepadManager.DEFAULT_VEC_3_ONE);                
        handTransform.mul2(elbowTransform, handTransform);
    }
        
    var sst = VrGamepadManager.sitStandTransform;
    var out = VrGamepadManager.outTransform;
    
    if (this.app.vr.display) {
        if (this.app.vr.display.display.stageParameters) {        
            sst.data = this.app.vr.display.display.stageParameters.sittingToStandingTransform;
            handTransform.mul2(sst, handTransform);
        }
    } 
    
    if (this.cameraOffsetEntity) {
        out.mul2(this.cameraOffsetEntity.getWorldTransform(), handTransform); 
    } else {
        out.copy(handTransform);
    }
    
    outRotation.setFromMat4(out);    
    outPosition.copy(out.getTranslation());
    
    this._prevPadRotation[pad.id].copy(q);
};


VrGamepadManager.transformedForward = new pc.Vec3();

VrGamepadManager.prototype._getYaw = function (quat) {
    var transformedForward = VrGamepadManager.transformedForward;
    quat.transformVector(pc.Vec3.FORWARD, transformedForward);

    return Math.atan2(-transformedForward.x, -transformedForward.z) * pc.math.RAD_TO_DEG;          
};


VrGamepadManager.prototype._clampQuatToYAxis = function (quat) {
    quat.x = 0; quat.z = 0;
    var mag = Math.sqrt(quat.w * quat.w + quat.y * quat.y);
    quat.w /= mag;
    quat.y /= mag;   
    
    return quat;
};


VrGamepadManager.inverseQuat = new pc.Quat();
VrGamepadManager.resultQuat = new pc.Quat();

VrGamepadManager.prototype._angleBetweenQuats = function (quat1, quat2) {
    var inverseQuat = VrGamepadManager.inverseQuat.copy(quat1).invert();
    var resultQuat = VrGamepadManager.resultQuat.mul2(quat2, inverseQuat);
    var result = Math.acos(pc.math.clamp(resultQuat.w, -1, 1)) * 2 * pc.math.RAD_TO_DEG;

    if (result > 180) {
        result = 360 - result;
    }

    return result;
};