var DontMove = pc.createScript('dontMove');

// initialize code called once per entity
DontMove.prototype.initialize = function() {

};

// update code called every frame
DontMove.prototype.update = function(dt) {
    // this.app.fire("lockCamera");
    this.app.fire("stopRaycast");
};

// swap method called for script hot-reloading
// inherit your script state here
// DontMove.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/