var NegotiationAvatarUpdate = pc.createScript('negotiationAvatarUpdate');

NegotiationAvatarUpdate.attributes.add('male', {type: 'entity'});
NegotiationAvatarUpdate.attributes.add('female', {type: 'entity'});
NegotiationAvatarUpdate.attributes.add('oldAvatar', {type: 'entity'});
NegotiationAvatarUpdate.attributes.add('glassesF', {type: 'entity'});
NegotiationAvatarUpdate.attributes.add('glassesM', {type: 'entity'});
NegotiationAvatarUpdate.attributes.add('flagImg', {type: 'entity'});
NegotiationAvatarUpdate.attributes.add('beard', {type: 'entity'});
NegotiationAvatarUpdate.attributes.add("mhair",{type:'entity',array:true});
NegotiationAvatarUpdate.attributes.add("mtop",{type:'entity',array:true});
NegotiationAvatarUpdate.attributes.add("fhair",{type:'entity',array:true});
NegotiationAvatarUpdate.attributes.add("ftop",{type:'entity',array:true});
NegotiationAvatarUpdate.attributes.add("flags",{type:'asset',array:true});

NegotiationAvatarUpdate.attributes.add("frameTextures",{type:'asset',array:true});

NegotiationAvatarUpdate.attributes.add("frameColour",{type:'rgba',array:true});
NegotiationAvatarUpdate.attributes.add("skinColour",{type:'rgba',array:true});
NegotiationAvatarUpdate.attributes.add("lipColour",{type:'rgba',array:true});
NegotiationAvatarUpdate.attributes.add("hairColour",{type:'rgba',array:true});
NegotiationAvatarUpdate.attributes.add("topAColour",{type:'rgba',array:true});
NegotiationAvatarUpdate.attributes.add("topBColour",{type:'rgba',array:true});
NegotiationAvatarUpdate.attributes.add("topCColour",{type:'rgba',array:true});
NegotiationAvatarUpdate.attributes.add("topCBColour",{type:'rgba',array:true});
NegotiationAvatarUpdate.attributes.add("mTopUColour",{type:'rgba',array:true});
NegotiationAvatarUpdate.attributes.add("fTopUColour",{type:'rgba',array:true});
NegotiationAvatarUpdate.attributes.add("bottomColour",{type:'rgba',array:true});
// initialize code called once per entity
NegotiationAvatarUpdate.prototype.initialize = function() {
    this.animateThese={};
    this.count=0;
    this.animateThese[this.count]=this.oldAvatar;
    this.count++;
};

