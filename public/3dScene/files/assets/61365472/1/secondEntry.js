var SecondEntry = pc.createScript('secondEntry');

SecondEntry.attributes.add('first',{type:'entity'});
SecondEntry.attributes.add('second',{type:'entity'});
// initialize code called once per entity
SecondEntry.prototype.initialize = function() {
    
    // window.localStorage.setItem("lobbyFirst", "true");
    
    // if(window.localStorage.getItem("lobbyFirst")=="true"){
    //     this.first.enabled=true;
    //       this.second.enabled=false;
    //     window.localStorage.setItem("lobbyFirst", "false");
    // }else
        {
              this.first.enabled=false;
          this.second.enabled=true;
        }
};

// update code called every frame
SecondEntry.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// SecondEntry.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/