var TutorialHandler = pc.createScript('tutorialHandler');

TutorialHandler.attributes.add('pointclick',{type:'entity'});
TutorialHandler.attributes.add('drag',{type:'entity'});
TutorialHandler.attributes.add('move1',{type:'entity'});
TutorialHandler.attributes.add('move',{type:'entity'});
TutorialHandler.attributes.add('hotspot',{type:'entity'});

TutorialHandler.attributes.add('speedin',{type:'number'});
TutorialHandler.attributes.add('speedout',{type:'number'});

TutorialHandler.attributes.add('moveObjs',{type:'entity',array:true});
TutorialHandler.attributes.add('dragObjs',{type:'entity',array:true});
TutorialHandler.attributes.add('arrowObjs',{type:'entity',array:true});


// initialize code called once per entity
TutorialHandler.prototype.initialize = function() {
   this.moveDone=false;
    this.hotspotDone=false;
};

TutorialHandler.prototype.dontStart=function(){
      this.entity.children[0].enabled=false;
};

// update code called every frame
TutorialHandler.prototype.update = function(dt) {
    var self=this;
    
    if(this.moveDone){
        if(!this.hotspotDone&&!this.pointclick.script.pointAndClick.getStalled()){
             for(var i=0;i<this.arrowObjs.length;i++){
                if(this.arrowObjs[i].element.opacity<1)
                    this.arrowObjs[i].element.opacity+=dt*this.speedin;
             }
        }else
            {
                for(var i=0;i<this.arrowObjs.length;i++){
                  if(this.arrowObjs[i].element.opacity>0)
                        this.arrowObjs[i].element.opacity-=dt*this.speedout;
                 }
            }
    }
    
   // console.log(this.pointclick.script.pointAndClick.getMoved());
    if(this.pointclick.script.pointAndClick.getMoved()){
        //this.move.enabled=false;
        for(var i=0;i<this.moveObjs.length;i++){
            if(this.moveObjs[i].element.opacity>0)
                this.moveObjs[i].element.opacity-=dt*this.speedout;
        }
        if(this.moveObjs[0].element.opacity<0.1){
             setTimeout(function(){
                 if(!self.moveDone){
                        self.moveDone=true;
                        self.hotspot.enabled=true;
                        setTimeout(function(){
                            self.hotspotDone=true;
                        },3500);
                    }
             },1000);
        }
    }else if(this.move1.enabled){
        for(var i=0;i<this.moveObjs.length;i++){
            if(this.moveObjs[i].element.opacity<1)
                this.moveObjs[i].element.opacity+=dt*this.speedin;
        }
    }
    
    if(this.pointclick.script.pointAndClick.getDragged())
    {
         for(var i=0;i<this.dragObjs.length;i++){
            if(this.dragObjs[i].element.opacity>0)
                this.dragObjs[i].element.opacity-=dt*this.speedout;
        }
        //this.drag.enabled=false;
        if(this.dragObjs[0].element.opacity<0.1){
            setTimeout(function(){
                self.move1.enabled=true;
            },1000);
        }
    }else{
         for(var i=0;i<this.dragObjs.length;i++){
            if(this.dragObjs[i].element.opacity<1)
                this.dragObjs[i].element.opacity+=dt*this.speedin;
        }
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// TutorialHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/