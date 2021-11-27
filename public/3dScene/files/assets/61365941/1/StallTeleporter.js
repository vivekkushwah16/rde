var StallTeleporter = pc.createScript('stallTeleporter');

StallTeleporter.attributes.add("sceneId", {type: "string", default: "0", title: "Stall Scene ID to Load"});

StallTeleporter.attributes.add("tellportBody", {type: "entity", title: "Teleport Emissive body"});
StallTeleporter.attributes.add("color", {type: "rgba", title: "emissive color"});

StallTeleporter.attributes.add("fadeInCanvas", {type: "entity", title: "2d canvas for fade In Screen"});

StallTeleporter.attributes.add("loadParent", {type: "entity"});

StallTeleporter.attributes.add("fadeInTime", {type: "number", title: "Fade In Time"});

StallTeleporter.attributes.add("fadeOutTime", {type: "number", title: "Fade out Time"});

StallTeleporter.attributes.add("root", {type: "entity"});

StallTeleporter.attributes.add("cameraEntity", {type: "entity"});

StallTeleporter.attributes.add("cameraOffestEntity", {type: "entity"});


StallTeleporter.attributes.add("cameraRx", {type: "number"});

StallTeleporter.attributes.add("cameraRy", {type: "number"});

StallTeleporter.attributes.add("cameraRz", {type: "number"});

StallTeleporter.attributes.add("infoHotspot", {type: "entity"});

StallTeleporter.attributes.add("infoBackButton", {type: "entity"});

StallTeleporter.attributes.add("exitCameraRx", {type: "number"});

StallTeleporter.attributes.add("exitCameraRy", {type: "number"});

StallTeleporter.attributes.add("exitCameraRz", {type: "number"});

StallTeleporter.attributes.add("videoCanvas", {type: "entity"});

StallTeleporter.attributes.add("imageCanvas", {type: "entity"});

StallTeleporter.attributes.add("arrow", {type: "entity"});

StallTeleporter.attributes.add("logThis", {type: "string"});
StallTeleporter.attributes.add("ground", {type: "entity"});

var canWork = true;

//var fadeInnow = false;

StallTeleporter.prototype.initialize = function() {
    var self = this;
    var app=this.app;
    this._lookCamera = this.cameraEntity.script.camera360;    
    
    this.entity.on('object:interact', this._onInteract, this);
    this.entity.on('object:onhover', this._onHover, this);
    this.entity.on('object:offhover', this._offHover, this);
    
    this.time = 0;
    this.fadeOutNow = false;
    this.fadeInnow = false;

    this.entity.on('loadingDone',function(){
        
        var pos = self.entity.getPosition();
        pos.y+=0.26;
        app.fire('disableButts');
        var rot = self.entity.getLocalEulerAngles();
        //self.oldPos=self.cameraOffestEntity.getPosition();
        self._lookCamera.teleport(pos);
        self.cameraOffestEntity.setLocalEulerAngles(new pc.Vec3(0,0,0));
        self.cameraEntity.setRotation(self.entity.getRotation());//(rot.x, rot.y, rot.z);
        
       // self.entity.collision.enabled=false;
        self.fadeOutNow = true;
        self.time = self.fadeOutTime;
        
        // if(self.app.mouse)
        // {
        //  self.app.mouse.disablePointerLock();
        // }
        // 
        self.infoHotspot.enabled = true;
        self.infoBackButton.enabled = true;
        console.log("fadedout now");
        
        //HERE okay script ni milra shyad
     //  self.root.script.touchInput.enabled = false;
       //self.root.script.mouseInput.enabled = false;
       self.root.script.pointAndClick.enabled = false;
         
        self.arrow.enabled = false;
        
        self.ground.enabled=false;
        
        self.app.fire("enterStall");
        canWork = false;
    });
    
    this.reset = false;
    this.resetTimer = 0;
};


StallTeleporter.prototype.update = function(dt) {
     if(this.fadeInnow)
    {
        
        var localtime = this.time;
        this.time = localtime + dt;
        var duration = this.time / this.fadeInTime;
    
        if(duration >= 1)
        {
        duration = 1;
        this.fadeInnow = false;
      //  this.entity.fire('startLoader'); 
        this.entity.fire('loadingDone');
        }
        this.fadeIn(this.fadeInCanvas, duration);
    }
    
    if(this.fadeOutNow)
    {
     this.time -= dt;
        var duration_1 = this.time / this.fadeOutTime;
        if(duration_1 <= 0)
        {
            duration_1 = 0;
            this.fadeOutNow = false;
        }
         this.fadeOut(this.fadeInCanvas, duration_1);   
    }
    
    if(this.reset)
    {
        this.resetTimer += dt;
        if(this.resetTimer > 1)
        {
            this.resetTimer = 0;
            this.reset = false;
            canWork = true;
            console.log("canwork now");
        }
    }
};