NegotiationAvatarUpdate.prototype.applyAvatarDetails = function(avatarDetails) {
    if(avatarDetails.flagData!=-1){
        this.flagImg.element.height=40;
        this.flagImg.element.textureAsset=this.flags[avatarDetails.flagData];
    }
    if(avatarDetails.genderData===0){
        
        this.animateThese[this.count]=this.male;
        this.male.enabled=true;
        this.count++;
        if(avatarDetails.beard==1)
        {
            this.animateThese[this.count]=this.beard;
            this.beard.enabled=true;
            this.count++;
        }
        // if(avatarDetails.glassesM==1)
        // {
        //     this.animateThese[this.count]=this.glassesM;
        //     this.glassesM.enabled=true;
        //     this.count++;
        // }
        if(this.mhair[avatarDetails.mhairData]){
            if(avatarDetails.mhairData!=3){
                this.animateThese[this.count]=this.mhair[avatarDetails.mhairData];
                this.mhair[avatarDetails.mhairData].enabled=true;
                this.count++;
            }
        }
        if(this.mtop[avatarDetails.mtopData]){
            if(avatarDetails.mtopData<3){
                this.animateThese[this.count]=this.mtop[avatarDetails.mtopData];
                this.mtop[avatarDetails.mtopData].enabled=true;
                this.count++;
            }
        }
        
       if(avatarDetails.frame>=1){
            this.animateThese[this.count]=this.glassesM;
            this.count++;
            this.glassesM.enabled=true;
            
            var meshInstancesZ =  this.glassesM.model.meshInstances;
            var meshZ = meshInstancesZ[0];
            var materialZ=meshZ.material.clone();
            //console.log(details.dress);
            materialZ.opacityMap = this.frameTextures[avatarDetails.frame-1].resource;
            materialZ.diffuse=this.frameColour[avatarDetails.frameColorData];
            materialZ.update();
            meshZ.material=materialZ;
           
            // this.glassesM.model.meshInstances[0].material.opacityMap=this.frameTextures[avatarDetails.frame-1].resource;
            // this.glassesM.model.meshInstances[0].material.diffuse=this.frameColour[avatarDetails.frameColorData];
            // this.glassesM.model.meshInstances[0].material.update();
            
        }
        
  
        var meshInstancesZ1 =  this.male.model.meshInstances;
        var meshZ1 = meshInstancesZ1[1];
        var materialZ1=meshZ1.material.clone();
        materialZ1.diffuse=this.lipColour[avatarDetails.mskinColorData];
        materialZ1.update();
        meshZ1.material=materialZ1;
        
        // this.male.model.meshInstances[1].material.diffuse=this.lipColour[avatarDetails.mskinColorData];
        // this.male.model.meshInstances[1].material.update();
         
        var meshZ2 = meshInstancesZ1[2];
        var materialZ2=meshZ2.material.clone();
        materialZ2.diffuse=this.skinColour[avatarDetails.mskinColorData];
        materialZ2.update();
        meshZ2.material=materialZ2;
        
        // this.male.model.meshInstances[2].material.diffuse=this.skinColour[avatarDetails.mskinColorData];
        // this.male.model.meshInstances[2].material.update();
         
        var meshZ3 = meshInstancesZ1[5];
        var materialZ3=meshZ3.material.clone();
        materialZ3.diffuse=this.skinColour[avatarDetails.mskinColorData];
        materialZ3.update();
        meshZ3.material=materialZ3;
        
        // this.male.model.meshInstances[5].material.diffuse=this.skinColour[avatarDetails.mskinColorData];
        // this.male.model.meshInstances[5].material.update();
        
        var meshInstancesZ2 =  this.mhair[avatarDetails.mhairData].model.meshInstances;
        var meshZ4 = meshInstancesZ2[0];
        var materialZ4=meshZ4.material.clone();
        materialZ4.diffuse=this.hairColour[avatarDetails.mhairColorData];
        materialZ4.update();
        meshZ4.material=materialZ4;
        
        // this.mhair[avatarDetails.mhairData].model.meshInstances[0].material.diffuse=this.hairColour[avatarDetails.mhairColorData];
        // this.mhair[avatarDetails.mhairData].model.meshInstances[0].material.update();
         
        var meshZ5 = meshInstancesZ1[8];
        var materialZ5=meshZ5.material.clone();
        materialZ5.diffuse=this.hairColour[avatarDetails.mhairColorData];
        materialZ5.update();
        meshZ5.material=materialZ5;
        
        // this.male.model.meshInstances[8].material.diffuse=this.hairColour[avatarDetails.mhairColorData];
        // this.male.model.meshInstances[8].material.update();
        
        console.log(this.beard);
          if(avatarDetails.beard==1){
                var meshInstancesZ3 =  this.beard.model.meshInstances;
            var meshZ6 = meshInstancesZ3[0];
            var materialZ6=meshZ6.material.clone();
            materialZ6.diffuse=this.hairColour[avatarDetails.mhairColorData];
            materialZ6.update();
            meshZ6.material=materialZ6;
             
              
          }
        
        var meshZ7 = meshInstancesZ1[4];
        var materialZ7=meshZ7.material.clone();
        materialZ7.diffuse=this.bottomColour[avatarDetails.mbottomColorData];
        materialZ7.update();
        meshZ7.material=materialZ7;
        
        // this.male.model.meshInstances[4].material.diffuse=this.bottomColour[avatarDetails.mbottomColorData];
        // this.male.model.meshInstances[4].material.update();
        
        
        if(avatarDetails.mtopData==0){
              var meshZ8 = meshInstancesZ1[3];
            var materialZ8=meshZ8.material.clone();
            materialZ8.diffuse=this.topCBColour[avatarDetails.mtop1ColorData];
            materialZ8.update();
            meshZ8.material=materialZ8;
            
            // this.male.model.meshInstances[3].material.diffuse=this.topCBColour[avatarDetails.mtop1ColorData];
            // this.male.model.meshInstances[3].material.update();

            var meshInstancesZ4 =  this.mtop[avatarDetails.mtopData].model.meshInstances;
            var meshZ9 = meshInstancesZ4[0];
            var materialZ9=meshZ9.material.clone();
            materialZ9.diffuse=this.topCColour[avatarDetails.mtop1ColorData];
            materialZ9.update();
            meshZ9.material=materialZ9;
            
            // this.mtop[avatarDetails.mtopData].model.meshInstances[0].material.diffuse=this.topCColour[avatarDetails.mtop1ColorData];
            // this.mtop[avatarDetails.mtopData].model.meshInstances[0].material.update();
            // 
        }else if(avatarDetails.mtopData==1){
            var meshInstancesZ5 =  this.mtop[avatarDetails.mtopData].model.meshInstances;
            var meshZ10 = meshInstancesZ5[0];
            var materialZ10=meshZ10.material.clone();
            materialZ10.diffuse=this.mTopUColour[avatarDetails.mtop2ColorData];
            materialZ10.update();
            meshZ10.material=materialZ10;

            // this.mtop[avatarDetails.mtopData].model.meshInstances[0].material.diffuse=this.mTopUColour[avatarDetails.mtop2ColorData];
            // this.mtop[avatarDetails.mtopData].model.meshInstances[0].material.update();
           
        }else if(avatarDetails.mtopData==2){
              var meshInstancesZ6 =  this.mtop[avatarDetails.mtopData].model.meshInstances;
            var meshZ11 = meshInstancesZ6[0];
            var materialZ11=meshZ11.material.clone();
            materialZ11.diffuse=this.mTopUColour[avatarDetails.mtop3ColorData];
            materialZ11.update();
            meshZ11.material=materialZ11;
            
            // this.mtop[avatarDetails.mtopData].model.meshInstances[0].material.diffuse=this.mTopUColour[avatarDetails.mtop3ColorData];
            // this.mtop[avatarDetails.mtopData].model.meshInstances[0].material.update();
            
        }else if(avatarDetails.mtopData==3){
              var meshInstancesZ7 =  this.male.model.meshInstances;
            var meshZ12 = meshInstancesZ7[3];
            var materialZ12=meshZ12.material.clone();
            materialZ12.diffuse=this.topAColour[avatarDetails.mtop4ColorData];
            materialZ12.update();
            meshZ12.material=materialZ12;
            
            // this.male.model.meshInstances[3].material.diffuse=this.topAColour[avatarDetails.mtop4ColorData];
            // this.male.model.meshInstances[3].material.update();
        }
        
        
    }else{
        
        this.animateThese[this.count]=this.female;
        this.female.enabled=true;
        this.count++;
        // if(avatarDetails.glassesF==1)
        // {
        //     this.animateThese[this.count]=this.glassesF;
        //     this.glassesF.enabled=true;
        //     this.count++;
        // }
        this.animateThese[this.count]=this.fhair[avatarDetails.fhairData];
        this.fhair[avatarDetails.fhairData].enabled=true;
        this.count++;
        
          if(avatarDetails.frame>=1){
            this.animateThese[this.count]=this.glassesF;
            this.count++;
            this.glassesF.enabled=true;
            
            var meshInstancesZ8 =  this.glassesF.model.meshInstances;
            var meshZ13 = meshInstancesZ8[0];
            var materialZ13=meshZ13.material.clone();
            materialZ13.opacityMap=this.frameTextures[avatarDetails.frame-1].resource;
            materialZ13.diffuse=this.frameColour[avatarDetails.frameColorData];
            materialZ13.update();
            meshZ13.material=materialZ13;
              
            // this.glassesF.model.meshInstances[0].material.opacityMap=this.frameTextures[avatarDetails.frame-1].resource;
            // this.glassesF.model.meshInstances[0].material.diffuse=this.frameColour[avatarDetails.frameColorData];
            // this.glassesF.model.meshInstances[0].material.update();
        }
        
        if(avatarDetails.ftopData<3){
            this.animateThese[this.count]=this.ftop[avatarDetails.ftopData];
            this.ftop[avatarDetails.ftopData].enabled=true;
            this.count++;
        }
        
        
        var meshInstancesZ9 =  this.female.model.meshInstances;
        var meshZ14 = meshInstancesZ9[1];
        var materialZ14=meshZ14.material.clone();
        materialZ14.diffuse=this.lipColour[avatarDetails.fskinColorData];
        materialZ14.update();
        meshZ14.material=materialZ14;
        
         // this.female.model.meshInstances[1].material.diffuse=this.lipColour[avatarDetails.fskinColorData];
         // this.female.model.meshInstances[1].material.update();
         
        var meshZ15 = meshInstancesZ9[0];
        var materialZ15=meshZ15.material.clone();
        materialZ15.diffuse=this.skinColour[avatarDetails.fskinColorData];
        materialZ15.update();
        meshZ15.material=materialZ15;
        
         // this.female.model.meshInstances[0].material.diffuse=this.skinColour[avatarDetails.fskinColorData];
         // this.female.model.meshInstances[0].material.update();
         
        var meshZ16 = meshInstancesZ9[5];
        var materialZ16=meshZ16.material.clone();
        materialZ16.diffuse=this.skinColour[avatarDetails.fskinColorData];
        materialZ16.update();
        meshZ16.material=materialZ16;
        
         // this.female.model.meshInstances[5].material.diffuse=this.skinColour[avatarDetails.fskinColorData];
         // this.female.model.meshInstances[5].material.update();
        
        var meshInstancesZ10 =  this.fhair[avatarDetails.fhairData].model.meshInstances;
        var meshZ17 = meshInstancesZ10[0];
        var materialZ17=meshZ17.material.clone();
        materialZ17.diffuse=this.hairColour[avatarDetails.fhairColorData];
        materialZ17.update();
        meshZ17.material=materialZ17;
        
         // this.fhair[avatarDetails.fhairData].model.meshInstances[0].material.diffuse=this.hairColour[avatarDetails.fhairColorData];
         // this.fhair[avatarDetails.fhairData].model.meshInstances[0].material.update();
         
        var meshZ18 = meshInstancesZ9[4];
        var materialZ18=meshZ18.material.clone();
        materialZ18.diffuse=this.hairColour[avatarDetails.fhairColorData];
        materialZ18.update();
        meshZ18.material=materialZ18;
        
         //  this.female.model.meshInstances[4].material.diffuse=this.hairColour[avatarDetails.fhairColorData];
         // this.female.model.meshInstances[4].material.update();
        
        var meshZ19 = meshInstancesZ9[7];
        var materialZ19=meshZ19.material.clone();
        materialZ19.diffuse=this.bottomColour[avatarDetails.fbottomColorData];
        materialZ19.update();
        meshZ19.material=materialZ19;
        
       
        
        
         if(avatarDetails.ftopData==0){
                var meshInstancesZ11 =  this.ftop[avatarDetails.ftopData].model.meshInstances;
            var meshZ20 = meshInstancesZ11[0];
            var materialZ20=meshZ20.material.clone();
            materialZ20.diffuse=this.fTopUColour[avatarDetails.ftop1ColorData];
            materialZ20.update();
            meshZ20.material=materialZ20;
             
            // this.ftop[avatarDetails.ftopData].model.meshInstances[0].material.diffuse=this.fTopUColour[avatarDetails.ftop1ColorData];
            // this.ftop[avatarDetails.ftopData].model.meshInstances[0].material.update();
        }else if(avatarDetails.ftopData==1){
             var meshZ21 = meshInstancesZ9[6];
            var materialZ21=meshZ21.material.clone();
            materialZ21.diffuse=this.topCBColour[avatarDetails.ftop2ColorData];
            materialZ21.update();
            meshZ21.material=materialZ21;
            
            // this.female.model.meshInstances[6].material.diffuse=this.topCBColour[avatarDetails.ftop2ColorData];
            // this.female.model.meshInstances[6].material.update();

            var meshInstancesZ12 =  this.ftop[avatarDetails.ftopData].model.meshInstances;
            var meshZ22 = meshInstancesZ12[0];
            var materialZ22=meshZ22.material.clone();
            materialZ22.diffuse=this.topCColour[avatarDetails.ftop2ColorData];
            materialZ22.update();
            meshZ22.material=materialZ22;
            
            // this.ftop[avatarDetails.ftopData].model.meshInstances[0].material.diffuse=this.topCColour[avatarDetails.ftop2ColorData];
            // this.ftop[avatarDetails.ftopData].model.meshInstances[0].material.update();
            
        }else if(avatarDetails.ftopData==2){
            var meshInstancesZ13 =  this.ftop[avatarDetails.ftopData].model.meshInstances;
            var meshZ23 = meshInstancesZ13[0];
            var materialZ23=meshZ23.material.clone();
            materialZ23.diffuse=this.fTopUColour[avatarDetails.ftop3ColorData];
            materialZ23.update();
            meshZ23.material=materialZ23;
            
            
            // this.ftop[avatarDetails.ftopData].model.meshInstances[0].material.diffuse=this.fTopUColour[avatarDetails.ftop3ColorData];
            // this.ftop[avatarDetails.ftopData].model.meshInstances[0].material.update();
        }else if(avatarDetails.ftopData==3){
             var meshZ24 = meshInstancesZ9[6];
            var materialZ24=meshZ24.material.clone();
            materialZ24.diffuse=this.topAColour[avatarDetails.ftop4ColorData];
            materialZ24.update();
            meshZ24.material=materialZ24;
            
            // this.female.model.meshInstances[6].material.diffuse=this.topAColour[avatarDetails.ftop4ColorData];
            // this.female.model.meshInstances[6].material.update();
        }
    }
};

// update code called every frame
NegotiationAvatarUpdate.prototype.update = function(dt) {
    
};

NegotiationAvatarUpdate.prototype.animateAll=function(anim){
    // console.log(this.animateThese[0].animation.play(anim,0.2)+" "+anim);
    for(var i=0;i<this.count;i++)
        this.animateThese[i].animation.play(anim,0.2);
    
};

// swap method called for script hot-reloading
// inherit your script state here
// NegotiationAvatarUpdate.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/