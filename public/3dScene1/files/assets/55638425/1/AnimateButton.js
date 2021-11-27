var AnimateButton = pc.createScript('animateButton');


AnimateButton.attributes.add('startPosition', {type: 'vec3', default: [0, 0, 0], title: 'Start Position'});
AnimateButton.attributes.add('pressedPosition', {type: 'vec3', default: [0, 0, 0], title: 'Pressed Position'});
AnimateButton.attributes.add('actionEntity', {type: 'entity', title: 'Action Entity'});
AnimateButton.attributes.add('eventName',{type:'string'});
AnimateButton.attributes.add('networkUpdate',{type:'boolean'});

AnimateButton.LERP_FACTOR = 30;
// initialize code called once per entity
AnimateButton.prototype.initialize = function() {
    this.entity.on('button:activated', this._onButtonActivated, this);
    this.entity.on('button:reseted', this._onButtonReseted, this);
    
    this._model = this.entity.findByName('Model');
    this._activated = false;    
};


AnimateButton.prototype.update = function(dt) {
      var position = this._model.getLocalPosition();
    if (this._activated) {
        position.lerp(position, this.pressedPosition, Math.min(AnimateButton.LERP_FACTOR * dt, 1));
    } else {
        position.lerp(position, this.startPosition, Math.min(AnimateButton.LERP_FACTOR * dt, 1));
    }
    
    this._model.setLocalPosition(position);
};


AnimateButton.prototype._onButtonActivated = function () {
    console.log("Button Activated");
    this.actionEntity.fire(this.eventName);  
    
    if(this.networkUpdate){
    console.log(this.entity.name+" for "+ this.eventName);
     this.app.fire('buttonPushed', this.entity.name, this.eventName);
    }
    
    this._activated = true;
};


AnimateButton.prototype._onButtonReseted = function () {
    this._activated = false;
};