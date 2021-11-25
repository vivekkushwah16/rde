var SpecificPos = pc.createScript('specificPos');

SpecificPos.attributes.add('specificEnitity', {type: 'entity', title: 'Pos Entity'});


SpecificPos.pos=new pc.Vec3();
// initialize code called once per entity
SpecificPos.prototype.initialize = function() {
    SpecificPos.pos=this.specificEnitity.getPosition();
};

SpecificPos.prototype.position = function(dt) {
    return (this.specificEnitity.getPosition());
};

// update code called every frame
SpecificPos.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// SpecificPos.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/