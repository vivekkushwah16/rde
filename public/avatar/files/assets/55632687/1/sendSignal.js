var SendSignal = pc.createScript('sendSignal');

SendSignal.attributes.add("signal",{type:"string"});
SendSignal.attributes.add("data",{type:"number"});
// initialize code called once per entity
SendSignal.prototype.initialize = function() {
    var self=this;
    this.entity.button.on('click',function(){
        self.app.fire(""+self.signal,self.data);
    });
};

// update code called every frame
SendSignal.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// SendSignal.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/