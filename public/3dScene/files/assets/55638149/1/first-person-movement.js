var FirstPersonMovement = pc.createScript('firstPersonMovement');

FirstPersonMovement.attributes.add('camera', {
    type: 'entity',
    description: 'Optional, assign a camera entity, otherwise one is created'
});

FirstPersonMovement.attributes.add('power', {
    type: 'number',
    default: 2500,
    description: 'Adjusts the speed of player movement'
});

FirstPersonMovement.attributes.add('lookSpeed', {
    type: 'number',
    default: 0.25,
    description: 'Adjusts the sensitivity of looking'
});

// initialize code called once per entity
FirstPersonMovement.prototype.initialize = function() {
    this.force = new pc.Vec3();
    this.eulers = new pc.Vec3();
    
    var app = this.app;
    var self=this;
    
    // Listen for mouse move events
//     app.mouse.on("mousemove", this._onMouseMove, this);

//     // when the mouse is clicked hide the cursor
//     app.mouse.on("mousedown", function () {
//         app.mouse.enablePointerLock();
//     }, this);            

    // Check for required components
    if (!this.entity.collision) {
        console.error("First Person Movement script needs to have a 'collision' component");
    }

    if (!this.entity.rigidbody || this.entity.rigidbody.type !== pc.BODYTYPE_DYNAMIC) {
        console.error("First Person Movement script needs to have a DYNAMIC 'rigidbody' component");
    }
     this.canUpdate = true;
    this.app.on('lockCamera', function(){
       self.canUpdate = false; 
    });
//     this.app.on('lockMovement', function(){
//        self.canUpdate = false; 
//     });
    
//     this.app.on('unlockMovement', function(){
//             self.canUpdate = true;
//     });
     
    this.app.on('unlockCamera', function(){
            self.canUpdate = true;
    });
    
    // this.app.on('endInteration',function(){
    //      if(typeof window.parent.disablePosterGradient !== "undefined")
    //             window.parent.disablePosterGradient();   
    // });
};

// update code called every frame
FirstPersonMovement.prototype.update = function(dt) {
    var app = this.app;
    if(!this.canUpdate)
        return;

    
    // If a camera isn't assigned from the Editor, create one
    if (!this.camera) {
        this._createCamera();
    }
    
    var force = this.force;

    // Get camera directions to determine movement directions
    var forward = this.camera.forward;
    var right = this.camera.right;
       

    // movement
    var x = 0;
    var z = 0;

      if(app.keyboard.isPressed(pc.KEY_A)||app.keyboard.isPressed(pc.KEY_D)||app.keyboard.isPressed(pc.KEY_W)||app.keyboard.isPressed(pc.KEY_S)|| app.keyboard.isPressed(pc.KEY_LEFT)||app.keyboard.isPressed(pc.KEY_RIGHT)||app.keyboard.isPressed(pc.KEY_UP)||app.keyboard.isPressed(pc.KEY_DOWN))
       ;else{
        if(app.keyboard.wasReleased(pc.KEY_A)||app.keyboard.wasReleased(pc.KEY_D)||app.keyboard.wasReleased(pc.KEY_W)||app.keyboard.wasReleased(pc.KEY_S)|| app.keyboard.wasReleased(pc.KEY_LEFT)||app.keyboard.wasReleased(pc.KEY_RIGHT)||app.keyboard.wasReleased(pc.KEY_UP)||app.keyboard.wasReleased(pc.KEY_DOWN)){
            // myCharUpdateInstance.myChar.anim.setBoolean("walking",false);
            if(networkInstance)
                networkInstance.updatePosition(this.entity.getPosition());
        }
       }
    if (app.keyboard.isPressed(pc.KEY_Q)) {
        this.entity.script.get('cameraLerp').resetPercent();
        var temp=this.camera.getLocalEulerAngles();
        this.camera.setLocalEulerAngles(temp.x,temp.y-=5*dt,temp.z);
        app.fire('endInteraction');   
    }
    if (app.keyboard.isPressed(pc.KEY_E)) {
        this.entity.script.get('cameraLerp').resetPercent();
        var tempz=this.camera.getLocalEulerAngles();
        this.camera.setLocalEulerAngles(tempz.x,tempz.y+=5*dt,tempz.z);
        app.fire('endInteraction');   
    }
    // Use W-A-S-D keys to move player
    // Check for key presses
    if (app.keyboard.isPressed(pc.KEY_A)||app.keyboard.isPressed(pc.KEY_LEFT)) {
        this.entity.script.get('cameraLerp').resetPercent();
        x -= right.x;
        z -= right.z;
        app.fire('endInteraction');   
    }

    if (app.keyboard.isPressed(pc.KEY_D)||app.keyboard.isPressed(pc.KEY_RIGHT)) {
        this.entity.script.get('cameraLerp').resetPercent();
        x += right.x;
        z += right.z;
        app.fire('endInteraction');   
    }

    if (app.keyboard.isPressed(pc.KEY_W)||app.keyboard.isPressed(pc.KEY_UP)) {
        this.entity.script.get('cameraLerp').resetPercent();
        x += forward.x;
        z += forward.z;
        app.fire('endInteraction');   
    }

    if (app.keyboard.isPressed(pc.KEY_S)||app.keyboard.isPressed(pc.KEY_DOWN)) {
        this.entity.script.get('cameraLerp').resetPercent();
        x -= forward.x;
        z -= forward.z;
        app.fire('endInteraction');   
    }

    // use direction from keypresses to apply a force to the character
    if (x !== 0 && z !== 0) {
        this.entity.rigidbody.type=pc.BODYTYPE_DYNAMIC;
        force.set(x, 0, z).normalize().scale(this.power);
        this.entity.rigidbody.applyForce(force);
    }

    // update camera angle from mouse events
    // this.camera.setLocalEulerAngles(this.eulers.y, this.eulers.x, 0);
};

FirstPersonMovement.prototype._onMouseMove = function (e) {
    // If pointer is disabled
    // If the left mouse button is down update the camera from mouse movement
    if (pc.Mouse.isPointerLocked() || e.buttons[0]) {
        this.eulers.x -= this.lookSpeed * e.dx;
        this.eulers.y -= this.lookSpeed * e.dy;
    }            
};

FirstPersonMovement.prototype._createCamera = function () {
    // If user hasn't assigned a camera, create a new one
    this.camera = new pc.Entity();
    this.camera.setName("First Person Camera");
    this.camera.addComponent("camera");
    this.entity.addChild(this.camera);
    this.camera.translateLocal(0, 0.5, 0);
};