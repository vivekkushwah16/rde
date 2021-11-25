var AvatarHandler = pc.createScript('avatarHandler');

AvatarHandler.attributes.add("texturesM", {type: "asset", assetType: "texture", array: true, title: "Textures Male"});
AvatarHandler.attributes.add("texturesF", {type: "asset", assetType: "texture", array: true, title: "Textures Female"});

AvatarHandler.attributes.add("modelM", {type: "entity"});
AvatarHandler.attributes.add("modelF", {type: "entity"});
AvatarHandler.attributes.add("modelAnonymous", {type: "entity"});
AvatarHandler.attributes.add("modelN1", {type: "entity"});
AvatarHandler.attributes.add("modelS2", {type: "entity"});
AvatarHandler.attributes.add("modelI3", {type: "entity"});
AvatarHandler.attributes.add("modelD4", {type: "entity"});
AvatarHandler.attributes.add("modelSa5", {type: "entity"});
AvatarHandler.attributes.add("modelSt6", {type: "entity"});
AvatarHandler.attributes.add("modelSu7", {type: "entity"});
AvatarHandler.attributes.add("modelAl8", {type: "entity"});

AvatarHandler.attributes.add("modelAL9", {type: "entity"});
AvatarHandler.attributes.add("modelAN10", {type: "entity"});
AvatarHandler.attributes.add("modelBA11", {type: "entity"});
AvatarHandler.attributes.add("modelRI12", {type: "entity"});
AvatarHandler.attributes.add("modelSA13", {type: "entity"});
AvatarHandler.attributes.add("modelSI14", {type: "entity"});
AvatarHandler.attributes.add("modelYA15", {type: "entity"});

AvatarHandler.attributes.add("HoloM", {type: "entity"});
AvatarHandler.attributes.add("HoloF", {type: "entity"});

AvatarHandler.attributes.add("mCap", {type: "entity"});
AvatarHandler.attributes.add("mGlass", {type: "entity"});

AvatarHandler.attributes.add("fCap", {type: "entity"});
AvatarHandler.attributes.add("fGlass", {type: "entity"});


// initialize code called once per entity
AvatarHandler.prototype.initialize = function() {
     var self=this;
     var app=this.app;    
};

// update code called every frame
AvatarHandler.prototype.update = function(dt) {
    
};

AvatarHandler.prototype.updateAvatar=function(details){
    var self=this;
    console.log(details.gender);
       // if(details.gender === 11){
       //      self.modelN1.enabled=true;
       //   }else if(details.gender === 12){
       //      self.modelS2.enabled=true;
       //   }else if(details.gender === 13){
       //      self.modelI3.enabled=true;
       //   }else if(details.gender === 14){
       //      self.modelD4.enabled=true;
       //   }else if(details.gender === 15){
       //      self.modelSa5.enabled=true;
       //   }else if(details.gender === 16){
       //      self.modelSt6.enabled=true;
       //   }else if(details.gender === 17){
       //      self.modelSu7.enabled=true;
       //   }else if(details.gender === 18){
       //      self.modelAl8.enabled=true;
       //   }else if(details.gender === 19){
       //      self.modelAL9.enabled=true;
       //   }else if(details.gender === 20){
       //      self.modelAN10.enabled=true;
       //   }else if(details.gender === 21){
       //      self.modelBA11.enabled=true;
       //   }else if(details.gender === 22){
       //      self.modelRI12.enabled=true;
       //   }else if(details.gender === 23){
       //      self.modelSA13.enabled=true;
       //   }else if(details.gender === 24){
       //      self.modelSI14.enabled=true;
       //   }else if(details.gender === 25){
       //      self.modelYA15.enabled=true;
       //   }else
             self.modelAnonymous.enabled=true;
     return;
    
    var app=this.app;
    
        var meshInstances =  self.modelM.model.meshInstances;
        var mesh = meshInstances[2];
        var material=mesh.material.clone();
        //console.log(details.dress);
        material.diffuseMap = self.texturesM[details.dress].resource;
        material.update();
        mesh.material=material;
    
        //mesh.material.diffuseMap = self.texturesM[details.dress].resource;
        //mesh.material.update();
        
        var meshInstances1 =  self.modelF.model.meshInstances;
        var mesh1 = meshInstances1[0];
    
        var material1=mesh1.material.clone();
        material1.diffuseMap = self.texturesF[details.dress].resource;
        material1.update();
        mesh1.material=material1;
    
        //mesh1.material.diffuseMap = self.texturesF[details.dress].resource;
        //mesh1.material.update();
    
              
        //var meshInstances2 =  self.modelF.model.meshInstances;
        var mesh2 = meshInstances1[1];
    
        var material2=mesh2.material.clone();
        material2.diffuseMap = self.texturesF[details.skin].resource;
        material2.update();
        mesh2.material=material2;
       // mesh2.material.diffuseMap = self.texturesF[details.skin].resource;
       // mesh2.material.update();
        
         //var meshInstances3 =  self.modelM.model.meshInstances;
         var mesh3 = meshInstances[0];
    
         var material3=mesh3.material.clone();
         material3.diffuseMap = self.texturesM[details.skin].resource;
         material3.update();
         mesh3.material=material3;
         //mesh3.material.diffuseMap= self.texturesM[details.skin].resource;
         //mesh3.material.update();
    
         if(details.hat === 1){
            self.mCap.enabled=true;
            self.fCap.enabled=true;
         }else{
            self.mCap.enabled=false;
            self.fCap.enabled=false;
         }   
    
         if(details.glass === 1){
            self.mGlass.enabled=true;
            self.fGlass.enabled=true;
         }else{
            self.mGlass.enabled=false;
            self.fGlass.enabled=false;
         }
      if(details.gender === 1){
            self.modelM.enabled=false;
            self.modelF.enabled=true;
            self.HoloM.enabled=false;
            self.HoloF.enabled=true;
         }else{
            self.modelM.enabled=true;
            self.modelF.enabled=false;
            self.HoloM.enabled=true;
            self.HoloF.enabled=false;
         }
      
    
};
// swap method called for script hot-reloading
// inherit your script state here
// AvatarHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/
// 