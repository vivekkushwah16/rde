var FaceCamera = pc.createScript('faceCamera');

FaceCamera.attributes.add('cameraEntity',{type:'entity'});

// initialize code called once per entity
FaceCamera.prototype.initialize = function() {
    
};

FaceCamera.prototype.setTarget = function(temp) {
    this.cameraEntity=temp;
};
// update code called every frame
FaceCamera.prototype.update = function(dt) {
    var self=this;
    // this.onlyYRot=true;
    // console.log(self.cameraEntity.getPosition());
    // var eulerAngleX=self.entity.getEulerAngles().x;
    // var eulerAngleZ=self.entity.getEulerAngles().z;

    self.entity.lookAt(self.cameraEntity.getPosition());
    
   // if(this.onlyYRot)
       // self.entity.setEulerAngles(eulerAngleX, self.entity.getEulerAngles().y, eulerAngleZ);
};

// swap method called for script hot-reloading
// inherit your script state here
// FaceCamera.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/