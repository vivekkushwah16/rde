var SpeakerCone = pc.createScript('speakerCone');

SpeakerCone.MAX_DISPLACEMENT = 0.02;
SpeakerCone.MAX_SCALE_RANGE = 0.1;

SpeakerCone.volumeDisplacement = new pc.Vec3();
SpeakerCone.volumeScale = new pc.Vec3();

// Volume should be between 0-1
SpeakerCone.prototype.applyVolume = function (volume) {
    var displacement = SpeakerCone.volumeDisplacement;
    displacement.copy(this.entity.forward).scale(volume * SpeakerCone.MAX_DISPLACEMENT);
    displacement.add(this._startLocalPosition);
   
    var scale = SpeakerCone.volumeScale;
    var s = SpeakerCone.MAX_SCALE_RANGE * volume;
    
    // Add some random scale for 'vibrations'
    s += pc.math.random(-SpeakerCone.MAX_DISPLACEMENT / 5, SpeakerCone.MAX_DISPLACEMENT / 5);
    
    scale.set(s, s, s);
    scale.add(this._startLocalScale);
    
    this.entity.setLocalPosition(displacement);
    this.entity.setLocalScale(scale);
};

// initialize code called once per entity
SpeakerCone.prototype.initialize = function() {
    this._startLocalPosition = this.entity.getLocalPosition().clone();
    this._startLocalScale = this.entity.getLocalScale().clone();
};


