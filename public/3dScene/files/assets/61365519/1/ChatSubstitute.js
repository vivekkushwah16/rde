var ChatSubstitute = pc.createScript('chatSubstitute');

ChatSubstitute.attributes.add('lobbyCam',{type:'entity'});
ChatSubstitute.attributes.add('logout',{type:'entity'});
ChatSubstitute.attributes.add("userCount",{type:'entity'});

var chatSub=null;
// initialize code called once per entity
ChatSubstitute.prototype.initialize = function() {
    chatSub=this;
    this.lobbyCam.camera.enabled = true;
     this.logout.element.on('click',()=>{
        firebaseInstance.logout();  
    });
};

// update code called every frame
ChatSubstitute.prototype.update = function(dt) {
    var app=this.app;
    if (app.keyboard.isPressed(pc.KEY_CONTROL)&&app.keyboard.isPressed(pc.KEY_ALT)&&app.keyboard.isPressed(pc.KEY_F)) {
        this.entity.script.fps.enabled=true;
    }
     if (app.keyboard.isPressed(pc.KEY_CONTROL)&&app.keyboard.isPressed(pc.KEY_ALT))
        if(app.keyboard.wasPressed(pc.KEY_U)) {
        chatSub.userCount.enabled=!chatSub.userCount.enabled;
        var debuggerz=window.parent.document.getElementById("debugger");
            if(debuggerz){
                debuggerz.style.display=chatSub.userCount.enabled?"block":"none";
            }
        }
    
};

window.parent.showUserCount=function(flag){
    chatSub.userCount.enabled=flag;
};

// swap method called for script hot-reloading
// inherit your script state here
// ChatSubstitue.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/