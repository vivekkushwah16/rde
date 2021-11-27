var ThreeDofController = pc.createScript('threeDofController');

ThreeDofController.attributes.add('cameraEntity', {type: 'entity', title: 'Camera Entity'});
ThreeDofController.attributes.add('locatorTemplate', {type: 'entity', title: 'Locator Template'});
ThreeDofController.attributes.add('maxGrabDistance', {type: 'number', default: 0.1, title: 'Max Grab Distance'});


Object.defineProperty(ThreeDofController.prototype, "pitch", {
    get: function() {
        return this._lookCamera.pitch;
    },
    
    set: function(value) {
        this._lookCamera.pitch = value;
    }
});


Object.defineProperty(ThreeDofController.prototype, "yaw", {
    get: function() {
        return this._lookCamera.yaw;
    },
    
    set: function(value) {
        this._lookCamera.yaw = value;
    }
});


ThreeDofController.prototype.onButtonDown = function () {    
    if (this._state == ThreeDofController.STATE_IDLE) {
        if (this._targetedEntity) {
            this._targetedEntity.fire('object:hold', this);
        }
    }
};


ThreeDofController.prototype.onButtonUp = function () {
    if (this._state == ThreeDofController.STATE_HOLDING) {
        // If we are targeting something viable while holding an item
        // then give it the responsibility of what to do with it
        if (this._targetedEntity) {
            this._targetedEntity.fire('object:attemptuse', this);
        }
        
        // We should let go anyway
        if (this._heldEntity) {
            this._heldEntity.fire('object:release', this);
        }
    }  
};


ThreeDofController.prototype.onButtonTap = function () {
    if (this._state == ThreeDofController.STATE_IDLE) {
        if (this._validLanding) {
            this._teleport();
        } else {
            if (this._targetedEntity) {
                this._targetedEntity.fire('object:hold', this);
                this._targetedEntity.fire('object:interact', this);
            }
        }
    } else {
        this.onButtonUp();
    }
};


ThreeDofController.prototype.getAttachPosition = function () {
    return this._grabAnchor.getPosition();
};


ThreeDofController.prototype.getAttachRotation = function () {
    return this._grabAnchor.getRotation();
};


ThreeDofController.updatedRotation = new pc.Quat();

ThreeDofController.prototype.updateAttachment = function (entity, rotationOffset) {
    var updateRotation = ThreeDofController.updatedRotation;
    entity.setPosition(this.getAttachPosition());
    updateRotation.mul2(this.getAttachRotation(), rotationOffset);
    entity.setRotation(updateRotation);    
};


ThreeDofController.DEFAULT_GRAB_ANCHOR_DISTANCE = 0.35;
ThreeDofController.distanceToEntity = new pc.Vec3();

ThreeDofController.prototype.attach = function (entity) {
    this._heldEntity = entity;
    
    // Move the grab anchor to the object or to a set distance (whichever is closer)
    var distanceToEntity = ThreeDofController.distanceToEntity.sub2(this._heldEntity.getPosition(), this.entity.getPosition());
    var distance = distanceToEntity.length();
    if (distance < ThreeDofController.DEFAULT_GRAB_ANCHOR_DISTANCE) {
        this._grabAnchor.setPosition(this._heldEntity.getPosition()); 
    } else {
        this._grabAnchor.setLocalPosition(0, 0, -ThreeDofController.DEFAULT_GRAB_ANCHOR_DISTANCE);
    }
    
    this._state = ThreeDofController.STATE_HOLDING;
};


ThreeDofController.prototype.detach = function (entity) {
    this._heldEntity = null;
    this._state = ThreeDofController.STATE_IDLE;
};


ThreeDofController.prototype.getHeldEntity = function () {
    return this._heldEntity;    
};


ThreeDofController.STATE_IDLE = 'IDLE';
ThreeDofController.STATE_HOLDING = 'HOLDING';

// initialize code called once per entity
ThreeDofController.prototype.initialize = function() {
    this._ray = new pc.Ray();
    this._landingPosition = new pc.Vec3(0, -1, 0);        
    this._validLanding = false;    
    this._lookCamera = this.cameraEntity.script.lookCamera;    
    this._targetedEntity = null;
    
    this._state = ThreeDofController.STATE_IDLE;
    this._heldEntity = null;
    
    this._locatorEntity = this.locatorTemplate.clone();
    this.app.root.addChild(this._locatorEntity);
    
    this._grabAnchor = this.entity.findByName('Grab Anchor');
    this._rayModel = this.entity.findByName('Ray Model');
    this._reticle = this.entity.findByName('Reticule');
            
    this.on('state', this._onStateChanged, this);
};


