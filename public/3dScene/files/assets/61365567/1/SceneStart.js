var SceneStart = pc.createScript('sceneStart');

SceneStart.attributes.add('start2btn', {type:'entity', title: 'Start button entity'});
SceneStart.attributes.add('startbtn', {type:'entity', title: 'Start button entity'});

SceneStart.attributes.add('instruction', {type:'entity', title: 'instruction entity'});

SceneStart.attributes.add('startScreen', {type:'entity', title: 'Start Screen entity'});

SceneStart.attributes.add('MenuScreen', {type:'entity', title: 'Menu Screen entity'});

SceneStart.attributes.add('fadeOutTime', {type:'number', title: 'Fade out time'});

var fadenow = false;

var __SceneInitalized = false;

SceneStart.prototype.initialize = function() {
    var self = this;
     if(app.mouse)
       {
           app.mouse.disablePointerLock();
         //  console.log(app.mouse.isPointerLocked());
       }
    this.app.fire('lockCamera');
    self.MenuScreen.enabled = false;
    this.startScreen.enabled = true;
    
    this.time = this.fadeOutTime;
        this.start2btn.element.on('click', function() {
        self.app.fire('unlockCamera');
        self.MenuScreen.enabled = true;
        fadenow = true;
        self.startbtn.enabled = false;
        
        if(self.app.mouse)
        {
          //   self.app.mouse.enablePointerLock ();      
        }  
        
        __SceneInitalized = true;
        var cw = document.getElementById("cometchat__widget");
        var lb = document.querySelector(".LiveChatRequestBtn");
        var rc = document.querySelector(".LiveChatRequestContainer");
        
        if(cw){
            cw.style.display = 'block';
        }
        if(lb){
            lb.style.display = 'block';
        }
        if(rc){
            rc.style.display = 'block';
        }
        
    });
    this.startbtn.element.on('click', function() {
        self.app.fire('unlockCamera');
        self.MenuScreen.enabled = true;
        fadenow = true;
        self.startbtn.enabled = false;
        
        if(self.app.mouse)
        {
          //   self.app.mouse.enablePointerLock ();      
        }  
        
        __SceneInitalized = true;
        var cw = document.getElementById("cometchat__widget");
        var lb = document.querySelector(".LiveChatRequestBtn");
        var rc = document.querySelector(".LiveChatRequestContainer");
        
        if(cw){
            cw.style.display = 'block';
        }
        if(lb){
            lb.style.display = 'block';
        }
        if(rc){
            rc.style.display = 'block';
        }
        
    });
    
};

SceneStart.prototype.update = function(dt){
    if(!fadenow)
    {
        return;
    }
     this.time -= dt;
    
    var duration = this.time / this.fadeOutTime;
    if(duration <= 0)
    {
       duration = 0;
        fadenow = false;
    }
    this.fadeOut(this.startScreen, duration);
    
};

SceneStart.prototype.fadeOut = function(entity, value)
{
        var children = entity.children;//returns array
        
        for (var i = 0; i < children.length; ++i) 
        {
            if(children[i].element)
            {
                children[i].element.opacity = value;
            }
            this.fadeOut(children[i]);
        }
    
    if(value === 0)
    {
        entity.enabled = false;
    }
};