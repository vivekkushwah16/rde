var VrController = pc.createScript('vrController');

VrController.attributes.add('handType', {
    type: 'string', 
    enum: [{ 'Left': 'left' }, { 'Right': 'right' }, { 'Any': 'any' }, { 'Neither': '' }],
    default: 'any', 
    title: 'Hand Type',
    description: 'Any is either hand and Neither is when the pad has no left/right identity'
});

VrController.attributes.add('priority', {
    type: 'number', 
    default: 0, 
    title: 'Priority', 
    description: 'The nth hand of this type that is connected. E.g. A priority of 2 with a hand type of Left would be 3rd left hand that is connected to the system'
});


VrController.prototype.initialize = function () {
    this.pad = null;
};


VrController.prototype.postInitialize = function() {
    this.entity.on('vrgamepad:pad:connected', this._onConnected, this);
    this.entity.on('vrgamepad:pad:disconnected', this._onDisconnected, this);
    
    this.on('attr:handType', function (value, prev) {
        this.app.fire('vrgamepad:controller:deregister', this.entity);
        this.app.fire('vrgamepad:controller:register', this.entity, this.handType, this.priority);
    });
    
    this.on('attr:priority', function (value, prev) {
        this.app.fire('vrgamepad:controller:deregister', this.entity);
        this.app.fire('vrgamepad:controller:register', this.entity, this.handType, this.priority);
    });
    
    this.app.fire('vrgamepad:controller:register', this.entity, this.handType, this.priority);
};


VrController.prototype._onConnected = function (pad) {
    this.pad = pad;
    this.entity.enabled = true;  
};


VrController.prototype._onDisconnected = function () {
    this.pad = null;
    this.entity.enabled = false;    
};