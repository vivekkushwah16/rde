var HandleAlert = pc.createScript('handleAlert');

HandleAlert.attributes.add("alert",{type:'entity'});
HandleAlert.attributes.add("alertReload",{type:'entity'});
HandleAlert.attributes.add("alertText",{type:'entity'});
HandleAlert.attributes.add("alertButton",{type:'entity'});
HandleAlert.attributes.add("alertButtonReload",{type:'entity'});
// initialize code called once per entity
HandleAlert.prototype.initialize = function() {
    var self=this;
    
    this.app.on('alert',function(txt){
        self.app.fire('stopRaycast');    
        self.app.fire('lockCamera');  

        if(txt==" Disconnected from the server due to internet issue! Please refresh the website."){
            self.alertReload.enabled=true;
        }else{
            self.alert.enabled=true;
            self.alertText.element.text=""+txt;
        }
    });
    
    this.alertButton.element.on('click',function(){
        self.alertButton.element.enabled=false;
        setTimeout(()=>{
            self.alertButton.element.enabled=true;
            self.alert.enabled=false;
            self.app.fire('unlockCamera');    
            self.app.fire('resumeRaycast');        
        },500);
    });

    this.alertButtonReload.element.on('click',function(){
        document.location.href = document.location.href;
        // self.alertButtonReload.element.enabled=false;
        // setTimeout(()=>{
        //     self.alertButtonReload.element.enabled=true;
        //     self.alert.enabled=false;
        //     self.app.fire('unlockCamera');    
        //     self.app.fire('resumeRaycast');        
        // },500);
    });
};

// update code called every frame
HandleAlert.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// HandleAlert.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/