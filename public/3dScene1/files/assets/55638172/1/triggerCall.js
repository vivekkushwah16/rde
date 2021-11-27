var TriggerCall = pc.createScript('triggerCall');

TriggerCall.attributes.add("vRoom",{type:"string"});
// initialize code called once per entity
TriggerCall.prototype.initialize = function() {
      this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
      this.entity.collision.on('triggerleave', this.onTriggerExit, this);
};

// update code called every frame
TriggerCall.prototype.update = function(dt) {
    
};


TriggerCall.prototype.onTriggerEnter = function(entity) {
    console.log("enter trigger "+ this.vRoom);
      if(typeof window.parent.startCall !== "undefined")
            window.parent.startCall(this.vRoom);
};
TriggerCall.prototype.onTriggerExit = function(entity) {
    console.log("exit trigger");
       if(typeof window.parent.leaveCall !== "undefined")
            window.parent.leaveCall();
};
// swap method called for script hot-reloading
// inherit your script state here
// TriggerCall.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/