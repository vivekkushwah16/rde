var PointAndClick = pc.createScript('pointAndClick');

PointAndClick.attributes.add('cameraNearClip', {type: 'entity', title: 'Camera NearClip'});
PointAndClick.attributes.add('cameraFarClip', {type: 'entity', title: 'Camera FarClip'});
PointAndClick.attributes.add('cameraEntity', {type: 'entity', title: 'Camera Entity'});
PointAndClick.attributes.add('playerEntity', {type: 'entity', title: 'Player Entity'});
PointAndClick.attributes.add('playerDummy', {type: 'entity', title: 'Player Dummy'});
PointAndClick.attributes.add('moveInvalidEntity', {type: 'entity', title: 'Move Entity'});
PointAndClick.attributes.add('moveToEntity', {type: 'entity', title: 'Move Entity'});
PointAndClick.attributes.add('dir', {type: 'entity', title: 'Dir Entity'});
PointAndClick.attributes.add('playerSpeed', {type: 'number', default: 1, title: 'Player Speed'});
PointAndClick.attributes.add('doFullScreen', {type: 'boolean'});

let pointAndClickInstance=null;
// initialize code called once per entity
PointAndClick.prototype.initialize = function() {
    var self=this;
    pointAndClickInstance=this;
    
    if(this.doFullScreen){
        this.app.enableFullscreen(null, function () {
                // console.log('Now fullscreen');
            }, function () {
                // console.log('Something went wrong!');
        });
    }
    
    this.originalY=this.playerEntity.getPosition().y;
    
    this.groundShape = new pc.BoundingBox(new pc.Vec3(0, 0, 0), new pc.Vec3(10, 0.001, 10));
    
    this.downPos=new pc.Vec2();
    this.direction = new pc.Vec3();
    this.distanceToTravel = 0;
    this.targetPosition = new pc.Vec3();
    this.targetPosition=this.playerEntity.getPosition();
    
    
    // Register the mouse down and touch start event so we know when the user has clicked
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);

    if (this.app.touch) {
        this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
        this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
    }
    
    this.highlightedObj=this.cameraEntity;
    
    this.canUpdate = true;
       this.lockedCamera = false;
    
    this.app.on('lockCamera', function(){
       self.canUpdate = false; 
        self.lockedCamera=true;
       self.moveToEntity.enabled=false;
       // console.log("can not use point and click now");
    });
    
    this.app.on('unlockCamera', function(){
     //   setTimeout(function(){
            self.canUpdate = true;
        self.lockedCamera=false;
            self.moveToEntity.enabled=true;
            self.resetTargetPos();
            // console.log("can use point and click now "+self.canUpdate);
     //   },500);
    });
    
    this.app.on("stopRaycast", function(){
        self.canUpdate = false; 
       self.moveToEntity.enabled=false;
    });
    
    this.app.on("resumeRaycast", function(){
        self.canUpdate = true;
            self.moveToEntity.enabled=true;
            self.resetTargetPos();
    });
    
    this.isMouseDown=false;
    this.moving=false;
};

PointAndClick.prototype.getStalled = function() {
    return PointAndClick.hasStalled;
};

PointAndClick.prototype.getDragged = function() {
    return PointAndClick.hasDragged;
};

PointAndClick.prototype.getMoved = function() {
    return PointAndClick.hasMoved;
};

PointAndClick.hasStalled=false;
PointAndClick.hasDragged=false;
PointAndClick.hasMoved=false;
PointAndClick.otherObjChat=null;
PointAndClick.newPosition = new pc.Vec3();
this.movementDuration = 3; //The duration (Secs)
this.time =0;
// update code called every frame
PointAndClick.prototype.postUpdate = function(dt) {
    if(!this.canUpdate) { return; }
    
    var xx=this.playerEntity.getPosition();
    xx.y=0;
    var yy=this.targetPosition;
    yy.y=0;
    this.direction.sub2(yy, xx);
    this.distanceToTravel = this.direction.length();
    //console.log(this.distanceToTravel);
   /* console.log(this.distanceToTravel);
    // console.log("camera: "+  this.cameraEntity.getLocalEulerAngles());
    // console.log( "player: "+ this.playerEntity.getLocalEulerAngles());
    if (this.direction.lengthSq() > 0) {
        // Move in the direction at a set speed
        var d = this.playerSpeed * dt;
        var newPosition = PointAndClick.newPosition;
       
        newPosition.copy(this.direction).scale(d);
        newPosition.add(this.playerDummy.getPosition());        
        this.playerDummy.setPosition(newPosition);     

        this.distanceToTravel -= d;
        
        if( PointAndClick.lookAtIt === true ){
            this.cameraEntity.lookAt(PointAndClick.lookAtPos);
        }
            
        // If we have reached our destination, clamp the position 
        // and reset the direction
        if (this.distanceToTravel <= 0) {
            this.time=0;
            // var pl=(this.playerEntity.getLocalEulerAngles());
            //  var cam=(this.cameraEntity.getLocalEulerAngles());
            // this.playerEntity.setLocalEulerAngles(new pc.Vec3(pl.x+cam.x,pl.y+cam.y,pl.z+cam.z));
            
          //  this.cameraEntity.setLocalEulerAngles(new pc.Vec3(0,0,0));
            this.playerDummy.setPosition(this.targetPosition);
            this.direction.set(0, 0, 0);
        }
    }*/
};


