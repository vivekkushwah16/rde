var Grabbable = pc.createScript('grabbable');

Grabbable.STATE_IDLE = 'IDLE';
Grabbable.STATE_RESET_TELEPORT_OUT = 'RESET_TELEPORT_OUT';
Grabbable.STATE_RESET_TELEPORT_IN = 'RESET_TELEPORT_IN';
Grabbable.STATE_IN_USE_WITH = 'IN_USE_WITH';

// initialize code called once per entity
Grabbable.prototype.initialize = function() {
    this.entity.on('object:onhover', this._onHover, this);
    this.entity.on('object:offhover', this._offHover, this);
    
    this.entity.on('object:hold', this._onHold, this);
    this.entity.on('object:release', this._onRelease, this);

    this._controller = null;     
    this._grabRotationOffset = new pc.Quat();
    
    this._wasGrabbed = false;
    this._secsSinceReleased = 0;
    this._yPositionWhenStopped = 0;
    
    this._startLocalTransform = this.entity.getLocalTransform().clone();
    
    this._state = Grabbable.STATE_IDLE;
    this._secsSinceStateChange = 0;
    
    this._prevPosition = new pc.Vec3().copy(this.entity.getPosition());
    this._releasedVelocity = new pc.Vec3();
    
    // For the 'real' position of the grabbable with out the bob offset so we can 
    // apply velocity etc without the offset affecting the position
    this._positionWithoutBob = new pc.Vec3().copy(this.entity.getPosition());
};


Grabbable.RESET_TIMEOUT = 10;
Grabbable.BOB_HEIGHT = 0.1;
Grabbable.BOB_ANIM_LENGTH = 4;

// update code called every frame
Grabbable.prototype.postUpdate = function(dt) {
    this._secsSinceStateChange += dt;
    
    switch(this._state) {
        case Grabbable.STATE_IDLE:
            this._updateStateIdle(dt);
            break;
            
        case Grabbable.STATE_RESET_TELEPORT_OUT:
            this._updateStateResetTeleportOut(dt);
            break;
            
        case Grabbable.STATE_RESET_TELEPORT_IN:
            this._updateStateResetTeleportIn(dt);
            break;
    }
};


Grabbable.prototype._changeState = function (state) {
    this._secsSinceStateChange = 0;
    this._state = state;
};


Grabbable.DECELERATION_TIME = 1;
Grabbable.DECELERATION_CURVE = 0.9;
Grabbable.DELAY_BEFORE_BOB = 0.3;

Grabbable.velocity = new pc.Vec3();
Grabbable.newPosition = new pc.Vec3();
Grabbable.updatedRotation = new pc.Quat();

Grabbable.prototype._updateStateIdle = function (dt) {
    var newRotation = Grabbable.updatedRotation;    
    var velocity = Grabbable.velocity;
    var position = Grabbable.newPosition;
    
    this._prevPosition.copy(this.entity.getPosition());
    
    if (this._controller) {
        // TODO Have I got this backwards? Should the controller do this on the update?
        this._controller.updateAttachment(this.entity, this._grabRotationOffset);
    } else {
        if (this._wasGrabbed) {                        
            this._secsSinceReleased += dt;       
                        
            var t = Math.min(this._secsSinceReleased / Grabbable.DECELERATION_TIME, 1);
            velocity.lerp(this._releasedVelocity, pc.util.DEFAULT_VEC3_0, pc.util.unitCurve(t, Grabbable.DECELERATION_CURVE));
            velocity.scale(dt);
                        
            // Change the 'real' position with the velocity
            if (this._secsSinceReleased <= Grabbable.DECELERATION_TIME) {
                this._positionWithoutBob.add(velocity);
            }
            
            position.copy(this._positionWithoutBob);
            
            // Apply the bob offset
            if (this._secsSinceReleased >= Grabbable.DELAY_BEFORE_BOB) {
                var k = (((this._secsSinceReleased - Grabbable.DELAY_BEFORE_BOB) % Grabbable.BOB_ANIM_LENGTH) / Grabbable.BOB_ANIM_LENGTH) * (2 * Math.PI);
                var yOffset = Math.sin(k) * Grabbable.BOB_HEIGHT;     
                position.y += yOffset;
            }
            
            this.entity.setPosition(position);
            
            if (this._secsSinceReleased >= Grabbable.RESET_TIMEOUT) {
                this._removeHighlight(this.entity);
                this._changeState(Grabbable.STATE_RESET_TELEPORT_OUT);
            }            
        }
    }
};


