var CameraLerp = pc.createScript('cameraLerp');

var cameraLerpInstance;
CameraLerp.attributes.add("duration", {type: "number", default: 5, title: "Duration (Secs)"});
CameraLerp.attributes.add("target", {type: "entity"});
// initialize code called once per entity
CameraLerp.prototype.initialize = function() {
    var self=this;
    cameraLerpInstance=this;
    this.time = 0;
    this.pointA=new pc.Vec3();
    this.pointB=new pc.Vec3();
    this.lookHere=new pc.Vec3();
    this.rotateB=new pc.Quat();
    this.move=false;
    this.canRotate=false;
    this.canLookAt=false;
    
    this.onlyOnce=true;
    this.app.on("beganGame",function(){
        if(!self.onlyOnce)
            return;
        self.onlyOnce=false;
        // setInterval(()=>{
        //     if(networkInstance)
        //         networkInstance.updatePosition(self.entity.getPosition());
        // },10000); 
    });
    // this.app.on("endRot",function(){
    //    self.endRot(); 
    // });
};
window.parent.teleportMyPlayer=function(myPosX,myPosZ){
    if(cameraLerpInstance){
        var temp=new pc.Vec3(myPosX,0,myPosZ);
        temp.y= cameraLerpInstance.entity.getPosition().y;
        // cameraLerpInstance.entity.setPosition(temp);
        cameraLerpInstance.updatePos(temp);
        // cameraLerpInstance.updateRot(myRot);
    }
};

CameraLerp.prototype.updatePos = function(temp) {
    this.pointA=this.entity.getPosition();
    this.pointB=temp;
    // console.log(this.pointB.y);
    this.time=0;
    this.move=true;
};

CameraLerp.prototype.endRot = function(temp) {
    this.canRotate=false;
    this.canLookAt=false;
    // var eulerAngles = this.entity.children[0].getEulerAngles();
    // this.entity.children[0].setEulerAngles(new pc.Vec3(0,eulerAngles.y,0));
};

CameraLerp.prototype.resetPercent=function(){
    this.move=false;
    this.percent=1;
    this.entity.rigidbody.type=pc.BODYTYPE_DYNAMIC;
};

CameraLerp.prototype.updateLookAt = function(temp) {
    
    this.lookHere=temp;
    this.target.setPosition(temp.x,temp.y,temp.z);
    this.time=0;
    this.canLookAt=true;
    this.canRotate=false;
    console.log(temp);
};

CameraLerp.prototype.updateRot = function(temp) {
    this.rotateB=temp;
    this.time=0;
    this.canRotate=true;
    console.log(temp);
};

CameraLerp.prototype.updatePosInstant = function(temp) {
    this.pointA=temp;
    this.pointB=temp;
    this.time=0;
    this.move=true;
};

// update code called every frame
CameraLerp.prototype.update = function(dt) {
    if(this.canLookAt){
        this.entity.setEulerAngles(0,0,0);
        this.entity.children[0].lookAt(this.target.getPosition());
    }
        // this.entity.setLocalEulerAngles(0,0,0);
    // 
    
    if(!this.move)
        return;
    
    
    
    
    this.time += dt; 
  /*  if (this.time > this.duration) {
        this.time -= this.duration;
    } */   
    
    var percent = this.time / this.duration;
   // console.log(percent);
    if(percent<1){
        this.entity.rigidbody.type=pc.BODYTYPE_KINEMATIC;
      //  var angle = this.entity.getRotation();
        var position = this.entity.getPosition();

        // Use slerp to smoothly interpolate between two angles
        // http://developer.playcanvas.com/en/api/pc.Quat.html#slerp
      //  angle.slerp(this.pointA.getRotation(), this.pointB.getRotation(), percent);

        // Use lerp to smoothly interpolate between two positions
        // http://developer.playcanvas.com/en/api/pc.Vec3.html#lerp
        
        this.pointB.y=this.entity.getPosition().y;
        //console.log(this.pointB);
        position.lerp(this.pointA, this.pointB, percent);

     //   this.entity.setRotation(angle);
        this.entity.setPosition(position);
    }
    
    
    if(!this.canRotate)
        return;
     // this.entity.children[0].lookAt(this.lookHere);
        if(percent*15<1){
            // var rotation = this.entity.children[0].getRotation();
            // Use slerp to smoothly interpolate between two angles
            // http://developer.playcanvas.com/en/api/pc.Quat.html#slerp
            var angle=this.entity.children[0].getRotation();
            angle.slerp(angle, this.rotateB, percent*15);

            // Use lerp to smoothly interpolate between two positions
            // http://developer.playcanvas.com/en/api/pc.Vec3.html#lerp

            //console.log(this.pointB);

             // var new_rotation=this.rotateTowards(rotation, this.rotateB, percent);
         //   this.entity.setRotation(angle);
            this.entity.children[0].setRotation(angle);
        }
};


CameraLerp.prototype.rotateTowards = function (quat_a, quat_b, percent) {
    var angle = this.quatAngle(quat_a, quat_b);
        
    if (angle === 0)
    {
        return quat_b;
    }
    
    return new pc.Quat().slerp(quat_a, quat_b, percent); 
};

CameraLerp.prototype.dot = function (quat_left, quat_right) {
    var dot = quat_left.x * quat_right.x + quat_left.y * quat_right.y + 
        quat_left.z * quat_right.z + quat_left.w * quat_right.w;

    return dot;
};

// Returns the angle in degrees between two rotations /a/ and /b/.
CameraLerp.prototype.quatAngle = function (quat_a, quat_b) {
    var dot = this.dot(quat_a, quat_b);
    
    if(quat_a.equals(quat_b) )
    {
        return 0;
    }        
    
    var rad2Deg = 1 / (Math.PI / 180);

    var angle = Math.acos(Math.min(Math.abs(dot), 1)) * 2 * rad2Deg;

    return angle;   
};