PointAndClick.prototype.movePlayerTo = function (worldPosition) {
    this.targetPosition.copy(worldPosition);
        
    // Assuming we are travelling on a flat, horizontal surface, we make the Y the same
    // as the player
 /*   
    if(!PointAndClick.lookAtIt)
        this.targetPosition.y = this.originalY;

    this.distanceTravelled = 0;
    
    // Work out the direction that the player needs to travel in
    this.direction.sub2(this.targetPosition, this.playerDummy.getPosition());
    
    // Get the distance the player needs to travel for
    this.distanceToTravel = this.direction.length();
    if (this.distanceToTravel > 0) {
        // Ensure the direction is a unit vector
        this.direction.normalize();

     //   this.playerEntity.lookAt(this.targetPosition);
    } else {
        this.direction.set(0, 0, 0);
    }*/
};

PointAndClick.prototype.onMouseDown = function(event) {
    if (event.button == pc.MOUSEBUTTON_LEFT) { 
        this.isMouseDown=true;
       this.downPos=new pc.Vec2(event.x,event.y);
       //  this.cameraEntity.setLocalEulerAngles(new pc.Vec3(0,0,0));
        // console.log("rotaion happened");
    }
    if(!this.canUpdate) {return; }
      document.body.style.cursor = 'grabbing';
};

PointAndClick.prototype.onMouseUp = function(event) {
    if (event.button == pc.MOUSEBUTTON_LEFT) {
        var sub= new pc.Vec2();
        this.isMouseDown=false;
        sub.sub2(this.downPos, new pc.Vec2(event.x,event.y));
     //   console.log(event);
        if(sub.length()<1){
            // if (this.distanceToTravel <= 0.6) 
                this.doRayCast(event);
        }
    }
    if(!this.canUpdate) {return; }
     document.body.style.cursor = 'grab';
};

PointAndClick.prototype.onMouseMove = function(event) {
 //   if (event.button == pc.MOUSEBUTTON_LEFT) 
    if (this.distanceToTravel <= 0.6) 
         this.moving=false;
    else
         this.moving=true;
    
        this.doRayCastForMouse(event);
};

PointAndClick.touchmoved=false;
PointAndClick.prototype.onTouchStart = function (event) {
    // On perform the raycast logic if the user has one finger on the screen
    if (event.touches.length == 1) {
        PointAndClick.touchmoved=false;
        // this.cameraEntity.setLocalEulerAngles(new pc.Vec3(0,0,0));
        this.downPos=new pc.Vec2(event.touches[0].x,event.touches[0].y);
      //  this.doRayCast(event.touches[0]);
        event.event.preventDefault();
    }
};

PointAndClick.prototype.onTouchMove = function (event) {
    // On perform the raycast logic if the user has one finger on the screen
   // if (this.distanceToTravel <= 0.6) 
     {
         var sub= new pc.Vec2();
        
        sub.sub2(this.downPos, new pc.Vec2(event.touches[0].x,event.touches[0].y));
      //  console.log(sub.length());
        if(sub.length()>0.5)
           PointAndClick.touchmoved=true;
        
         PointAndClick.hasDragged=true;
        
         if (this.distanceToTravel <= 0.6) 
            this.doRayCastForMouse(event.touches[0]);
        event.event.preventDefault();
    }    
};