Grabbable.TELEPORT_ANIM_LENGTH = 0.2;
Grabbable.SMALLEST_SCALE = new pc.Vec3(0.001, 0.001, 0.001);
Grabbable.updatedScale = new pc.Vec3();

Grabbable.prototype._updateStateResetTeleportOut = function (dt) {
    var t = Math.min(this._secsSinceStateChange / Grabbable.TELEPORT_ANIM_LENGTH, 1);
    var scale = Grabbable.updatedScale;
    scale.lerp(this._startLocalTransform.getScale(), Grabbable.SMALLEST_SCALE, t);
    this.entity.setLocalScale(scale);
    
    if (this._secsSinceStateChange >= Grabbable.TELEPORT_ANIM_LENGTH) {
        this.entity.setLocalPosition(this._startLocalTransform.getTranslation());
        this.entity.setLocalEulerAngles(this._startLocalTransform.getEulerAngles());
        
        this._changeState(Grabbable.STATE_RESET_TELEPORT_IN);
    }
};


Grabbable.prototype._updateStateResetTeleportIn = function (dt) {
    var t = Math.min(this._secsSinceStateChange / Grabbable.TELEPORT_ANIM_LENGTH, 1);
    var scale = Grabbable.updatedScale;
    scale.lerp(Grabbable.SMALLEST_SCALE, this._startLocalTransform.getScale(), t);
    this.entity.setLocalScale(scale);
    
    if (this._secsSinceStateChange >= Grabbable.TELEPORT_ANIM_LENGTH) {
        this._secsSinceReleased = 0;
        this._wasGrabbed = false;
        
        this._changeState(Grabbable.STATE_IDLE);
    }            
};

Grabbable.prototype._onHover = function () {
    if (this._isIdle()) {
        this._addHighlight(this.entity);
    }
};


Grabbable.prototype._offHover = function () {
    if (this._isIdle()) {
        this._removeHighlight(this.entity);
    }
};


Grabbable.prototype._onHold = function (controller) {
    if (this._isIdle()) {
        // This is so we can pass the object from one hand to another
        if (this._controller) {
            this._controller.detach(this.entity);
        }

        this._controller = controller;
        this._grabRotationOffset.copy(controller.getAttachRotation()).invert().mul(this.entity.getRotation());

        controller.attach(this.entity);
        this._removeHighlight(this.entity);
    }
};


Grabbable.RELEASE_VELOCITY_FACTOR = 10;
Grabbable.MAX_RELEASE_VELOCITY = 2.5;

Grabbable.prototype._onRelease = function (controller) {
    if (this._isIdle()) {
        if (this._controller == controller) {
            this._controller.detach(this.entity);
            this._controller = null;

            this._secsSinceReleased = 0;
            this._wasGrabbed = true; 
            
            // Give a little bit of momentum based on last frame position
            this._releasedVelocity.sub2(this.entity.getPosition(), this._prevPosition).scale(Grabbable.RELEASE_VELOCITY_FACTOR); 
            var l = this._releasedVelocity.length();
            if (l > Grabbable.MAX_RELEASE_VELOCITY) {
                this._releasedVelocity.normalize().scale(Grabbable.MAX_RELEASE_VELOCITY);
            }
            
            this._positionWithoutBob.copy(this.entity.getPosition());
        } 
    }
};
    
   
Grabbable.prototype._hasMoved = function() {
    return this._wasGrabbed;
};


Grabbable.prototype._isIdle = function () {
    return this._state == Grabbable.STATE_IDLE;    
};


Grabbable.prototype._addHighlight = function (entity) {
    pc.util.setEntityEmissive(entity, pc.util.HIGHLIGHT_ENTITY_GREEN); 
    
    var children = entity.children;
    for (var i = 0; i < children.length; ++i) {
        this._addHighlight(children[i]);
    }
};


Grabbable.prototype._removeHighlight = function (entity) {
    pc.util.setEntityEmissive(entity, pc.util.HIGHLIGHT_ENTITY_DEFAULT);    
    
    var children = entity.children;
    for (var i = 0; i < children.length; ++i) {
        this._removeHighlight(children[i]);
    }
};