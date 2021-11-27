var HandleSound = pc.createScript('handleSound');

var soundHandler;
// initialize code called once per entity
HandleSound.prototype.initialize = function() {
    soundHandler=this;
    this.setVolume(0);
};

// update code called every frame
HandleSound.prototype.update = function(dt) {
    
};

HandleSound.prototype.setVolume = function(volume) {
    this.app.systems.sound.volume = volume;  
};

 function volumeSetKrdo(i){
     soundHandler.setVolume(i);
 }
// swap method called for script hot-reloading
// inherit your script state here
// HandleSound.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/