PointAndClick.prototype.onTouchEnd = function (event) {
  //   console.log("end"+event.touches.length);
    // On perform the raycast logic if the user has one finger on the screen
  //  if (event.touches.length == 1) 
    
      if(!PointAndClick.touchmoved)
            this.doRayCast(this.downPos);
      else
           PointAndClick.touchmoved=false;
        
        event.event.preventDefault();
    
};

PointAndClick.prototype.resetTargetPos=function(){
  this.targetPosition=this.playerEntity.getPosition();
};

PointAndClick.ray = new pc.Ray();
PointAndClick.lookAtIt = false;
PointAndClick.lookAtPos =  new pc.Vec3();
PointAndClick.hitPosition = new pc.Vec3();

PointAndClick.prototype.doRayCast = function (screenPosition) {
    if(!this.canUpdate)
    {
        return;
    }
        // Initialise the ray and work out the direction of the ray from the a screen position
  
    var from = this.cameraEntity.getPosition();
    var hitPosition = PointAndClick.hitPosition;
    // The pc.Vec3 to raycast to (the click position projected onto the camera's far clip plane)
    var to = this.cameraEntity.camera.screenToWorld(screenPosition.x, screenPosition.y, this.cameraFarClip.camera.farClip);

    // Raycast between the two points and return the closest hit result
    var result = this.app.systems.rigidbody.raycastFirst(from, to);

    // If there was a hit, store the entity
        if (result) {
        var hitEntity = result.entity;
        //console.log('You selected ' + result.point);
        //console.log('You selected ' + hitEntity.name);
        if(hitEntity.tags.has('stall')){
            hitEntity.fire("object:onhover");
            
            hitEntity.fire("object:interact");
            
            PointAndClick.hasStalled=true;
             PointAndClick.hasMoved=true;
            PointAndClick.hasDragged=true;
             if(PointAndClick.otherObjChat!==null){
               // console.log(PointAndClick.otherObjChat);
                PointAndClick.otherObjChat.script.otherHandler.end();
                PointAndClick.otherObjChat=null;
            }
            setTimeout(function(){
                hitEntity.fire("object:offhover");
            },1000);
        }
        else if(hitEntity.tags.has("other")){
            //console.log("Boxed");
            PointAndClick.lookAtPos = result.entity.getPosition();
            PointAndClick.hasMoved=true;
            
            PointAndClick.lookAtIt=true;
          // hitPosition=result.entity.script.get('specificPos').position();
             if(PointAndClick.otherObjChat&&PointAndClick.otherObjChat.script.otherHandler){
               // console.log(PointAndClick.otherObjChat);
                PointAndClick.otherObjChat.script.otherHandler.end();
                PointAndClick.otherObjChat=null;
            }
            result.entity.script.otherHandler.initiate();
            console.log(PointAndClick.otherObjChat);
            PointAndClick.otherObjChat=hitEntity;
            console.log(PointAndClick.otherObjChat);
            //this.playerEntity.setPosition(hitPosition);
            //console.log(PointAndClick.lookAtPos);
            //this.movePlayerTo(hitPosition);
        }
        else if(hitEntity.name=="Ground"){
            PointAndClick.lookAtIt=false;
            hitPosition=result.point;
            this.moveToEntity.setPosition(hitPosition);
            this.targetPosition=hitPosition;
            var temp=hitPosition;
            temp.y= this.originalY;
            // console.log(temp.y);
            PointAndClick.hasMoved=true;
            this.playerEntity.script.cameraLerp.updatePos(temp);
           // console.log("asdasd"+PointAndClick.otherObjChat);
          
            this.app.fire("beganGame");
            this.app.fire("endInteraction");
            this.entity.script.network.updatePosition(hitPosition);
            //this.movePlayerTo(hitPosition);
            
            this.moveToEntity.children[0].setLocalScale(1,1,1);
            this.moveToEntity.children[0].enabled=true;
              if(PointAndClick.otherObjChat!==null){
               // console.log(PointAndClick.otherObjChat);
                if(PointAndClick.otherObjChat.script)
                    if(PointAndClick.otherObjChat.script.otherHandler)
                        PointAndClick.otherObjChat.script.otherHandler.end();
                PointAndClick.otherObjChat=null;
            }
        }else{
            this.dir.setPosition(hitPosition);
        }
    }    
};

