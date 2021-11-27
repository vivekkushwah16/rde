var GazeController = pc.createScript('gazeController');

GazeController.attributes.add('cameraEntity', {type: 'entity', title: 'Camera Entity'});
GazeController.attributes.add('locatorEntity', {type: 'entity', title: 'Locator Entity'});
GazeController.attributes.add('maxGrabDistance', {type: 'number', default: 1, title: 'Max Grab Distance'});

GazeController.attributes.add('translateTeleport', {type: 'boolean', title: 'EnableTranslateTeleport'});
GazeController.attributes.add('moveToEntity', {type: 'entity', title: 'Entity'});

Object.defineProperty(GazeController.prototype, "pitch", {
    get: function() {
        return this._lookCamera.pitch;
    },
    
    set: function(value) {
        this._lookCamera.pitch = value;
    }
});


Object.defineProperty(GazeController.prototype, "yaw", {
    get: function() {
        return this._lookCamera.yaw;
    },
    
    set: function(value) {
        this._lookCamera.yaw = value;
    }
});

var useGaze = true;

GazeController.prototype.getRotationDiff = function () {
    return this._lookCamera.getRotationDiff();
};


GazeController.prototype.onButtonDown = function () {
    this._movementSinceButtonDown.set(0, 0);
    this._secsSinceButtonDown = 0;
    this._targetedEntityButtonDown = this._targetedEntity;  
    this._buttonDownEventFired = false;
};

GazeController.TAP_THRESHOLD = 0.25;

GazeController.prototype.onButtonUp = function () {
    if (this.entity.enabled) {
        if (!this._buttonDownEventFired && this._secsSinceButtonDown < GazeController.TAP_THRESHOLD) {
            this._onButtonTap();
        } else {
            this._onButtonUp();
        }
    }
};


GazeController.prototype.getAttachPosition = function () {
    return this._grabAnchor.getPosition();
};


GazeController.prototype.getAttachRotation = function () {
    return this._grabAnchor.getRotation();
};


GazeController.updatedRotation = new pc.Quat();

GazeController.prototype.updateAttachment = function (entity, rotationOffset) {
    var updateRotation = GazeController.updatedRotation;
    entity.setPosition(this.getAttachPosition());
    updateRotation.mul2(this.getAttachRotation(), rotationOffset);
    entity.setRotation(updateRotation);    
};


GazeController.prototype.attach = function (entity) {
    this._heldEntity = entity;
    this._state = GazeController.STATE_HOLDING;
};


GazeController.prototype.detach = function (entity) {
    this._heldEntity = null;
    this._state = GazeController.STATE_IDLE;
};


GazeController.prototype.getHeldEntity = function () {
    return this._heldEntity;    
};

GazeController.STATE_IDLE = 'IDLE';
GazeController.STATE_HOLDING = 'HOLDING';

// initialize code called once per entity
GazeController.prototype.initialize = function() {
    this._ray = new pc.Ray();
    this._landingPosition = new pc.Vec3(0, -1, 0);        
    this._validLanding = false;    
    this._lookCamera = this.cameraEntity.script.lookCamera;    
    this._targetedEntity = null;
    
    this._state = GazeController.STATE_IDLE;
    this._heldEntity = null;
    
    this.app.on('vrinput:enabled', this._onVrInputEnabled, this);
    this.app.on('vrinput:disabled', this._onVrInputDisabled, this);
    
    this._grabAnchor = this.entity.findByName('Grab Anchor');
    this._reticle = this.entity.findByName('Reticule');
    
    this._movementSinceButtonDown = new pc.Vec2();
    this._secsSinceButtonDown = 0;
    this._targetedEntityButtonDown = null;
    this._buttonDownEventFired = false;
    this.direction = new pc.Vec3();
    useGaze = true;
    
    this.app.on('lockCamera', function(){
       useGaze = false; 
       // console.log("Gaze re "+ useGaze);
    });
    
    this.app.on('unlockCamera', function(){
  //      console.log("ulockCamera");
        useGaze = true;
    });
    
    this.app.on('stopGaze', function(){
       useGaze = false; 
    });
    
    this.app.on('startGaze', function(){
        useGaze = true;
    });
    
    
};


GazeController.hitPoint = new pc.Vec3();
GazeController.diffPosition = new pc.Vec3();

GazeController.DEBUG_PROJECTING_RETICLE = true;

// update code called every frame
/*
 * GazeController.prototype.postUpdate = function(dt) {
    
    var cameraPosition = this.cameraEntity.getPosition();
    this.entity.setPosition(cameraPosition);
    this.entity.setRotation(this.cameraEntity.getRotation());
    
    
    this._ray.origin.copy(cameraPosition);
    
    
    
    
    this.direction.sub2(this.moveToEntity.getPosition(),this.cameraEntity.getPosition());
    this.direction.normalize();
    this._ray.direction.copy(this.direction);
    
    var hitPoint = GazeController.hitPoint.set(0,-100,0);
    var diffPosition = GazeController.diffPosition;
        
    var validLanding = false;
    
    var hitEntity = null;
    if (this._state == GazeController.STATE_IDLE) {
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
    } else if (this._state == GazeController.STATE_HOLDING) {
        hitEntity = this.app.shapeWorld.raycast(this._ray, this._holdingRaycstFilter.bind(this), hitPoint);
    }
    
    if (validLanding) {
        this.locatorEntity.setPosition(this._landingPosition.x, this._landingPosition.y + 0.01, this._landingPosition.z);
        this.locatorEntity.setRotation(hitEntity.getRotation());
        
        if (!this.locatorEntity.enabled) {
            this.locatorEntity.enabled = true;
        }
        
        if (this._reticle.enabled) {
            this._reticle.enabled = false;
        }
    } else {
        if (this.locatorEntity.enabled) {
            this.locatorEntity.enabled = false;
        }
        
        if (this._state == GazeController.STATE_IDLE) {
            this._reticle.setPosition(hitPoint);
            if (!this._reticle.enabled) {
                this._reticle.enabled = true;
            }
        } else {
            if (this._reticle.enabled) {
                this._reticle.enabled = false;
            }            
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
    
    this._updateButtonLogic(dt);
};*/


