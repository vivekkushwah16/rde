var MenuButtonService = pc.createScript('menuButtonService');

MenuButtonService.attributes.add("fadeInCanvas", {type: "entity", title: "2d canvas for fade In Screen"});

MenuButtonService.attributes.add("fadeInTime", {type: "number", title: "Fade In Time"});

MenuButtonService.prototype.initialize = function() {
    var self = this;
    
    this.entity.element.on("click", function(){
      console.log("Menu Button clicked");  
    });
    
    this.url = "";
    
    this.time = 0;
    
    this.fadeInnow = false;
    
    this.canWork = true;
    
    this.app.on("changeScene", function(_url){
        if(self.canWork)
        {
            self.url = _url;
            self.time = 0;
            self.fadeInnow = true;
            self.fadeInCanvas.enabled = true;    
            self.canWork = false;
            self.app.fire("saveCameraPos");
        }
    });
    
};

MenuButtonService.prototype.update = function(dt) {
      if(this.fadeInnow)
    { 
        this.time += dt;
        var duration = this.time / this.fadeInTime;
        
        if(duration >= 1)
        {
            duration = 1;
            this.fadeInnow = false;
            this.changeScene(); 
        }
        
         this.fadeInCanvas.element.opacity = duration;
    }
};

MenuButtonService.prototype.changeScene = function() {
    console.log(this.url);
    var link =  document.createElement('a');
    link.href = this.url;
    link.target="_top";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); 
};