StallTeleporter.prototype._onInteract = function (controller) {
    if(!canWork){ return; }
    
       // var controllerMovementDirection = InteractionStall.controllerMovementDirection.copy(this.entity.up);
       // controllerMovementDirection.scale(-1);
        
    //    if (controller.getMovementDirection) {
     //       controllerMovementDirection.copy(controller.getMovementDirection());
     //   }
          pc.util.setEntityEmissive(this.entity, new pc.Color(1, 1, 1));  
          //this.cameraOffestEntity.
          // this.entity.fire('button:activated');  
            
           this.app.fire('lockCamera');
          this.time = 0;
          this.fadeInnow = true;
          this.fadeInCanvas.enabled = true; 
    
          this.loadParent.enabled = false;
    
        if(self.logThis!=="")
            firebaseInstance.logevent(self.logThis);
    
    console.log("button activated");
};


StallTeleporter.prototype._onHover = function () {
          pc.util.setEntityEmissive(this.tellportBody, new pc.Color(0, 0.78, 1)); 
       // this.canvas3d.enabled = true;
  
};


StallTeleporter.prototype._offHover = function () {
        pc.util.setEntityEmissive(this.tellportBody, new pc.Color(1, 1, 1));  
      //  this.canvas3d.enabled = false;
};


StallTeleporter.prototype.fadeIn = function(entity, value)
{
    
        var children = entity.children;//returns array
        
        for (var i = 0; i < children.length; ++i) 
        {
            if(children[i].element)
            {
                children[i].element.opacity = value;
            }
        }
};


StallTeleporter.prototype.changeScenes = function() {
    // Get a reference to the current root object
    var oldHierarchy = this.app.root.findByName ('Root');
    
    // Load the new scene. The scene ID is found by loading the scene in the editor and 
    // taking the number from the URL
    // e.g. If the URL when Scene 1 is loaded is: https://playcanvas.com/editor/scene/475211
    // The ID is the number on the end (475211)
    this.loadScene (this.sceneId, function () {
        // Once the new scene has been loaded, destroy the old one
        oldHierarchy.destroy ();
    });
};

StallTeleporter.prototype.loadScene = function (id, callback) {
    // Get the path to the scene
    var url = id  + ".json";
    
    // Load the scenes entity hierarchy
    this.app.loadSceneHierarchy(url, function (err, parent) {
        if (!err) {
            callback(parent);
        } else {
            console.error (err);
        }
    });
};


StallTeleporter.prototype.fadeOut = function(entity, value)
{
        var children = entity.children;//returns array
        
        for (var i = 0; i < children.length; ++i) 
        {
            if(children[i].element)
            {
                children[i].element.opacity = value;
            }
            this.fadeOut(children[i]);
        }
    
    if(value === 0)
    {
        entity.enabled = false;
    }
};



StallTeleporter.prototype.backbtn = function()
{
    var self=this;
    var app=this.app;
     //this.cameraOffestEntity.setLocalEulerAngles( this.exitCameraRx,  this.exitCameraRy,  this.exitCameraRz);
            self.ground.enabled=true;
        
     this.infoHotspot.enabled = false;
    this.infoBackButton.enabled = false;
     // if(this.app.mouse)
     //   {
     //    this.app.mouse.enablePointerLock ();
     //   }
            
   //   self.root.script.touchInput.enabled = true;
     // self.root.script.mouseInput.enabled = true;
      self.root.script.pointAndClick.enabled = true;
    
    this.videoCanvas.enabled = false;
    this.imageCanvas.enabled = false;
    this.reset = true;
    this.resetTimer = 0;
    this.arrow.enabled = true;
    
    this.entity.fire('object:interactionOver');
    
  //s   self._lookCamera.teleport(this.oldPos);
    
     this.app.fire('enableButts');
     this.app.fire('unlockCamera');
        this.app.fire("exitStall");
};