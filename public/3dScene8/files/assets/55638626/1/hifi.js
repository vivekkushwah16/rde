var Hifi = pc.createScript('hifi');

Hifi.attributes.add('rotateSpeed', {type: 'number', default: 10, title: 'Rotate Speed'});
Hifi.attributes.add('leftSpeakerEntity', {type: 'entity', title: 'Left Speaker Entity'});
Hifi.attributes.add('rightSpeakerEntity', {type: 'entity', title: 'Right Speaker Entity'});
Hifi.attributes.add('idleNeedleRotation', {type: 'number', default: 0, title: 'Idle Needle Rotation'});
Hifi.attributes.add('startNeedleRotation', {type: 'number', default: 0, title: 'Start Needle Rotation'});
Hifi.attributes.add('endNeedleRotation', {type: 'number', default: 0, title: 'End Needle Rotation'});

// initialize code called once per entity
Hifi.prototype.initialize = function() {    
    pc.util.initSoundSlotAssets(this.app, this.entity);
        
    this.entity.on('interactswith:attachobject', this._onAttachObject, this);
    this.entity.on('interactswith:detachobject', this._onDetachObject, this);
        
    this._attachPointEntity = this.entity.findByName('Attach Point');
    this._interactsWith = this.entity.script.interactsWith;
    
    this._currentNeedleRotation = this.idleNeedleRotation;
    this._rangeNeedleRotation = this.endNeedleRotation - this.startNeedleRotation;
    
    this._soundSlot = null;
    
    this._speakerCones = [];    
    
    var i = 0;
    var child = null;
    var children = this.leftSpeakerEntity.children;
    for (i = 0; i < children.length; ++i) {
        childScript = children[i].script;
        if (childScript && childScript.speakerCone) {
            this._speakerCones.push(childScript.speakerCone);
        }
    }
    
    children = this.rightSpeakerEntity.children;
    for (i = 0; i < children.length; ++i) {
        childScript = children[i].script;
        if (childScript && childScript.speakerCone) {
            this._speakerCones.push(childScript.speakerCone);
        }
    }
    
    this._needleModel = this.entity.findByName('Needle Model');
};


Hifi.VOLUME_CAP = 55;
Hifi.NEEDLE_LERP_FACTOR = 12;
Hifi.conePosition = new pc.Vec3();

// update code called every frame
Hifi.prototype.update = function(dt) {
    this._attachPointEntity.rotateLocal(0, this.rotateSpeed * dt, 0);
    
    var targetNeedleRotation = this.idleNeedleRotation;
    
    if (this._soundSlot !== null) {
        var i = 0; 
        
        var analyser = this.entity.script.audioAnalyser;
        var data = analyser.freqData;
        var totalVolume = 0;
        
        for (i = 0; i < data.length; ++i) {
            var value = (data[i] - analyser.freqOffset) * analyser.freqScale;
            totalVolume += value > 0 ? value : 0;
        }
        
        var v = Math.min(totalVolume, Hifi.VOLUME_CAP) / Hifi.VOLUME_CAP; 
        for (i = 0; i < this._speakerCones.length; ++i) {
            this._speakerCones[i].applyVolume(v);
        }
        
        // Move the needle head
        if (this._soundSlot.instances && this._soundSlot.instances[0]) {
            // There should only be one slot playing so just grab the first sound slot
            var currentTime = this._soundSlot.instances[0].currentTime;
            var duration = this._soundSlot.instances[0].duration;
            
            if (duration > 0) {
                var t = currentTime / duration;            
                targetNeedleRotation = (this._rangeNeedleRotation * t) + this.startNeedleRotation;
            }
        }
    }
    
    this._currentNeedleRotation = pc.math.lerp(this._currentNeedleRotation, targetNeedleRotation, Math.min(Hifi.NEEDLE_LERP_FACTOR * dt, 1));
    this._needleModel.setLocalEulerAngles(0, this._currentNeedleRotation, 0);
};


Hifi.prototype._onAttachObject = function (interactswith) {
    var entity = interactswith.getHeldEntity();
    var vinyl = entity.script ? entity.script.vinyl : null;
    var analyser = this.entity.script.audioAnalyser;

    if (vinyl) {
        this._soundSlot = pc.util.playSoundSlot(this.entity, vinyl.soundSlotName);
        if (this._soundSlot) {
            analyser.assignSoundSlot(this._soundSlot);
        }
    }
};


Hifi.prototype._onDetachObject = function (interactswith) {
    if (this._soundSlot) {
        pc.util.stopSoundSlot(this.entity, this._soundSlot.name);
        this._soundSlot = null; 
    }
    
    for (var i = 0; i < this._speakerCones.length; ++i) {
        this._speakerCones[i].applyVolume(0);
    }
};