GazeController.dragThreshold = 10;

GazeController.prototype._updateButtonLogic = function (dt) {
    var rotationDiff = this._lookCamera.getRotationDiff();
    this._movementSinceButtonDown.x += rotationDiff.x;
    this._movementSinceButtonDown.y += rotationDiff.y;
    
    if (!this._buttonDownEventFired) {
        if (this._secsSinceButtonDown > GazeController.TAP_THRESHOLD || this._movementSinceButtonDown.lengthSq() >= GazeController.dragThreshold * GazeController.dragThreshold) {
            this._onButtonDown();
        }
    }
    
    this._secsSinceButtonDown += dt;
};


GazeController.prototype._onButtonDown = function () {
    if (this._state == GazeController.STATE_IDLE) {
        if (this._targetedEntityButtonDown) {
            this._targetedEntityButtonDown.fire('object:hold', this);
        }
    }
    
    this._buttonDownEventFired = true;
};


GazeController.prototype._onButtonUp = function () {
    if (this._state == GazeController.STATE_HOLDING) {
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


GazeController.prototype._onButtonTap = function () {
    if (this._state == GazeController.STATE_IDLE) {
        if (this._validLanding) {
            this._teleport();
        } else {
            if (this._targetedEntity) {
                this._targetedEntity.fire('object:hold', this);
                this._targetedEntity.fire('object:interact', this);
            }
        }
    } else {
        this._onButtonUp();
    }
    
    this._buttonDownEventFired = true;
};


GazeController.prototype._idleRaycastFilter = function (entity) {
    if (entity == this._heldEntity) {
        return false;
    }
   
    return true;
};


GazeController.prototype._holdingRaycstFilter = function (entity) {
    if (entity == this._heldEntity) {
        return false;
    } 
    
    if (entity.script && entity.script.interactsWith) {
        return true;
    }
    
    return false;
};


GazeController.offsetPosition = new pc.Vec3();

GazeController.prototype._teleport = function() {
    if (this._validLanding) {
        this._lookCamera.teleport(this._landingPosition);
    }
};


GazeController.prototype._onVrInputEnabled = function () {
    this.entity.enabled = false;
    this.locatorEntity.enabled = false;
};


GazeController.prototype._onVrInputDisabled = function () { 
    this.entity.enabled = true;
    this.locatorEntity.enabled = true;
};



GazeController.prototype.onMouseMove = function (screenPosition) { 
        
      var from = this.cameraEntity.getPosition();
    var hitPosition = PointAndClick.hitPosition;
    // The pc.Vec3 to raycast to (the click position projected onto the camera's far clip plane)
    var to = this.cameraEntity.camera.screenToWorld(screenPosition.x, screenPosition.y, this.cameraEntity.camera.farClip);

    // Raycast between the two points and return the closest hit result
   // var result = this.app.systems.rigidbody.raycastFirst(from, to);
  //  var ray = new pc.Ray(to, to);
    
 //   var cameraPosition = this.cameraEntity.getPosition();
//    this.entity.setPosition(cameraPosition);
//    this.entity.setRotation(this.cameraEntity.getRotation());
    
    
    this._ray.origin.copy(to);
    
    this._ray.direction.copy(this.cameraEntity.forward);
    
    var hitPoint = GazeController.hitPoint.set(0,-100,0);
    var diffPosition = GazeController.diffPosition;
        
    var validLanding = false;
    
    var hitEntity = null;
    if (this._state == GazeController.STATE_IDLE) {
        
        hitEntity = this.app.shapeWorld.raycast(this._ray, this._idleRaycastFilter.bind(this), hitPoint);
        console.log(hitEntity);
        
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
    } else if (this._state == GazeController.STATE_HOLDING) {
       // hitEntity = this.app.shapeWorld.raycast(this._ray, this._holdingRaycstFilter.bind(this), hitPoint);
    }
    
    if (validLanding) {
        this.locatorEntity.setPosition(this._landingPosition.x, this._landingPosition.y + 0.01, this._landingPosition.z);
        this.locatorEntity.setRotation(hitEntity.getRotation());
        
        if (!this.locatorEntity.enabled) {
            this.locatorEntity.enabled = true;
        }
        
        if (this._reticle.enabled) {
            this._reticle.enabled = false;
        }
    } else {
        if (this.locatorEntity.enabled) {
            this.locatorEntity.enabled = false;
        }
        
        if (this._state == GazeController.STATE_IDLE) {
            this._reticle.setPosition(hitPoint);
            if (!this._reticle.enabled) {
                this._reticle.enabled = true;
            }
        } else {
            if (this._reticle.enabled) {
                this._reticle.enabled = false;
            }            
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
    
  //  this._updateButtonLogic(dt);
};


