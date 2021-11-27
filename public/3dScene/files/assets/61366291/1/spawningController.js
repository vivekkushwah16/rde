var SpawningController = pc.createScript('spawningController');
SpawningController.attributes.add("defaultMarker",{type:"entity"});
SpawningController.attributes.add("barMarker",{type:"entity"});
SpawningController.attributes.add("loungeMarker",{type:"entity"});
SpawningController.attributes.add("libraryMarker",{type:"entity"});
SpawningController.attributes.add("mainAreaMarker",{type:"entity"});
// initialize code called once per entity
SpawningController.prototype.initialize = function() {
    this.initPos=this.defaultMarker.getLocalPosition();
    this.initRot=this.defaultMarker.getLocalEulerAngles();
    console.log("Spawn at: "+window.localStorage.getItem("lobbySpawning"));
    var self=this;
    if(window.localStorage.getItem("lobbySpawning")=="bar"){
        self.entity.setLocalPosition(self.barMarker.getLocalPosition());
        self.entity.setLocalEulerAngles(self.barMarker.getLocalEulerAngles());
    }
    else if(window.localStorage.getItem("lobbySpawning")=="lounge"){
        self.entity.setLocalPosition(self.loungeMarker.getLocalPosition());
        self.entity.setLocalEulerAngles(self.loungeMarker.getLocalEulerAngles());
    }
    else if(window.localStorage.getItem("lobbySpawning")=="library"){
        self.entity.setLocalPosition(self.libraryMarker.getLocalPosition());
        self.entity.setLocalEulerAngles(self.libraryMarker.getLocalEulerAngles());
    }
    else if(window.localStorage.getItem("lobbySpawning")=="mainArea"){
        self.entity.setLocalPosition(self.mainAreaMarker.getLocalPosition());
        self.entity.setLocalEulerAngles(self.mainAreaMarker.getLocalEulerAngles());
    }
    window.localStorage.setItem("lobbySpawning","default");
    this.entity.rigidbody.enabled=true;
};

// update code called every frame
SpawningController.prototype.update = function(dt) {

};

// swap method called for script hot-reloading
// inherit your script state here
// SpawningController.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/