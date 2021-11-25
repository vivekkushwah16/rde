var Spin = pc.createScript('spin');

Spin.attributes.add("speed",{type:'number',default:-20});
// initialize code called once per entity
Spin.prototype.initialize = function() {
  //  this.speed=-20;
};

// update code called every frame
Spin.prototype.update = function(dt) {
    this.entity.setLocalEulerAngles(0,0,this.entity.getLocalEulerAngles().z+dt*this.speed);
};

// swap method called for script hot-reloading
// inherit your script state here
// Spin.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/