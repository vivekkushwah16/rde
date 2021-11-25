var HotspotSceneChanger = pc.createScript('hotspotSceneChanger');

HotspotSceneChanger.attributes.add("sceneId", {type: "string", default: "0", title: "Next Scene ID"});


HotspotSceneChanger.attributes.add("tellportBody", {type: "entity", title: "Teleport Emissive body"});

HotspotSceneChanger.attributes.add("fadeInCanvas", {type: "entity", title: "2d canvas for fade In Screen"});

HotspotSceneChanger.attributes.add("fadeInTime", {type: "number", title: "Fade In Time"});

HotspotSceneChanger.attributes.add("useUrl", {type: "boolean", title: "use url to open page "});

HotspotSceneChanger.attributes.add('url', {type:'string', title: 'Site Link'});

HotspotSceneChanger.attributes.add('switchOffbody', {type:'boolean', title: 'SwitchOffBody'});

HotspotSceneChanger.attributes.add('blackEmission', {type:'boolean', title: 'EmissionBlackCar'});


HotspotSceneChanger.attributes.add('useReturnPosition', {type:'boolean'});

HotspotSceneChanger.attributes.add('returnPos', {type:'entity'});

HotspotSceneChanger.attributes.add('retunEventName', {type:'string'});

HotspotSceneChanger.attributes.add("logThis", {type: "string"});

// initialize code called once per entity
HotspotSceneChanger.prototype.initialize = function() {
    var self = this; 
    
    this.entity.on('object:interact', this._onInteract, this);
    this.entity.on('object:onhover', this._onHover, this);
    this.entity.on('object:offhover', this._offHover, this);
    
    //  this.entity.on('changeScene', function(){
    //       // window.open(window.location.hostname+self.url, "_blank"); 
    //     if(self.useUrl)
    //     {
    //         var link =  document.createElement('a');
    //         link.href = self.url;
    //         link.target="_top";
    //          document.body.appendChild(link);
    //         link.click();
    //          document.body.removeChild(link);  
    //     }
    //     else
    //     {
    //         self.changeScenes();
    //     }
    // });
    
    this.time = 0;
    
    this.fadeInnow = false;
    
    this.canWork = true;
    
     //--------------change position------------
          
        // if(this.useReturnPosition)
        // {
        //      this.app.on(this.retunEventName, function(){
        //         this.changePos();
        //         }, this);
        // }
};

HotspotSceneChanger.prototype.updateLink=function(temp){
    this.url=""+temp;
    console.log(temp);
};

// update code called every frame
HotspotSceneChanger.prototype.update = function(dt) {
      if(this.fadeInnow)
    {
        
        this.time += dt;
        var duration = this.time / this.fadeInTime;
        
        if(duration >= 1)
        {
            duration = 1;
            this.fadeInnow = false;
            this.entity.fire('changeScene'); 
        }
        
        this.changeOpacity(this.fadeInCanvas, duration);
    }
};


HotspotSceneChanger.prototype._onInteract = function (controller) {
    var self=this;
    //       window.open(self.url, "_blank"); 
    // return;
    if(!this.canWork){ return; }
    
        pc.util.setEntityEmissive(this.entity, new pc.Color(1, 1, 1));  
         
        this.time = 0;
          
        // this.fadeInnow = true;
        
        // this.fadeInCanvas.enabled = true; 
    
        if(self.logThis!==""&&firebaseInstance)
           firebaseInstance.logevent(self.logThis);
    
    // networkInstance.changeVisibility(false);
        console.log("button activated");
    
    //--------------save position------------
          
        // if(this.useReturnPosition)
        // {
        //     this.app.fire("saveCameraPos");
        //     // this.saveReturnPosition();
        // }
       // if(typeof window.parent.startBreakoutCall !== "undefined")
       //      window.parent.startBreakoutCall(self.url);
             
       if(self.url=="library"){
           if(typeof window.parent.switchScene !== "undefined") //REACT_CHANGES
                window.parent.switchScene(self.url);
       }else{
           var tempz="zs3";
           if(self.url!="BreakoutA")
               tempz="zs4";
           if(self.url=="PlenaryA&is3D=true")
                tempz="zs1";
           if(typeof window.parent.connectToVideocallRoom !== "undefined") //REACT_CHANGES
                window.parent.connectToVideocallRoom(tempz);
       }
};



HotspotSceneChanger.prototype._onHover = function () {
        if(this.switchOffbody)
        {
            this.tellportBody.enabled = true;
        }
    
        if(this.blackEmission)
        {
            pc.util.setEntityEmissive(this.tellportBody, new pc.Color(0.3, 0.3, 0.3));
        }else
        {
          pc.util.setEntityEmissive(this.tellportBody, new pc.Color(0, 0.78, 1)); 
        }
};


HotspotSceneChanger.prototype._offHover = function () {
        if(this.switchOffbody)
        {
            this.tellportBody.enabled = false;
        }
        pc.util.setEntityEmissive(this.tellportBody, new pc.Color(1, 1, 1));  
};


HotspotSceneChanger.prototype.changeOpacity = function(entity, value)
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


HotspotSceneChanger.prototype.changeScenes = function() {
    var oldHierarchy = this.app.root.findByName ('Root'); 
    this.loadScene (this.sceneId, function () {
        oldHierarchy.destroy ();
    });
};

HotspotSceneChanger.prototype.loadScene = function (id, callback) {
    var url = id  + ".json";
    
    this.app.loadSceneHierarchy(url, function (err, parent) {
        if (!err) {
            callback(parent);
        } else {
            console.error (err);
        }
    });
};

HotspotSceneChanger.prototype.changePos = function () {
    console.log("changePositionCalled");
};

HotspotSceneChanger.prototype.saveReturnPosition = function () {
    sessionStorage.setItem('ReturnPositionEvent', this.retunEventName);
    console.log("save event name: "+this.retunEventName);
};


