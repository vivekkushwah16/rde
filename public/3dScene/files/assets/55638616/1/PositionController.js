var PositionController = pc.createScript('positionController');

PositionController.attributes.add('tutorialH', {type: 'entity', title: 'Tutorial Handler'});
PositionController.attributes.add('cameraEntity', {type: 'entity', title: 'Camera Offset Entity'});

// initialize code called once per entity
PositionController.prototype.initialize = function() {
    var self = this;
    
    if (sessionStorage.getItem("ReturnPositionEvent")) {

        var packageString = sessionStorage.getItem("ReturnPositionEvent");
        var package = JSON.parse(packageString);
        
        this.tutorialH.script.tutorialHandler.dontStart();
        this.cameraEntity.setPosition( (package.position.x).toPrecision(2), (package.position.y).toPrecision(2), (package.position.z).toPrecision(2));    
         this.cameraEntity.setLocalEulerAngles((package.rotation.x).toPrecision(2), (package.rotation.y).toPrecision(2), (package.rotation.z).toPrecision(2) );

        sessionStorage.removeItem('ReturnPositionEvent');
    }else
    {
        console.log("noPrevious Position Found");
    }
    
    this.app.on("saveCameraPos", function(){
         self.savePos();
    }, this);
};

PositionController.prototype.savePos = function() {
  if(this.cameraEntity)
  {
        console.log("saving camera transform");
      
        var pos = this.cameraEntity.getPosition();
        var rotation = this.cameraEntity.getLocalEulerAngles();
        var package = {
              "position": pos,
              "rotation": rotation
          };
        var packageString = JSON.stringify(package);
      
      sessionStorage.setItem('ReturnPositionEvent', packageString);
  }  
};
