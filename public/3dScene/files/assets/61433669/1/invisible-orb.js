var InvisibleOrb = pc.createScript('invisibleOrb');


InvisibleOrb.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', function (entity) {
        console.log(entity.name + ' has entered trigger volume.');
        networkInstance.changeVisibility(false);
    });
    this.entity.collision.on('triggerleave', function (entity) {
        console.log(entity.name + ' has left trigger volume.');
        networkInstance.changeVisibility(true);
    });
};