PointAndClick.prototype.doRayCastForMouse = function (screenPosition) {
    if(!this.canUpdate)
    {
        return;
    }
    
    // Initialise the ray and work out the direction of the ray from the a screen position
  
    var from = this.cameraEntity.getPosition();
    var hitPosition = PointAndClick.hitPosition;
    // The pc.Vec3 to raycast to (the click position projected onto the camera's far clip plane)
    var to = this.cameraEntity.camera.screenToWorld(screenPosition.x, screenPosition.y, this.cameraFarClip.camera.farClip);

    // Raycast between the two points and return the closest hit result
    var result = this.app.systems.rigidbody.raycastFirst(from, to);

    // If there was a hit, store the entity
    if (result) {
        var hitEntity = result.entity;
        
     //   console.log('You selected ' + result.point);
        // console.log('You selected ' + hitEntity.name);
        
        if(this.isMouseDown){
            PointAndClick.hasDragged=true;
        }
        hitPosition=result.point;
        if(hitEntity.tags.has('stall')){
            if(!this.isMouseDown){
                if(this.highlightedObj!=hitEntity){

                    this.highlightedObj.fire("object:offhover");
                    hitEntity.fire("object:onhover");
                    this.highlightedObj=hitEntity;
                    this.moveToEntity.enabled=false;
                    document.body.style.cursor = 'pointer';
                }
            }
        }else if(hitEntity.tags.has('other')){
            if(!this.isMouseDown){
                if(this.highlightedObj!=hitEntity){

                    this.highlightedObj.fire("object:offhover");
                    hitEntity.fire("object:onhover");
                    this.highlightedObj=hitEntity;
                    this.moveToEntity.enabled=false;
                    
                    document.body.style.cursor = 'pointer';
                }
            }
        }else if(hitEntity.name=="Ground"){
            if(!this.moving){
                if(!this.isMouseDown){
                    this.highlightedObj.fire("object:offhover");
                     this.highlightedObj=hitEntity;
                    this.moveToEntity.setPosition(hitPosition);
                    this.moveToEntity.enabled=true;
                    document.body.style.cursor = 'pointer';
                }else
                    {
                         this.moveToEntity.enabled=false;
                    }
            }
        }else
        { 
            if(!this.isMouseDown){
                this.highlightedObj.fire("object:offhover");
                 this.highlightedObj=hitEntity;
                this.dir.setPosition(hitPosition);
                 this.moveToEntity.enabled=false;
                document.body.style.cursor = 'grab';
            }
        }
      //  this.movePlayerTo(hitPosition);
          this.moveInvalidEntity.enabled=false;
    }else{
       //  document.body.style.cursor = 'grab';
       
        if(!this.isMouseDown){
          this.doRayCastForInvalid(event);
          this.moveToEntity.enabled=false;
          document.body.style.cursor = 'grab';
        }else
            {
                  this.moveToEntity.enabled=false;
                  this.moveInvalidEntity.enabled=false;
            }
    }
};

PointAndClick.prototype.doRayCastForInvalid = function (screenPosition) {
    if(!this.canUpdate)
    {
        return;
    }
    // Initialise the ray and work out the direction of the ray from the a screen position
  
     var from = this.cameraEntity.getPosition();
    var hitPosition = PointAndClick.hitPosition;
    // The pc.Vec3 to raycast to (the click position projected onto the camera's far clip plane)
    var to = this.cameraEntity.camera.screenToWorld(screenPosition.x, screenPosition.y, this.cameraNearClip.camera.farClip);

    // Raycast between the two points and return the closest hit result
    var result = this.app.systems.rigidbody.raycastFirst(from, to);

    // If there was a hit, store the entity
    if (result) {
        var hitEntity = result.entity;
     //   console.log('You selected ' + result.point);
       // console.log('You selected ' + hitEntity.name);
        
        hitPosition=result.point;
        if(hitEntity.tags.has('stall')){
           /* if(this.highlightedObj!=hitEntity){
                
                this.highlightedObj.fire("object:offhover");
                hitEntity.fire("object:onhover");
                this.highlightedObj=hitEntity;
                  this.moveToEntity.enabled=false;
            }*/
        }else if(hitEntity.name=="Ground"){
            
          /*  this.highlightedObj.fire("object:offhover");
             this.highlightedObj=hitEntity;*/
            this.moveInvalidEntity.setPosition(hitPosition);
            this.moveInvalidEntity.enabled=true;
        }else
        { 
           /* this.highlightedObj.fire("object:offhover");
             this.highlightedObj=hitEntity;
            this.dir.setPosition(hitPosition);
             this.moveToEntity.enabled=false;*/
        }
      //  this.movePlayerTo(hitPosition);
    }
};