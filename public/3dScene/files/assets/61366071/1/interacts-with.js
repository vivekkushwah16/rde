var InteractsWith = pc.createScript('interactsWith');

InteractsWith.attributes.add('presetEntity', {
    type: 'entity', 
    title: 'Preset Entity', 
    description: 'Entity to be attached to this on start'
});

InteractsWith.attributes.add('compatibleTag', {
    type: 'string', 
    default: '', 
    title: 'Compatible Tag', 
    description: 'Tag that this object can interact with'
});

InteractsWith.STATE_IDLE = 'IDLE';
InteractsWith.STATE_IN_USE = 'IN_USE';


InteractsWith.prototype.attach = function (entity) {
    this._heldEntity = entity;
    this.entity.fire('interactswith:attachobject', this);
    this._state = InteractsWith.STATE_IN_USE;
};


InteractsWith.prototype.detach = function (entity) {
    this.entity.fire('interactswith:detachobject', this);
    this._heldEntity = null;
    this._state = InteractsWith.STATE_IDLE;
};


InteractsWith.prototype.getAttachPosition = function () {
    return this._attachPointEntity.getPosition();
};


InteractsWith.prototype.getAttachRotation = function () {
    return this._attachPointEntity.getRotation();
};


InteractsWith.prototype.updateAttachment = function (entity, rotationOffset) {
    entity.setPosition(this._attachPointEntity.getPosition());
    entity.setRotation(this._attachPointEntity.getRotation());    
};


InteractsWith.prototype.getHeldEntity = function () {
    return this._heldEntity;    
};


// initialize code called once per entity
InteractsWith.prototype.initialize = function() {
    this._heldEntity = null;
    this._state = InteractsWith.STATE_IDLE;
    
    this.entity.on('object:onhover', this._onHover, this);
    this.entity.on('object:offhover', this._offHover, this);
    
    this.entity.on('object:attemptuse', this._onAttemptUse, this);
    
    this._attachPointEntity = this.entity.findByName('Attach Point');
};


InteractsWith.prototype.postInitialize = function() {
    if (this.presetEntity) {
        if (this._isCompatible(this.presetEntity)) {
            this.presetEntity.fire('object:hold', this);
        }
    }    
};


// update code called every frame
InteractsWith.prototype.update = function(dt) {
    switch(this._state) {
        case InteractsWith.STATE_IDLE: 
            this._updateStateIdle(dt);
            break;
            
        case InteractsWith.STATE_IN_USE:
            this._updateStateInUse(dt);
            break;
    }
};


InteractsWith.prototype._updateStateIdle = function (dt) {
    
};


InteractsWith.prototype._updateStateInUse = function (dt) {
    
};


InteractsWith.prototype._onHover = function (controller) {
    if (this._isIdle()) {
        var otherEntity = controller.getHeldEntity();
        if (otherEntity) {
            if (this._isCompatible(otherEntity)) {
                this._addHighlight(this.entity, true);
            } else {
                this._addHighlight(this.entity, false);
            }
        } else {
            this._removeHighlight(this.entity);           
        }
    }
};


InteractsWith.prototype._offHover = function (controller) {
    if (this._isIdle()) {
        this._removeHighlight(this.entity);
    }
};


InteractsWith.prototype._onAttemptUse = function (controller) {
    if (this._isIdle()) {
        var otherEntity = controller.getHeldEntity();
        if (this._isCompatible(otherEntity)) {
            otherEntity.fire('object:hold', this);
        } else {
            // We have responsibility for the held entity in this case
            otherEntity.fire('object:release', controller);
        }
        this._removeHighlight(this.entity);
    }
};


InteractsWith.prototype._isIdle = function () {
    return this._state == InteractsWith.STATE_IDLE;    
};


InteractsWith.prototype._isCompatible = function (entity) {
    if (entity && entity.tags.has(this.compatibleTag)) {
        return true;
    }
    
     return false;
};


InteractsWith.prototype._addHighlight = function (entity, compatible) {
    if (compatible) {
        pc.util.setEntityEmissive(entity, pc.util.HIGHLIGHT_ENTITY_GREEN); 
    } else {
        pc.util.setEntityEmissive(entity, pc.util.HIGHLIGHT_ENTITY_RED);
    }
    
    var children = entity.children;
    for (var i = 0; i < children.length; ++i) {
        this._addHighlight(children[i], compatible);
    }
};


InteractsWith.prototype._removeHighlight = function (entity) {
    pc.util.setEntityEmissive(entity, pc.util.HIGHLIGHT_ENTITY_DEFAULT);    
    
    var children = entity.children;
    for (var i = 0; i < children.length; ++i) {
        this._removeHighlight(children[i]);
    }
};