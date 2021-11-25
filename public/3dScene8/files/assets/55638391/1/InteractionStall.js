var InteractionStall = pc.createScript('interactionStall');


InteractionStall.attributes.add('coolDownTime', {type: 'number', default: 1, title: 'Cool Down Time (secs)'});

InteractionStall.attributes.add('canvas3d', {type: 'entity'});
InteractionStall.attributes.add('videoUrl', {type: 'string'});
InteractionStall.attributes.add('pdfName', {type: 'string'});
InteractionStall.attributes.add('pdfUrl', {type: 'string'});

InteractionStall.STATE_IDLE = 'IDLE';
InteractionStall.STATE_ACTIVATED = 'ACTIVATED';

var canWork = true;

// initialize code called once per entity
InteractionStall.prototype.initialize = function() {
    var self = this;
     this.entity.on('object:interact', this._onInteract, this);
    this.entity.on('object:onhover', this._onHover, this);
    this.entity.on('object:offhover', this._offHover, this);
    
    this._state = InteractionStall.STATE_IDLE;
    
    this._secsSinceActivation = 0;
    
    this.app.on('resume', function(){
     //   canWork = true;
     console.log("Came back");
        self.cooldown();
    });
};

// update code called every frame
InteractionStall.prototype.update = function(dt) {
      switch (this._state) {
        case InteractionStall.STATE_IDLE:
            break;
            
        case InteractionStall.STATE_ACTIVATED:
            this._secsSinceActivation += dt;
            if (this._secsSinceActivation >= this.coolDownTime) {
                
                this.entity.fire('button:reseted');
                console.log("Reset Done");
                this.canvas3d.enabled = false;
                canWork = true;
                this._state = InteractionStall.STATE_IDLE;
            }
            break;
    }
    
    
};


InteractionStall.controllerMovementDirection = new pc.Vec2();
InteractionStall.DOT_THRESHOLD = -0.3;

InteractionStall.prototype._onInteract = function (controller) {
    if(!canWork){ return; }
    
    if (this._isIdle()) {
        var controllerMovementDirection = InteractionStall.controllerMovementDirection.copy(this.entity.up);
        controllerMovementDirection.scale(-1);
        
        if (controller.getMovementDirection) {
            controllerMovementDirection.copy(controller.getMovementDirection());
        }
          pc.util.setEntityEmissive(this.entity, pc.util.HIGHLIGHT_ENTITY_DEFAULT);  
        this.entity.fire('button:activated');   
            this._startvideo();
    }
};


InteractionStall.prototype._onHover = function () {
    if (this._isIdle()) {
          pc.util.setEntityEmissive(this.entity, pc.util.HIGHLIGHT_ENTITY_GREEN); 
        this.canvas3d.enabled = true;
    }
};


InteractionStall.prototype._offHover = function () {
    if (this._isIdle()) {
        pc.util.setEntityEmissive(this.entity, pc.util.HIGHLIGHT_ENTITY_DEFAULT);  
        this.canvas3d.enabled = false;
    }
};


InteractionStall.prototype._startvideo = function () {
    console.log("PlayVideo Called " + canWork);
    this.canvas3d.enabled = false;
    canWork = false;
    this.app.fire('playVideo', this.videoUrl, this.pdfUrl, this,pdfName);
    this.app.fire('lockCamera');
    //turn off the movement of camera--
    ////turn off gaze controller
};

InteractionStall.prototype._isIdle = function () {
    return this._state == Button.STATE_IDLE;    
};


InteractionStall.prototype.cooldown = function () {
       this._secsSinceActivation = 0;
     this._state = InteractionStall.STATE_ACTIVATED;
};

