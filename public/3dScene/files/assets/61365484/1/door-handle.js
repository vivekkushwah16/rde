var DoorHandle = pc.createScript('doorHandle');

DoorHandle.attributes.add('side', { type: 'string', enum: [{ 'left': 'left' }, { 'right': 'right' }], default: 'left', title: 'Side'});
DoorHandle.attributes.add('numberShakes', {type: 'number', default: 1, title: 'Number of Shakes'});
DoorHandle.attributes.add('animLength', {type: 'number', default: 1, title: 'Animation Length (secs)'});
DoorHandle.attributes.add('rotateRange', {type: 'number', default: 0, title: '', description: 'Rotate Range (degress)'});

// initialize code called once per entity
DoorHandle.prototype.initialize = function() {
    pc.util.initSoundSlotAssets(this.app, this.entity);
    
    this.secsSinceActivation = 0;
    
    this.entity.on('controllertrigger:activated', this._onActivated, this);
};


DoorHandle.SIN_SCALE = 1.3;

// update code called every frame
DoorHandle.prototype.update = function(dt) {
    var t = Math.min(this.secsSinceActivation/this.animLength, 1);
    var sin = pc.math.clamp(Math.sin(t * (Math.PI * this.numberShakes)) * DoorHandle.SIN_SCALE, -1, 1);
    var angle = sin * this.rotateRange;
    
    if (this.side == 'right') {
        angle *= -1;
    }
    
    this.entity.setLocalEulerAngles(0, 0, angle);
    
    this.secsSinceActivation += dt;
};


DoorHandle.prototype._onActivated = function () {
    this.secsSinceActivation = 0;
    pc.util.playSoundSlot(this.entity, 'locked-room-doors');
};