var Statue = pc.createScript('statue');

Statue.attributes.add('soundSlotName', {type: 'string', default: '', title: 'Sound Slot Name'});

// initialize code called once per entity
Statue.prototype.initialize = function() {
    this._audioEntity = this.entity.findByName('Sound');
    pc.util.initSoundSlotAssets(this.app, this._audioEntity);
    
    this._particles = this.entity.findByName('Particle System');
    this.entity.on('statue:activate', this._onActivate, this);
};


// update code called every frame
Statue.prototype.update = function(dt) {

};


Statue.prototype._onActivate = function () {
    pc.util.playSoundSlot(this._audioEntity, this.soundSlotName); 
    
    this._secsSinceActivation = 0;    
    this._playParticleEffect(this._particles);
};


Statue.prototype._playParticleEffect = function (parent) {
    var children = parent.children;
    for (var i = 0; i < children.length; i++) {
        children[i].particlesystem.reset();
        children[i].particlesystem.play();        
    }        
};
