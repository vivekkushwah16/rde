var TutClickMove = pc.createScript('tutClickMove');


TutClickMove.attributes.add("fill", {type: "entity", title: "fillImage"});
TutClickMove.attributes.add("tut3", {type: "entity"});
TutClickMove.attributes.add("tutImage", {type: "entity"});
// initialize code called once per entity
TutClickMove.prototype.initialize = function() {
    var self=this;
    
    this.fillAmount=0.0;
    this.currFill=0.0;
    this.lerpedPosition = new pc.Vec3 ();
    
    this.app.on("endInteraction", function(){
        self.fillAmount+=1.1;
    });
    
};

// update code called every frame
TutClickMove.prototype.update = function(dt) {
    var temp=this.entity.getLocalPosition();
    this.currFill=pc.math.lerp(this.currFill,this.fillAmount,dt*3.0);
    if(this.currFill<=1.0){
        this.tutImage.element.opacity=1;
        this.tutImage.setLocalScale(1,1,1);
         this.fill.element.width=227.0*this.currFill;//227.0*this.fillAmount;
        this.lerpedPosition = new pc.Vec3().lerp(temp,new pc.Vec3(temp.x,0,temp.z),dt*5.0);
        this.entity.setLocalPosition(this.lerpedPosition);
    }else {
        if(temp.y>-200){
            this.tutImage.element.opacity=pc.math.lerp(this.tutImage.element.opacity,-0.2,dt*4.5);
            var tempScale=pc.math.lerp(this.tutImage.getLocalScale().x,0.7,dt*1.5);
            
            this.tutImage.setLocalScale(tempScale,tempScale,tempScale);
            if(tempScale<0.8){
                this.lerpedPosition = new pc.Vec3().lerp(this.entity.getLocalPosition(),new pc.Vec3(temp.x,-300,temp.z),dt);
                this.entity.setLocalPosition(this.lerpedPosition);
            }
        }else{
            if(typeof window.parent.tutorialTwoComplete !== "undefined")
                window.parent.tutorialTwoComplete();  
            this.tut3.enabled=true;
            this.entity.enabled=false;
            window.localStorage.setItem("tutorialDone","true");
        }
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// TutClickMove.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/