var TutDragMouse = pc.createScript('tutDragMouse');

TutDragMouse.attributes.add("fill", {type: "entity", title: "fillImage"});
TutDragMouse.attributes.add("tut2", {type: "entity"});
TutDragMouse.attributes.add("tutImage", {type: "entity"});
TutDragMouse.attributes.add("ground", {type: "entity"});
// initialize code called once per entity
TutDragMouse.prototype.initialize = function() {
    var self=this;
    
   if(window.localStorage.getItem("tutorialDone")=="true")
   {
    console.log(window.localStorage.getItem("tutorialDone"));
       this.entity.enabled=false;
   }else{
       
        this.lmbDown = false;
        this.fillAmount=0.0;
        this.currFill=0.0;
        this.addEventCallbacks();
        this.lerpedPosition = new pc.Vec3 ();
       // if(typeof window.parent.tutorialStart !== "undefined")
       //          window.parent.tutorialStart();  
        if(this.ground)
            this.ground.name="round";
   }
    this.on("destroy", function () {
        self.removeEventCallbacks();
    });
};

// update code called every frame
TutDragMouse.prototype.update = function(dt) {
    if(window.localStorage.getItem("firstTimeContinueBtnClicked")!="true"){
        this.fillAmount=0;
        return;
    }
   if(window.localStorage.getItem("tutorialDone")=="true")
       return;
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
            if(typeof window.parent.tutorialOneComplete !== "undefined")
                window.parent.tutorialOneComplete();  
            this.tut2.enabled=true;
            this.entity.enabled=false;
            this.ground.name="Ground";
        }
    }
};

TutDragMouse.prototype.addEventCallbacks = function() {
    if (this.app.mouse) {
        this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
    }
    
    if (this.app.touch) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
        this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
        this.app.touch.on(pc.EVENT_TOUCHCANCEL, this.onTouchCancel, this);   
    }
};

TutDragMouse.prototype.removeEventCallbacks = function() {
    if (this.app.mouse) {
        this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this);
    }
    
    if (this.app.touch) {
        this.app.touch.off(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        this.app.touch.off(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
        this.app.touch.off(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
        this.app.touch.off(pc.EVENT_TOUCHCANCEL, this.onTouchCancel, this);   
    }
};

TutDragMouse.prototype.onMouseDown = function (event) {
    if (event.button === 0) {
        this.lmbDown = true;
    }
};

TutDragMouse.prototype.onMouseUp = function (event) {
    if (event.button === 0) {
        this.lmbDown = false;
       this.fillAmount+=1.1;
    }
};

TutDragMouse.prototype.onMouseMove = function (event) {    
    if (!this.lmbDown)
        return;
    
   this.fillAmount+=0.02;
   // console.log(this.fillAmount);
};


TutDragMouse.prototype.onTouchStart = function(event) {
    if (event.touches.length == 1) {
        this.lmbDown = true;
    }
    event.event.preventDefault();
};

TutDragMouse.prototype.onTouchEnd = function(event) {
    if (event.touches.length === 0) {
        this.lmbDown = false;
        this.fillAmount+=1.1;
    } else if (event.touches.length == 1) {
        
    }
};

TutDragMouse.prototype.onTouchMove = function(event) {
    if (event.touches.length == 1) {
        this.fillAmount+=0.02;
    }
};

TutDragMouse.prototype.onTouchCancel = function(event) {
    this.lmbDown = false;
};
// swap method called for script hot-reloading
// inherit your script state here
// TutDragMouse.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/