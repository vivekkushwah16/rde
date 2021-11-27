var SixDofController = pc.createScript('sixDofController');

SixDofController.attributes.add('cameraEntity', {type: 'entity', title: 'Camera Entity'});
SixDofController.attributes.add('locatorTemplate', {type: 'entity', title: 'Locator Template'});
SixDofController.attributes.add('maxGrabDistance', {type: 'number', default: 0.1, title: 'Max Grab Distance'});


Object.defineProperty(SixDofController.prototype, "pitch", {
    get: function() {
        return this._lookCamera.pitch;
    },
    
    set: function(value) {
        this._lookCamera.pitch = value;
    }
});


Object.defineProperty(SixDofController.prototype, "yaw", {
    get: function() {
        return this._lookCamera.yaw;
    },
    
    set: function(value) {
        this._lookCamera.yaw = value;
    }
});


SixDofController.prototype.onButtonDown = function () {
    if (this._state == SixDofController.STATE_IDLE) {
        if (this._targetedEntity) {
            this._targetedEntity.fire('object:hold', this);
        } else {
            this._state = SixDofController.STATE_TELEPORTING;
        }
    }
};


SixDofController.prototype.onButtonUp = function () {
    if (this._state == SixDofController.STATE_HOLDING) {
        // If we are targeting something viable while holding an item
        // then give it the responsibility of what to do with it
        if (this._targetedEntity) {
            this._targetedEntity.fire('object:attemptuse', this);
        }     
        
        if (this._heldEntity) {
            this._heldEntity.fire('object:release', this);
        }
    } else if (this._state == SixDofController.STATE_TELEPORTING) {
        if (this._validLanding) {
            this._teleport();            
        }
        
        this._state = SixDofController.STATE_IDLE;
    }
};


SixDofController.prototype.onButtonTap = function () {

};


SixDofController.prototype.getAttachPosition = function () {
    return this._grabAnchor.getPosition();
};


SixDofController.prototype.getAttachRotation = function () {
    return this._grabAnchor.getRotation();
};


SixDofController.updatedRotation = new pc.Quat();

SixDofController.prototype.updateAttachment = function (entity, rotationOffset) {
    var updateRotation = SixDofController.updatedRotation;
    entity.setPosition(this.getAttachPosition());
    updateRotation.mul2(this.getAttachRotation(), rotationOffset);
    entity.setRotation(updateRotation);    
};


SixDofController.prototype.attach = function (entity) {
    this._heldEntity = entity;
    this._grabAnchor.setPosition(entity.getPosition());
    this._state = SixDofController.STATE_HOLDING;
};


SixDofController.prototype.detach = function (entity) {
    this._heldEntity = null;
    this._state = SixDofController.STATE_IDLE;
};


SixDofController.prototype.getHeldEntity = function () {
    return this._heldEntity;    
};


SixDofController.prototype.getMovementDirection = function () {
    return this._movementDirection;        
};


SixDofController.STATE_IDLE = 'IDLE';
SixDofController.STATE_HOLDING = 'HOLDING';
SixDofController.STATE_TELEPORTING = 'TELEPORTING';

// initialize code called once per entity
SixDofController.prototype.initialize = function() {
    this._ray = new pc.Ray();
    this._landingPosition = new pc.Vec3(0, -1, 0);        
    this._validLanding = false;    
    this._lookCamera = this.cameraEntity.script.lookCamera;    
    this._targetedEntity = null;
    
    this._state = SixDofController.STATE_IDLE;
    this._heldEntity = null;
    
    this._locatorEntity = this.locatorTemplate.clone();
    this.app.root.addChild(this._locatorEntity);
    
    this._grabAnchor = this.entity.findByName('Grab Anchor');
    this._rayModel = this.entity.findByName('Ray Model');
    this._reticle = this.entity.findByName('Reticule');
    
    this._collisionSpheres = [];
    
    this._prevPosition = this.entity.getPosition().clone();
    this._movementDirection = new pc.Vec3();
    
    this.on('state', this._onStateChanged, this);
};


SixDofController.prototype.postInitialize = function() {
    var entities = this.entity.findByTag('controller-sphere');
    for (var i = 0; i < entities.length; ++i) {
        var entity = entities[i];
        var shapeScript = entity.script ? entity.script.shape : null;
        if (shapeScript && shapeScript.type == 'sphere') {
            this._collisionSpheres.push(shapeScript._shape);
        }
    }
};


SixDofController.grabPoint = new pc.Vec3();
SixDofController.hitPoint = new pc.Vec3();
SixDofController.diffPosition = new pc.Vec3();
SixDofController.RAY_MODEL_SCALE_LERP_FACTOR = 12;

