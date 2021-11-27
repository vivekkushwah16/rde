var StatueButton = pc.createScript('statueButton');

StatueButton.attributes.add('startPosition', {type: 'vec3', default: [0, 0, 0], title: 'Start Position'});
StatueButton.attributes.add('pressedPosition', {type: 'vec3', default: [0, 0, 0], title: 'Pressed Position'});
StatueButton.attributes.add('statueEntity', {type: 'entity', title: 'Statue Entity'});

// initialize code called once per entity
StatueButton.prototype.initialize = function() {
    this.entity.on('button:activated', this._onButtonActivated, this);
    this.entity.on('button:reseted', this._onButtonReseted, this);
    
    this._model = this.entity.findByName('Model');
    this._activated = false;
};


StatueButton.LERP_FACTOR = 18;

// update code called every frame
StatueButton.prototype.update = function(dt) {
    var position = this._model.getLocalPosition();
    if (this._activated) {
        position.lerp(position, this.pressedPosition, Math.min(StatueButton.LERP_FACTOR * dt, 1));
    } else {
        position.lerp(position, this.startPosition, Math.min(StatueButton.LERP_FACTOR * dt, 1));
    }
    
    this._model.setLocalPosition(position);
};


StatueButton.prototype._onButtonActivated = function () {
    this.statueEntity.fire('statue:activate');    
    this._activated = true;
};


StatueButton.prototype._onButtonReseted = function () {
    this._activated = false;
};