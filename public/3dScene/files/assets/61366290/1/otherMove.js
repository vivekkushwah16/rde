var OtherMove = pc.createScript('otherMove');
OtherMove.attributes.add('cameraEntity', {type: 'entity', title: 'Camera Entity'});
OtherMove.attributes.add('playerEntity', {type: 'entity', title: 'Player Entity'});
OtherMove.attributes.add('playerSpeed', {type: 'number', default: 0, title: 'Player Speed'});
OtherMove.attributes.add("y", {type: "number", default: -2, title: "y"});
OtherMove.attributes.add("duration", {type: "number", default: 15, title: "Duration (Secs)"});
OtherMove.attributes.add("randomiseMovement", {type: "boolean"});
OtherMove.attributes.add('child', {type: 'entity'});
OtherMove.attributes.add('animModel', {type: 'entity'});

// initialize code called once per entity
OtherMove.prototype.initialize = function() {
    this.animationP="Idle";
    this.overridingP=false;
    this.overrideAnim="Idle";
    this.distanceToTravel = 0;
   this.initY=this.playerEntity.getPosition().y;
    this.savePosition = new pc.Vec3();
    var pos=this.playerEntity.getPosition();
    this.playerEntity.setPosition(pc.math.random(23,27),pos.y,pc.math.random(19,30));
    // this.time = 0;
    // this.pointA=new pc.Vec3();
    // this.pointB=new pc.Vec3();
    // this.move=false;
    this.neat=true;
    if(this.randomiseMovement){
        this.moveRandom(0);
    }
};

OtherMove.prototype.moveRandom=function(delay){
    var self=this;
    setTimeout(function(){
        var rand=new pc.Vec3(pc.math.random(7.00,32.0),0,pc.math.random(-32.0,34.0));
      //  console.log("get moving" +rand);
        self.movePlayerTo(rand);
        self.moveRandom(pc.math.random(6000,25000));
    },delay);
};

// OtherMove.prototype.movePlayerTo = function(temp) {
//     this.pointA=this.entity.getPosition();
//     this.pointB=temp;
//     this.time=0;
//     this.move=true;
//     this.lookAt();
// };

OtherMove.newPosition = new pc.Vec3();
// update code called every frame
OtherMove.prototype.update = function(dt) {
    var mypos=this.entity.parent.getPosition();
  // this.playerEntity.setLocalEulerAngles(0,this.playerEntity.getLocalEulerAngles().y,0);
    // if(mypos.x<30.0&&mypos.z>-5&&mypos.z<4.6&&mypos.x>20.6){
    //     this.child.enabled=false;
    // }
    // else
    //     this.child.enabled=true;
    
//      if(!this.move)
//         return;
    
//     this.time += dt; 
    
//     var percent = this.time / this.duration;
//     if(percent<1){
//         var position = this.entity.getPosition();

//         position.lerp(this.pointA, this.pointB, percent);

//         this.entity.setPosition(position);
//     }
     if(this.direction){
        if (this.direction.lengthSq() > 0) {
            // Move in the direction at a set speed
            var d = this.playerSpeed * dt;
            var newPosition = PointAndClick.newPosition;

            newPosition.copy(this.direction).scale(d);
            newPosition.add(this.playerEntity.getPosition());        
            this.playerEntity.setPosition(newPosition);     


            this.distanceToTravel -= d;

            // If we have reached our destination, clamp the position 
            // and reset the direction
            if (this.distanceToTravel <= 0) {
                this.playerEntity.setPosition(this.targetPosition);
                this.targetPosition=null;
                this.direction.set(0, 0, 0);
                this.animatePlayer("Idle");
            }else{
                if(this.neat){
                    this.neat=false;

                    // this.entity.script.avatarHandler.otherChar.anim.setBoolean("walking",true);
                    // this.myChar.anim.play("walk");
                }
            }
        }else{
            if(!this.neat){
                
                // this.entity.script.avatarHandler.otherChar.anim.setBoolean("walking",false);
                this.neat=true;
                // this.myChar.animation.play("idle");
            }
        }
     }
};
OtherMove.prototype.animatePlayer=function(anim){
    this.animationP=anim;
    if(this.overridingP)
        this.entity.script.negotiationAvatarUpdate.animateAll(this.overrideAnim);
        // this.animModel.animation.play(this.overrideAnim,0.2);
    else
        this.entity.script.negotiationAvatarUpdate.animateAll(this.animationP);
        // this.animModel.animation.play(this.animationP,0.2);
};


