var Button = pc.createScript('button');

Button.attributes.add('coolDownTime', {type: 'number', default: 1, title: 'Cool Down Time (secs)'});

Button.STATE_IDLE = 'IDLE';
Button.STATE_ACTIVATED = 'ACTIVATED';

// initialize code called once per entity
Button.prototype.initialize = function() {
    this.entity.on('object:interact', this._onInteract, this);
    this.entity.on('object:onhover', this._onHover, this);
    this.entity.on('object:offhover', this._offHover, this);
    
    this._state = Button.STATE_IDLE;
    
    this._secsSinceActivation = 0;
};


// update code called every frame
Button.prototype.update = function(dt) {
    switch (this._state) {
        case Button.STATE_IDLE:
            break;
            
        case Button.STATE_ACTIVATED:
            this._secsSinceActivation += dt;
            if (this._secsSinceActivation >= this.coolDownTime) {
                this.entity.fire('button:reseted');
                this._state = Button.STATE_IDLE;
            }
            break;
    }
};


Button.controllerMovementDirection = new pc.Vec2();
Button.DOT_THRESHOLD = -0.3;

Button.prototype._onInteract = function (controller) {
    if (this._isIdle()) {
        console.log("Button Interaction -1");
        // Check direction of movement the button should only work in 
        // a direction range to the button
 
        // Add fallback for controllers that don't have physical presence in the world
        var controllerMovementDirection = Button.controllerMovementDirection.copy(this.entity.up);
        controllerMovementDirection.scale(-1);
        if (controller.getMovementDirection) {
            controllerMovementDirection.copy(controller.getMovementDirection());
        }
        
        
        this.entity.fire('button:activated');
            this._secsSinceActivation = 0;
            this._state = Button.STATE_ACTIVATED;

            this._removeHighlight(this.entity);
        /*
        var dot = controllerMovementDirection.dot(this.entity.up);
        if (dot <= Button.DOT_THRESHOLD) {     
        console.log("Button Interaction -2");
            this.entity.fire('button:activated');
            this._secsSinceActivation = 0;
            this._state = Button.STATE_ACTIVATED;

            this._removeHighlight(this.entity);
        }
        */
        console.log("Button Interaction -3");
    }
};


Button.prototype._onHover = function () {
    if (this._isIdle()) {
        console.log("OnHover");
   //     this._addHighlight(this.entity);
    }
};


Button.prototype._offHover = function () {
    if (this._isIdle()) {
        console.log("OffHover");
    //    this._removeHighlight(this.entity);
    }
};


Button.prototype._isIdle = function () {
    return this._state == Button.STATE_IDLE;    
};


Button.prototype._addHighlight = function (entity) {
    pc.util.setEntityEmissive(entity, pc.util.HIGHLIGHT_ENTITY_GREEN); 
    
    var children = entity.children;
    for (var i = 0; i < children.length; ++i) {
        this._addHighlight(children[i]);
    }
};


Button.prototype._removeHighlight = function (entity) {
    pc.util.setEntityEmissive(entity, pc.util.HIGHLIGHT_ENTITY_DEFAULT);    
    
    var children = entity.children;
    for (var i = 0; i < children.length; ++i) {
        this._removeHighlight(children[i]);
    }
};