ThreeDofController.grabPoint = new pc.Vec3();
ThreeDofController.hitPoint = new pc.Vec3();
ThreeDofController.diffPosition = new pc.Vec3();
ThreeDofController.RAY_MODEL_SCALE_LERP_FACTOR = 12;

// update code called every frame
ThreeDofController.prototype.postUpdate = function(dt) {        
    this._ray.origin.copy(this.entity.getPosition());
    this._ray.direction.copy(this.entity.forward);
    
    var hitPoint = ThreeDofController.hitPoint.set(0,-100,0);
    var diffPosition = ThreeDofController.diffPosition;
        
    var validLanding = false;
    
    var hitEntity = null;
    if (this._state == ThreeDofController.STATE_IDLE) {
        hitEntity = this.app.shapeWorld.raycast(this._ray, this._idleRaycastFilter.bind(this), hitPoint);
        if (hitEntity) {
            if (hitEntity.tags.has('floor')) {
                // Make sure that are pointing down to the floor (y-axis) so we can't teleport from underneath
                var dot = hitEntity.up.dot(this._ray.direction);
                if (dot <= 0) {
                    this._landingPosition.copy(hitPoint);
                    validLanding = true;
                }
            } else {
                // If it's not the floor then check if it is something with can grab/interact with
                // If not, don't target it
                diffPosition.sub2(this.entity.getPosition(), hitPoint);
                if (diffPosition.lengthSq() >= this.maxGrabDistance * this.maxGrabDistance) {
                    hitEntity = null;
                }
            }
        }
    } else if (this._state == ThreeDofController.STATE_HOLDING) {
        hitEntity = this.app.shapeWorld.raycast(this._ray, this._holdingRaycstFilter.bind(this), hitPoint);
    }
    
    if (validLanding) {
        this._locatorEntity.setPosition(this._landingPosition.x, this._landingPosition.y + 0.01, this._landingPosition.z);
        this._locatorEntity.setRotation(hitEntity.getRotation());
        
        if (!this._locatorEntity.enabled) {
            this._locatorEntity.enabled = true;
        }
    } else {
        if (this._locatorEntity.enabled) {
            this._locatorEntity.enabled = false;
        }
    }
    
    this._validLanding = validLanding;
    
    if (hitEntity != this._targetedEntity) {
        if (this._targetedEntity) {
            this._targetedEntity.fire('object:offhover', this);
        }
        
        if (hitEntity) {
            hitEntity.fire('object:onhover', this);
        }
        
        this._targetedEntity = hitEntity;
    }    
    
    if (this._rayModel) {
        var rayModelScale = this._rayModel.getLocalScale();
        var targetScale = 2;

        rayModelScale.z = pc.math.lerp(rayModelScale.z, targetScale, Math.min(SixDofController.RAY_MODEL_SCALE_LERP_FACTOR * dt, 1));
        this._rayModel.setLocalScale(rayModelScale);
    }
    
    if (!this._validLanding && this._state == ThreeDofController.STATE_IDLE) {
        this._reticle.setPosition(hitPoint);
        if (!this._reticle.enabled) {
            this._reticle.enabled = true;
        }
    } else {
        if (this._reticle.enabled) {
            this._reticle.enabled = false;
        }            
    }
};


ThreeDofController.prototype._idleRaycastFilter = function (entity) {
    if (entity == this._heldEntity) {
        return false;
    }
   
    return true;
};


ThreeDofController.prototype._holdingRaycstFilter = function (entity) {
    if (entity == this._heldEntity) {
        return false;
    } 
    
    if (entity.script && entity.script.interactsWith) {
        return true;
    }
    
    return false;
};


ThreeDofController.offsetPosition = new pc.Vec3();

ThreeDofController.prototype._teleport = function() {
    if (this._validLanding) {
        this._lookCamera.teleport(this._landingPosition);
    }
};


ThreeDofController.prototype._onStateChanged = function(enabled) {
    if (this._locatorEntity) {
        this._locatorEntity.enabled = enabled;
    }
};

