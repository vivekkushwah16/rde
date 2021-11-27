var OnButtonClick = pc.createScript('onButtonClick');

OnButtonClick.attributes.add('name',{type:'string'});
OnButtonClick.attributes.add('url',{type:'string'});
OnButtonClick.attributes.add('type',{type:'string'});
// initialize code called once per entity
OnButtonClick.prototype.initialize = function() {
    var self=this;
    var app=this.app;
    this.entity.element.on('click', function(){
        console.log(pointAndClickInstance.lockedCamera);
        if(pointAndClickInstance.lockedCamera)
            return;
        if(typeof window.parent.openIframe !== "undefined")
            window.parent.openIframe(self.name,self.url,self.type);
    });
    
    this.entity.button.on('hoverstart',function(){
        if(pointAndClickInstance.lockedCamera)
            return;
        self.entity.setLocalScale(1.15,1.15,1.15);
        document.body.style.cursor = "pointer";
         app.fire('stopRaycast');
    });

    this.entity.button.on('hoverend',function(){
        if(pointAndClickInstance.lockedCamera)
            return;
        self.entity.setLocalScale(1,1,1);
        document.body.style.cursor = "context-menu"; 
         app.fire('resumeRaycast');
    });
};

// update code called every frame
OnButtonClick.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// OnButtonClick.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/