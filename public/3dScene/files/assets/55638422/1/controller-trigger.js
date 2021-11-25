var ControllerTrigger = pc.createScript('controllerTrigger');

ControllerTrigger.attributes.add('coolDownTime', {type: 'number', default: 1, title: 'Cool Down Time (secs)'});

ControllerTrigger.STATE_IDLE = 'IDLE';
ControllerTrigger.STATE_ACTIVATED = 'ACTIVATED';

// initialize code called once per entity
ControllerTrigger.prototype.initialize = function() {
    this.entity.on('object:interact', this._onInteract, this);
    this.entity.on('object:onhover', this._onHover, this);
    this.entity.on('object:offhover', this._offHover, this);
    
    this._state = ControllerTrigger.STATE_IDLE;
    
    this._secsSinceActivation = 0;
};


// update code called every frame
ControllerTrigger.prototype.update = function(dt) {
    switch (this._state) {
        case ControllerTrigger.STATE_IDLE:
            break;
            
        case ControllerTrigger.STATE_ACTIVATED:
            this._secsSinceActivation += dt;
            if (this._secsSinceActivation >= this.coolDownTime) {
                this.entity.fire('controllertrigger:reseted');
                this._state = ControllerTrigger.STATE_IDLE;
            }
            break;
    }
};


ControllerTrigger.controllerMovementDirection = new pc.Vec2();
ControllerTrigger.DOT_THRESHOLD = -0.3;

ControllerTrigger.prototype._onInteract = function (controller) {
    if (this._isIdle()) {     
        this.entity.fire('controllertrigger:activated');
        this._secsSinceActivation = 0;
        this._state = ControllerTrigger.STATE_ACTIVATED;

        this._removeHighlight(this.entity);
    }
};


ControllerTrigger.prototype._onHover = function () {
    if (this._isIdle()) {
        this._addHighlight(this.entity);
    }
};


ControllerTrigger.prototype._offHover = function () {
    if (this._isIdle()) {
        this._removeHighlight(this.entity);
    }
};


ControllerTrigger.prototype._isIdle = function () {
    return this._state == ControllerTrigger.STATE_IDLE;    
};


ControllerTrigger.prototype._addHighlight = function (entity) {
    pc.util.setEntityEmissive(entity, pc.util.HIGHLIGHT_ENTITY_GREEN); 
    
    var children = entity.children;
    for (var i = 0; i < children.length; ++i) {
        this._addHighlight(children[i]);
    }
};


ControllerTrigger.prototype._removeHighlight = function (entity) {
    pc.util.setEntityEmissive(entity, pc.util.HIGHLIGHT_ENTITY_DEFAULT);    
    
    var children = entity.children;
    for (var i = 0; i < children.length; ++i) {
        this._removeHighlight(children[i]);
    }
};