var HotspotBack = pc.createScript('hotspotBack');


HotspotBack.attributes.add("stallTeleporterEntity", {type: "entity"});

// initialize code called once per entity
HotspotBack.prototype.initialize = function() {
   var self = this;
    this._stallTeleporter = this.stallTeleporterEntity.script.stallTeleporter;
    
    this.entity.on("hotspot:click", function(){
        self._stallTeleporter.backbtn();
    });
    
    if(this.entity.element){
        this.entity.element.on("click", function(){
            self._stallTeleporter.backbtn();
        });
    }
};

// update code called every frame
HotspotBack.prototype.update = function(dt) {
      if(document.getElementById('stall-container')){
        this.entity.element.useInput=false;
    }else
        this.entity.element.useInput=true;
};

// swap method called for script hot-reloading
// inherit your script state here
// HotspotBack.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/