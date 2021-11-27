var HotspotButton = pc.createScript('hotspotButton');

HotspotButton.attributes.add('button',{type:'entity'});

// initialize code called once per entity
HotspotButton.prototype.initialize = function() {
    var self=this;
    
    this.button.element.on("click",function(){
         self.entity.fire("hotspot:click");
    });
};

// update code called every frame
HotspotButton.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// HotspotButton.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/