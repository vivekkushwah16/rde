var TeleporterObject = pc.createScript('teleporterObject');


TeleporterObject.attributes.add("teleportPose",{type:'entity'});
TeleporterObject.attributes.add("highlightPanel",{type:'entity'});


TeleporterObject.prototype.initialize = function() {
    var self = this; 
    
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
        cameraLerpInstance.updatePosInstant(this.teleportPose.getPosition());
        cameraLerpInstance.updateRot(this.teleportPose.getRotation());
    }
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