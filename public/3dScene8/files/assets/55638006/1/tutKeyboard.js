var TutKeyboard = pc.createScript('tutKeyboard');

TutKeyboard.attributes.add("fill", {type: "entity", title: "fillImage"});
TutKeyboard.attributes.add("keyUp", {type: "entity"});
TutKeyboard.attributes.add("keyDown", {type: "entity"});
TutKeyboard.attributes.add("keyLeft", {type: "entity"});
TutKeyboard.attributes.add("keyRight", {type: "entity"});
TutKeyboard.attributes.add("tutImage", {type: "entity"});
// initialize code called once per entity
TutKeyboard.prototype.initialize = function() {
     var self=this;
    
    this.fillAmount=0.0;
    this.currFill=0.0;
    this.lerpedPosition = new pc.Vec3 ();
};

// update code called every frame
TutKeyboard.prototype.update = function(dt) {
    
   var app=this.app;
    if (app.keyboard.isPressed(pc.KEY_A)||app.keyboard.isPressed(pc.KEY_LEFT) || app.keyboard.isPressed(pc.KEY_Q)) {
        this.fillAmount+=dt*0.2;
        this.keyLeft.enabled=true;
    }else
        this.keyLeft.enabled=false;

    if (app.keyboard.isPressed(pc.KEY_D)||app.keyboard.isPressed(pc.KEY_RIGHT)) {
        this.fillAmount+=dt*0.2;
        this.keyRight.enabled=true;
    }else
        this.keyRight.enabled=false;

    if (app.keyboard.isPressed(pc.KEY_W)||app.keyboard.isPressed(pc.KEY_UP)) {
       this.fillAmount+=dt*0.2;
        this.keyUp.enabled=true;
    }else
        this.keyUp.enabled=false;

    if (app.keyboard.isPressed(pc.KEY_S)||app.keyboard.isPressed(pc.KEY_DOWN)) {
        this.fillAmount+=dt*0.2;
        this.keyDown.enabled=true;
    }else
        this.keyDown.enabled=false;
    
    if(app.keyboard.wasReleased(pc.KEY_S)||app.keyboard.wasReleased(pc.KEY_DOWN)||app.keyboard.wasReleased(pc.KEY_W)||app.keyboard.wasReleased(pc.KEY_UP)||app.keyboard.wasReleased(pc.KEY_D)||app.keyboard.wasReleased(pc.KEY_RIGHT)||app.keyboard.wasReleased(pc.KEY_A)||app.keyboard.wasReleased(pc.KEY_LEFT))
        this.fillAmount+=1.1;
    
    var temp=this.entity.getLocalPosition();
    // console.log(this.currFill);
    this.currFill=pc.math.lerp(this.currFill,this.fillAmount,dt*3.0);
    if(this.currFill<=1.0){
        
        this.tutImage.element.opacity=1;
        this.tutImage.setLocalScale(1,1,1);
        this.fill.element.width=227.0*this.currFill;//227.0*this.fillAmount;
        
        this.lerpedPosition = new pc.Vec3().lerp(temp,new pc.Vec3(temp.x,0,temp.z),dt*5.0);
        this.entity.setLocalPosition(this.lerpedPosition);
    }else {
        this.keyLeft.enabled=false;
        this.keyRight.enabled=false;
        this.keyDown.enabled=false;
        this.keyUp.enabled=false;
        if(temp.y>-200){
            this.tutImage.element.opacity=pc.math.lerp(this.tutImage.element.opacity,-0.2,dt*4.5);
            var tempScale=pc.math.lerp(this.tutImage.getLocalScale().x,0.7,dt*1.5);
            
            this.tutImage.setLocalScale(tempScale,tempScale,tempScale);
            if(tempScale<0.8){
                this.lerpedPosition = new pc.Vec3().lerp(this.entity.getLocalPosition(),new pc.Vec3(temp.x,-300,temp.z),dt);
                this.entity.setLocalPosition(this.lerpedPosition);
            }
        }else{
             if(typeof window.parent.tutorialThreeComplete !== "undefined")
                window.parent.tutorialThreeComplete();
            if(typeof window.parent.notificationPop !== "undefined")
                window.parent.notificationPop("Awesome! you have completed the tutorial successfully.");
            this.entity.enabled=false;
            window.localStorage.setItem("tutorialDone","true");
        }
    }
    
 
};

// swap method called for script hot-reloading
// inherit your script state here
// TutKeyboard.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/