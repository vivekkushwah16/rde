var VRoomHandler = pc.createScript('vRoomHandler');

VRoomHandler.attributes.add("cam",{type:'entity'});
// initialize code called once per entity
VRoomHandler.prototype.initialize = function() {
    this.show=true;
};

// update code called every frame
VRoomHandler.prototype.update = function(dt) {
    var distanceFromCamera = this.entity.getPosition().distance(this.cam.getPosition());
    if(distanceFromCamera>6){
        this.entity.children[1].children[1].enabled=this.show?false:false;
    }else
        this.entity.children[1].children[1].enabled=this.show?true:false;
};

VRoomHandler.prototype.joinvRoom = function(id) {
    var self=this;
    console.log("Joining Room id: "+self.myvRoomID);
    networkInstance.joinvRoom(self.myvRoomID);
};

VRoomHandler.prototype.setvRoomID = function(id) {
    var self=this;
    self.myvRoomID=id;
    console.log("Setting Room id: "+self.myvRoomID);
};
VRoomHandler.prototype.setJoinShow = function(id) {
    var self=this;
    self.show=id;
    console.log("Setting Room Join Show id: "+self.myvRoomID + " "+id);
};

// swap method called for script hot-reloading
// inherit your script state here
// VRoomHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/