// update code called every frame
SixDofController.prototype.postUpdate = function(dt) {    
    this._movementDirection.sub2(this.entity.getPosition(), this._prevPosition);
    this._movementDirection.normalize();   
    
    this._ray.origin.copy(this.entity.getPosition());
    this._ray.direction.copy(this.entity.forward);
        
    var validLanding = false;
    var hitEntity = null;
    var hitPoint = SixDofController.hitPoint;
    var diffPosition = SixDofController.diffPosition;
    var dot = 0;
    
    // Check if the grab point is in something or if something is just in front of it so we could grab it
    var grabPoint = SixDofController.grabPoint;
    grabPoint.copy(this.entity.forward).scale(0).add(this.entity.getPosition());
    
    if (this._state == SixDofController.STATE_IDLE) {
        hitEntity = this.app.shapeWorld.containsPoint(grabPoint, this._grabRaycastFilter.bind(this));
        if (!hitEntity) {
            hitEntity = this.app.shapeWorld.raycast(this._ray, this._grabRaycastFilter.bind(this), hitPoint, this.maxGrabDistance);
        }
    } else if (this._state == SixDofController.STATE_HOLDING) {
        grabPoint.copy(this._heldEntity.getPosition());
        hitEntity = this.app.shapeWorld.containsPoint(grabPoint, this._holdingRaycastFilter.bind(this));
        if (!hitEntity) {
            // Change the ray origin to be from the held object
            this._ray.origin.copy(grabPoint);
            hitEntity = this.app.shapeWorld.raycast(this._ray, this._holdingRaycastFilter.bind(this), hitPoint, this.maxGrabDistance);
        }
    } else if (this._state == SixDofController.STATE_TELEPORTING) {
        hitEntity = this.app.shapeWorld.raycast(this._ray, null, hitPoint);
        if (hitEntity) {
            if (hitEntity.tags.has('floor')) {
                // Make sure that are pointing down to the floor (y-axis) so we can't teleport from underneath
                dot = hitEntity.up.dot(this._ray.direction);
                if (dot <= 0) {
                    this._landingPosition.copy(hitPoint);
                    validLanding = true;
                }              
            } else {
                hitEntity = null;
            }
        }        
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
        var targetScale = 1;
        if (this._state == SixDofController.STATE_IDLE) {
            targetScale = 0.001;
        } 
        rayModelScale.z = pc.math.lerp(rayModelScale.z, targetScale, Math.min(SixDofController.RAY_MODEL_SCALE_LERP_FACTOR * dt, 1));
        this._rayModel.setLocalScale(rayModelScale);
    }
    
    if (this._reticle.enabled) {
        this._reticle.enabled = false;
    }  
    
    this._checkPhysicalInteractions(dt);
    
    this._prevPosition.copy(this.entity.getPosition());
};


SixDofController.prototype._checkPhysicalInteractions = function (dt) {
    // Check the controller against other physical objects that can be interacted with (e.g. buttons)
    var physicalEntity = null;
    
    for (var i = 0; i < this._collisionSpheres.length; ++i) {
        var sphere = this._collisionSpheres[i];
        physicalEntity = this.app.shapeWorld.intersectsSphere(sphere, this._physicalInteractionRaycastFilter.bind(this));
        if (physicalEntity) {
            physicalEntity.fire('object:interact', this);
            break;
        }
    }
};


SixDofController.filterDiffPosition = new pc.Vec3();
SixDofController.GRAB_BROAD_RANGE_SQ = 5 * 5;

SixDofController.prototype._grabRaycastFilter = function (entity) {
    if (entity == this._heldEntity) {
        return false;
    }
    
    var diff = SixDofController.filterDiffPosition;

    // If we can grab the entity, then check that it is within range first
    if (entity.script && entity.script.grabbable) {
        diff.copy(entity.getPosition()).sub(this.entity.getPosition());
        if (diff.lengthSq() < SixDofController.GRAB_BROAD_RANGE_SQ) {
            return true;
        }
    }
    
    return false;
};


SixDofController.prototype._holdingRaycastFilter = function (entity) {
    if (entity == this._heldEntity) {
        return false;
    } 
    
    if (entity.script && entity.script.interactsWith) {
        return true;
    }
    
    return false;
};


SixDofController.prototype._physicalInteractionRaycastFilter = function (entity) {
    if (entity == this._heldEntity) {
        return false;
    } 
    
    if (entity.script && (entity.script.button || entity.script.controllerTrigger)) {
        return true;
    }
    
    return false;
};


SixDofController.offsetPosition = new pc.Vec3();

SixDofController.prototype._teleport = function() {
    if (this._validLanding) {
        this._lookCamera.teleport(this._landingPosition);
    }
};


SixDofController.prototype._onStateChanged = function(enabled) {
    if (this._locatorEntity) {
        this._locatorEntity.enabled = enabled;
    }
};

