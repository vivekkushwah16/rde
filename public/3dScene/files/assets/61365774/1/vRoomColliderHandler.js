var VRoomColliderHandler = pc.createScript('vRoomColliderHandler');

VRoomColliderHandler.attributes.add("hover",{type:'entity'});
VRoomColliderHandler.attributes.add("roomParent",{type:'entity'});
// initialize code called once per entity
VRoomColliderHandler.prototype.initialize = function() {
    var self=this;
     this.entity.on("object:onhover",function(){
        if(self.hover)
            self.hover.enabled=true;
    });
    this.entity.on("object:interact",function(){
        self.roomParent.script.vRoomHandler.joinvRoom();
    });
    this.entity.on("object:offhover",function(){
        if(self.hover)
            self.hover.enabled=false;
    });
};

// update code called every frame
VRoomColliderHandler.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// VRoomColliderHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/