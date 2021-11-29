var BeamSpot = pc.createScript('beamSpot');


BeamSpot.attributes.add("BeamspotTransform",{type:"entity"});
BeamSpot.attributes.add("highlightPanel",{type:"entity"});

BeamSpot.prototype.initialize = function() {
     this.entity.collision.on('triggerenter', function (entity) {
        console.log(entity.name + ' has entered trigger volume.');
        // networkInstance.changeVisibility(false);
        if(entity.name === "Robo Bot"){
            entity.setLocalScale(0,0,0);
        }
    });
    this.entity.collision.on('triggerleave', function (entity) {
        console.log(entity.name + ' has left trigger volume.');
        if(entity.name === "Robo Bot"){ 
            entity.setLocalScale(1,1,1);
        }
    });

    if(this.highlightPanel){
        this.highlightPanel.enabled = false;
    }

    // Handling events
    this.entity.on('object:interact', this._onInteract, this);
    this.entity.on('object:onhover', this._onHover, this);
    this.entity.on('object:offhover', this._offHover, this);
};

BeamSpot.prototype._onInteract = function(event){
    // console.log("User want to teleport !!!!");
    if(cameraLerpInstance){
        cameraLerpInstance.updatePos(this.BeamspotTransform.getPosition());
        cameraLerpInstance.updateRot(this.BeamspotTransform.getRotation());
    }
};

BeamSpot.prototype._onHover = function(event){
   if(this.highlightPanel){
        this.highlightPanel.enabled = true;
    }
};

BeamSpot.prototype._offHover = function(event){
    if(this.highlightPanel){
        this.highlightPanel.enabled = false;
    }
};