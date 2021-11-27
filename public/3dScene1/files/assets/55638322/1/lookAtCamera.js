var LookAtcamera = pc.createScript('lookAtcamera');

LookAtcamera.attributes.add("cameraEntity", {type: "entity", title: "Camera Entity"});

LookAtcamera.attributes.add("fadeDropOff", {
    type: "number", 
    default: 0.4, 
    title: "Fade Drop Off", 
    description: "When to start fading out hotspot relative to the camera direction. 1 for when hotspot is directly inline with the camera. 0 for never."
});

// initialize code called once per entity
LookAtcamera.prototype.initialize = function() {
      this.directionToCamera = new pc.Vec3();
     this.defaultForwardDirection = this.entity.forward.clone();
};

// update code called every frame
LookAtcamera.prototype.update = function(dt) {
    var cameraPosition = this.cameraEntity.getPosition();
    this.entity.lookAt(cameraPosition);
};
