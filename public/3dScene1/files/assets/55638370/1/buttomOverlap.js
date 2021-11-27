var ButtomOverlap = pc.createScript('buttomOverlap');

ButtomOverlap.attributes.add("buttons",{type:'entity',array:true});

// initialize code called once per entity
ButtomOverlap.prototype.initialize = function() {
    var self=this;
    
    for(var i=0;i< this.buttons.length;i++){
        if(this.buttons[i])
        {
            this.buttons[i].element.on('mouseenter', this.onEnter, this);
            this.buttons[i].element.on('mouseleave', this.onLeave, this);   
            this.buttons[i].element.on("click",function(){
               // this.app.fire('disableButts');
            });
        }
    }
    
    this.app.on('disableButts',function(temp){
        // console.log('butts disabled');
        if(temp){
          for(var i=0;i< self.buttons.length;i++){
              for(var j=0;j<temp.length;j++){
                  if(self.buttons[i]===temp[j])
                    continue;
                  
                   if(self.buttons[i])
                    {
                        self.buttons[i].enabled=false;
                    }
              }
          }
        }else
            {
                for(var i=0;i< self.buttons.length;i++){
                   if(self.buttons[i])
                    {
                        self.buttons[i].enabled=false;
                    }
                }
            }
    });
    
    this.app.on('enableButts',function(temp){
        
        if(temp){
            for(var i=0;i< self.buttons.length;i++){
                for(var j=0;j<temp.length;j++){

                  if(self.buttons[i]===temp[j])
                    continue;

                   if(self.buttons[i])
                    {
                        self.buttons[i].enabled=true;
                    }
                 }
            }
        }else{
            
          for(var i=0;i< self.buttons.length;i++){
               if(self.buttons[i])
                {
                    self.buttons[i].enabled=true;
                }
          }
        }
    });
    
 /*   this.islocked=false;
    this.waslocked=false;
    
    this.app.on('lockCamera',function(){
        self.islocked=true;
    });
    
     this.app.on('unlockCamera',function(){
        self.islocked=false;
    });*/
};

// update code called every frame
ButtomOverlap.prototype.update = function(dt) {
    
};

ButtomOverlap.prototype.onEnter = function (event) {
    this.hovered = true;
    
    this.app.fire('stopRaycast');
    // if(this.islocked){
    //     this.waslocked=true;
    // }else
    //     this.waslocked=false;
   // this.entity.script.pointAndClick.enabled=false;
  //  this.app.fire('lockCamera');
    // console.log('enter');
    // set our cursor to a pointer
    document.body.style.cursor = 'pointer';
};

// When the cursor leaves the element assign the original texture
ButtomOverlap.prototype.onLeave = function (event) {
    this.hovered = false;
    this.app.fire('resumeRaycast');
  //  setInterval(function(){
  //  if(!this.waslocked)
      //  this.app.fire('unlockCamera');
  // this.entity.script.pointAndClick.enabled=true;
//    },1000);
    
    // console.log('exit');
    // go back to default cursor
    document.body.style.cursor = 'grab';
};
// swap method called for script hot-reloading
// inherit your script state here
// ButtomOverlap.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/