var HotspotButtonConnector = pc.createScript('hotspotButtonConnector');

// initialize code called once per entity
HotspotButtonConnector.prototype.initialize = function() {
    
};

// update code called every frame
HotspotButtonConnector.prototype.update = function(dt) {
    
    var self = this;
    
    self.entity.on('button:activated', function (){
       
    self.entity.fire("hotspot:click");
     
    });
};

// swap method called for script hot-reloading
// inherit your script state here
// HotspotButtonConnector.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/