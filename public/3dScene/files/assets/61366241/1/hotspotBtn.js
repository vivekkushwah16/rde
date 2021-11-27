var HotspotBtn = pc.createScript('hotspotBtn');

HotspotBtn.attributes.add('reachLocation', { type: 'entity'});
HotspotBtn.attributes.add('signal', { type: 'entity'});
HotspotBtn.attributes.add('groupHandler', { type: 'entity'});
HotspotBtn.attributes.add('index', { type: 'number'});
HotspotBtn.attributes.add('hoverStart', { type: 'asset'});
HotspotBtn.attributes.add('hoverEnd', { type: 'asset'});
HotspotBtn.attributes.add('playAudio', { type: 'string'});
HotspotBtn.attributes.add('isPoster', { type: 'boolean',default:true});
HotspotBtn.attributes.add('rotate', { type: 'boolean',default:true});
// initialize code called once per entity
HotspotBtn.prototype.initialize = function() {
    var self=this;
    var app=this.app; 
    var timerout=null;
    
    this.entity.on("object:interact",function(){
        if(pointAndClickInstance.lockedCamera)
            return;
        clearTimeout(timerout);
        if(self.signal)
            self.signal.fire('clicked');
        
        if(typeof window.parent.playSoundOneShot !== "undefined")
            window.parent.playSoundOneShot("secondaryBtn.wav");  
        
        if(self.playAudio!=="")
         if(typeof window.parent.playAudioVoiceover !== "undefined")
            setTimeout(function(){ window.parent.playAudioVoiceover(self.playAudio);},300);  
        
          if(self.isPoster)
            if(typeof window.parent.enablePosterGradient !== "undefined")
                window.parent.enablePosterGradient();  
        
        if(self.reachLocation){
            
            if(!self.rotate){
                app.fire("endInteraction");
                   cameraLerpInstance.updatePos(self.reachLocation.getPosition());
            }else{
                setTimeout(function(){
                    app.fire('lockCamera');  
                    app.fire("lockMovement");
                    cameraLerpInstance.updatePos(self.reachLocation.getPosition());
                    cameraLerpInstance.updateRot(self.reachLocation.getRotation());
                },50);
                 timerout=setTimeout(function(){
                   //self.back.enabled=true;
                    cameraLerpInstance.endRot();
                    app.fire('unlockCamera');  
                },2500);
            }
        }
        
        if(self.groupHandler)
            self.groupHandler.script.hotspotGroupHandler.updateValue(self.index);
    });
    if(this.entity.button){
    this.entity.button.on('click', function(){
        if(pointAndClickInstance.lockedCamera)
            return;
        clearTimeout(timerout);
        if(self.signal)
            self.signal.fire('clicked');
        
        if(typeof window.parent.playSoundOneShot !== "undefined")
            window.parent.playSoundOneShot("secondaryBtn.wav");  
        
        if(self.playAudio!=="")
         if(typeof window.parent.playAudioVoiceover !== "undefined")
            setTimeout(function(){ window.parent.playAudioVoiceover(self.playAudio);},300);  
        
          if(self.isPoster)
            if(typeof window.parent.enablePosterGradient !== "undefined")
                window.parent.enablePosterGradient();  
        
        if(self.reachLocation){
            
            if(!self.rotate){
                app.fire("endInteraction");
                   cameraLerpInstance.updatePos(self.reachLocation.getPosition());
            }else{
                setTimeout(function(){
                    app.fire('lockCamera');  
                    app.fire("lockMovement");
                    cameraLerpInstance.updatePos(self.reachLocation.getPosition());
                    cameraLerpInstance.updateRot(self.reachLocation.getRotation());
                },50);
                 timerout=setTimeout(function(){
                   //self.back.enabled=true;
                    cameraLerpInstance.endRot();
                    app.fire('unlockCamera');  
                },2500);
            }
        }
        
        if(self.groupHandler)
            self.groupHandler.script.hotspotGroupHandler.updateValue(self.index);
        
    });
    
    this.entity.button.on('hoverstart',function(){
        if(pointAndClickInstance.lockedCamera)
            return;
        self.entity.setLocalScale(1.1,1.1,1.1);
        document.body.style.cursor = "pointer";
        if(self.hoverStart)
            self.entity.element.texture=self.hoverStart.resource;
        if(self.entity.script.spin)
            self.entity.script.spin.enabled=true;
       // app.fire('stopRaycast');
    });

    this.entity.button.on('hoverend',function(){
        if(pointAndClickInstance.lockedCamera)
            return;
        self.entity.setLocalScale(1,1,1);
        document.body.style.cursor = "context-menu"; 
        if(self.hoverStart)
             self.entity.element.texture=self.hoverEnd.resource;
        if(self.entity.script.spin)
            self.entity.script.spin.enabled=false;
      //  app.fire('resumeRaycast');
    });
    }
};

// update code called every frame
HotspotBtn.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// HotspotBtn.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/