OtherMove.prototype.animatePlayerP=function(override){
    this.overridingP=override;
    if(override)
        this.entity.script.negotiationAvatarUpdate.animateAll(this.overrideAnim);
        // this.animModel.animation.play(this.overrideAnim,0.2);
    else
        this.entity.script.negotiationAvatarUpdate.animateAll(this.animationP);
        // this.animModel.animation.play(this.animationP,0.2);
};

OtherMove.prototype.teleportPlayerTo = function (worldPosition) {
    if(!this.targetPosition)
    {
         this.targetPosition = new pc.Vec3();
    }
    // console.log("teleporting...........");
    // console.log(worldPosition);
    this.targetPosition.copy(worldPosition);
    this.targetPosition.y = this.initY;
    if(this.direction)
        this.direction.set(0, 0, 0);
    this.playerEntity.setPosition(worldPosition.x,this.initY,worldPosition.z);
    this.targetPosition=null;
    // console.log("teleported...........");
    // console.log(this.playerEntity.getPosition());
    this.animatePlayer("Idle");
};

OtherMove.prototype.movePlayerTo = function (worldPosition) {
    if(!worldPosition)
    {
        console.log("worldPosition is undefined");
        return;
    }
    
    // if(!this.neat)
    //     return;
    // console.log("move to:"+worldPosition);
    if(this.playerEntity.getPosition().x==null)
        this.playerEntity.setPosition(worldPosition.x,this.initY,worldPosition.z);
    if(!this.targetPosition)
    {
         this.targetPosition = new pc.Vec3();
    }
    if(!this.direction)
    {
         this.direction = new pc.Vec3();
    }
    
    this.targetPosition.copy(worldPosition);
        
    // Assuming we are travelling on a flat, horizontal surface, we make the Y the same
    // as the player
    this.targetPosition.y = this.initY;

    this.distanceTravelled = 0;
    
    // Work out the direction that the player needs to travel in
    this.direction.sub2(this.targetPosition, this.playerEntity.getPosition());
    
    // Get the distance the player needs to travel for
    this.distanceToTravel = this.direction.length();
    
    if (this.distanceToTravel > 0) {
        // Ensure the direction is a unit vector
        this.direction.normalize();

        // this.animModel.animation.play("Jog Forward",0.2);

        this.animatePlayer("Jog Forward");     
        this.playerEntity.lookAt(this.targetPosition);
    } else {
        this.direction.set(0, 0, 0);
    }
    this.savePosition=this.targetPosition;
};


OtherMove.prototype.movePlayerToLastPos = function () {
   // console.log("move to:"+this.savePosition);
    this.targetPosition.copy(this.savePosition);
     //   console.log("working");
    // Assuming we are travelling on a flat, horizontal surface, we make the Y the same
    // as the player
    this.targetPosition.y = this.initY;

    this.distanceTravelled = 0;
    
    // Work out the direction that the player needs to travel in
    this.direction.sub2(this.targetPosition, this.playerEntity.getPosition());
    
    // Get the distance the player needs to travel for
    this.distanceToTravel = this.direction.length();
    
    if (this.distanceToTravel > 0) {
        // Ensure the direction is a unit vector
        this.direction.normalize();

        this.playerEntity.lookAt(this.targetPosition);
        
    } else {
        this.direction.set(0, 0, 0);
    }
   
};
OtherMove.prototype.lookAtPos = function (target) {
     this.playerEntity.lookAt(target);
    // this.playerEntity.setRotation(0,this.playerEntity.getRotation().y,0);
};
OtherMove.prototype.lookAt = function () {
    if(this.targetPosition)
        this.playerEntity.lookAt(this.targetPosition);
    // this.playerEntity.setRotation(0,this.playerEntity.getRotation().y,0);
};

OtherMove.prototype.lookAtReset = function () {
     this.playerEntity.lookAt( this.playerEntity.getPosition().x,-2,this.playerEntity.getPosition().z);
};
// swap method called for script hot-reloading
// inherit your script state here
// OtherMove.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/