var AvatarloadHandler = pc.createScript('avatarloadHandler');

AvatarloadHandler.attributes.add('limit',{type:'number'});
AvatarloadHandler.attributes.add('interval',{type:'number'});

// initialize code called once per entity
AvatarloadHandler.prototype.initialize = function() {
    var memoryAmount = navigator.deviceMemory;
    console.log("memory: "+memoryAmount);
    if(memoryAmount<1){
        this.limit=10;
    }else if(memoryAmount<2){
        this.limit=25;
    }else if(memoryAmount<4){
        this.limit=40;
    }else if(memoryAmount<8){
        this.limit=50;
    }else 
        this.limit=65;
    console.log(this.limit);
    this.handler(this.interval);
};

AvatarloadHandler.prototype.addedChild = function(obj) {
    var self=this;
   //  console.log(obj);
 //   console.log(this.entity.children.length);
     if(self.entity.children.length>=this.limit) {
         obj.enabled=false;
     }else{
         obj.enabled=true;
     }
};

AvatarloadHandler.prototype.removedChild = function(flag) {
    var self=this;
    if(self.entity.children.length>=self.limit){
        if(flag)
            this.deactivateOn();
        else
            this.activateOff();
    }
};

AvatarloadHandler.prototype.handler=function(delay){
    var self=this;
    setTimeout(function(){
        if(self.entity.children.length>=self.limit)    
        {
            self.deactivateOn();
            self.activateOff();
        }
        self.handler(self.interval);
    },self.interval);
};
    
AvatarloadHandler.prototype.deactivateOn = function() {
    var self=this;
    var no=-1;
    do{
        var temp=Math.floor(pc.math.random(0,self.entity.children.length));
        if(!self.entity.children[temp].enabled)
            no=temp;
    }while(no===-1);
    self.entity.children[no].enabled=true;
};
    
AvatarloadHandler.prototype.activateOff = function() {
    var self=this;
    var no=-1;
    do{
        var temp=Math.floor(pc.math.random(0,self.entity.children.length));
        if(self.entity.children[temp].enabled)
            no=temp;
    }while(no===-1);
    self.entity.children[no].enabled=false;
};
// update code called every frame
AvatarloadHandler.prototype.update = function(dt) {

  //  console.log(this.entity.children.length);
};

// swap method called for script hot-reloading
// inherit your script state here
// AvatarloadHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/