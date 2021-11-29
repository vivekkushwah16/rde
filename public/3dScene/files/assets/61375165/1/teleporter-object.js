var TeleporterObject = pc.createScript('teleporterObject');


TeleporterObject.attributes.add("teleportPose",{type:'entity'});
TeleporterObject.attributes.add("highlightPanel",{type:'entity'});


TeleporterObject.prototype.initialize = function() {
    var self = this; 
    
    this.whitePanel = this.app.root.findByTag("WhitePanel")[0];
    // console.log(this.whitePanel);

    // Handling events
    this.entity.on('object:interact', this._onInteract, this);
    this.entity.on('object:onhover', this._onHover, this);
    this.entity.on('object:offhover', this._offHover, this);

    // disabling highlighter at start
    if(this.highlightPanel){
        this.highlightPanel.enabled = false;
    }

};


TeleporterObject.prototype._onInteract = function(event){
    // console.log("User want to teleport !!!!");
    if(cameraLerpInstance){
        app.fire('lockCamera');  
        app.fire("lockMovement");
        if(this.whitePanel){
            this.performTeleportEffect();
            setTimeout( () => {
                cameraLerpInstance.updatePosInstant(this.teleportPose.getPosition());
                cameraLerpInstance.updateRot(this.teleportPose.getRotation());
            },500);   
               
        }else{
            cameraLerpInstance.updatePosInstant(this.teleportPose.getPosition());
            cameraLerpInstance.updateRot(this.teleportPose.getRotation());

        } 
        
        
    }
};


TeleporterObject.prototype.performTeleportEffect = function(){
      var data = {
          value: 0
      };
      console.log(this.whitePanel);
      this.app.root.tween(data).to({value:1},0.5,pc.Linear).start().on('update',() => this.whitePanel.element.opacity = data.value).on('complete', () => {
          setTimeout( () => {
              
              this.app.root.tween(data).to({value:0},0.5,pc.Linear).start().on('update',() => this.whitePanel.element.opacity = data.value).on('complete' , () => {
                                                   cameraLerpInstance.endRot();
                                                    app.fire('unlockCamera');  
                                            });
              
              } , 1000);
      } );
};

TeleporterObject.prototype._onHover = function(event){
   if(this.highlightPanel){
        this.highlightPanel.enabled = true;
    }
};

TeleporterObject.prototype._offHover = function(event){
    if(this.highlightPanel){
        this.highlightPanel.enabled = false;
    }
};