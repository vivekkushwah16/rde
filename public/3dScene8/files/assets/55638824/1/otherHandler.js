var OtherHandler = pc.createScript('otherHandler');

OtherHandler.attributes.add('mainCameraPosLookAt',{type:'entity'});
OtherHandler.attributes.add('camera',{type:'entity'});
OtherHandler.attributes.add('tap',{type:'entity'});
OtherHandler.attributes.add('chatliveobj',{type:'entity'});
OtherHandler.attributes.add('cometchatliveobj',{type:'entity'});
OtherHandler.attributes.add('facecam',{type:'entity'});
OtherHandler.attributes.add('borders',{type:'entity'});
OtherHandler.attributes.add('active',{type:'entity'});
OtherHandler.attributes.add('chatLocation',{type:'entity'});
OtherHandler.attributes.add('roomLocation',{type:'entity'});
OtherHandler.attributes.add('u1Pos',{type:'entity'});
OtherHandler.attributes.add('u2Pos',{type:'entity'});
OtherHandler.attributes.add('u3Pos',{type:'entity'});
OtherHandler.attributes.add('u4Pos',{type:'entity'});
OtherHandler.attributes.add('lookHere',{type:'entity'});
OtherHandler.attributes.add('animModel', {type: 'entity'});
OtherHandler.attributes.add('requestedName',{type:'entity'});
//OtherHandler.attributes.add('dummybutton',{type:'entity'});
// initialize code called once per entity
OtherHandler.prototype.initialize = function() {
    var self=this;
    var app=this.app;
    this.initiatedHai=false;
    this.myuid="";
    this.occupancy=true;
    this.vRoomID=-1;
    this.firebaseID="";
    this.networkID="";
    
    //this.entity.on('object:interact', this._onInteract, this);
    this.entity.on('object:onhover', this._onHover, this);
    this.entity.on('object:offhover', this._offHover, this);
    // this.dummybutton.element.on('click',function(){
    //     console.log("trigger");
    //     self.dummybutton.enabled=false;
    //     self.end(); 
    //     app.fire("enableButts");
    // });
    this.app.on('unlockTheCam',function(){
        self.end();
    });
    this.app.on("endRot",function(){
        self.end();
    });
};

OtherHandler.prototype.setuid=function(uid){
    this.myuid=uid;
};

OtherHandler.prototype.setOccupancy=function(flag){
    console.log(this.myuid+" occupancy: "+ flag);
    this.occupancy=flag;
   
};

OtherHandler.prototype.setFirebaseID=function(uid){
    this.firebaseID=uid;
};

OtherHandler.prototype.setNetworkID=function(id){
    this.networkID=id;
};

OtherHandler.prototype.setvRoomID=function(id){
    this.vRoomID=id;
    if(this.vRoomID===-1)
    {
        this.endForvRoomOthers();
            if(this.facecam.script.faceCamera)
                this.facecam.script.faceCamera.setTarget(this.mainCameraPosLookAt);
    }else{
        var target=networkInstance.vRooms[id];
        
        if(target){
            if(this.facecam.script.faceCamera)
                this.facecam.script.faceCamera.setTarget(target.entity.children[0]);

            this.initiateForvRoomOthers();
        }
    }
};

// update code called every frame
OtherHandler.prototype.update = function(dt) {
    if(this.initiatedHai)
        return;
    
    
    /*var sub= new pc.Vec2();
        
    sub.sub2(this.camera.getPosition(), this.entity.getPosition());
    
    var len=sub.length();
    // console.log("distance:"+len);
    if(len<12 && len>2)
       this.tap.enabled=true;
    else
       this.tap.enabled=false;*/
};

OtherHandler.prototype.initiateForvRoomOthers =function(){
    
   if(!this.entity||!this.entity.script||!this.entity.script.otherMove||!this.facecam)
       return;
    // console.log('initiatingvRoom '+this.initiatedHai);
    // var self=this;
    // this.tap.enabled=false;
    
   if(this.entity)
    this.entity.script.otherMove.enabled=false;
  //  this.facecam.lookAt(this.camera.getPosition());
   // var self=this;
 //   this.facecam.setEulerAngles(0,this.facecam.getEulerAngles().y,0);
    
    if(this.facecam.script.faceCamera)
     this.facecam.script.faceCamera.enabled=true;
    
   if(this.entity)
    this.entity.script.otherMove.animatePlayerP(true);
     
     
    this.entity.collision.enabled=false;
    
    // this.initiatedHai=true;
    
};
OtherHandler.prototype.initiateForvRoom =function(){
    
   if(!this.entity||!this.entity.script||!this.entity.script.otherMove||!this.facecam)
       return;
    console.log('initiatingvRoom '+this.initiatedHai);
    var self=this;
    this.tap.enabled=false;
    
   if(this.entity)
    this.entity.script.otherMove.enabled=false;
  //  this.facecam.lookAt(this.camera.getPosition());
   // var self=this;
 //   this.facecam.setEulerAngles(0,this.facecam.getEulerAngles().y,0);
    
   if(this.facecam)
     this.facecam.script.faceCamera.enabled=true;
    
   if(this.entity)
    this.entity.script.otherMove.animatePlayerP(true);
    // setTimeout(function(){
    //   self.facecam.script.faceCamera.enabled=false;  
    // },1000);
     
    
    this.app.fire('lockCamera');    
     
    this.entity.collision.enabled=false;
    
    this.active.enabled=true;
   // this.dummybutton.enabled=true;
//    this.chatliveobj.script.livechat.triggerConv(this.myuid);//.openChat(this.myuid,this.entity);
    // this.cometchatliveobj.script.cometChat.triggerConv(this.firebaseID);
   // this.app.fire('lockCamera');
    
    //Begin chat
    this.initiatedHai=true;
    
    // setTimeout(()=>{
    //     self.end();
    // },500);
};

OtherHandler.prototype.initiate=function(){
    if(!this.entity||!this.entity.script||!this.entity.script.otherMove||!this.facecam)
       return;
    
    if(this.vRoomID!=-1)
    {
        this.app.fire("alert","Busy in a call!");
        return;
    }
    
    console.log('initiating '+this.initiatedHai);
    var self=this;
    this.tap.enabled=false;
    
   if(this.entity){
        this.entity.script.otherMove.enabled=false;
        this.entity.script.otherMove.animatePlayerP(true);
   }
  //  this.facecam.lookAt(this.camera.getPosition());
   // var self=this;
 //   this.facecam.setEulerAngles(0,this.facecam.getEulerAngles().y,0);
    
    // setTimeout(function(){
    //   self.facecam.script.faceCamera.enabled=false;  
    // },1000);
     
    
    this.app.fire('lockCamera');    
        setTimeout(function(){
            cameraLerpInstance.updatePos(self.chatLocation.getPosition());
            cameraLerpInstance.updateRot(self.chatLocation.getRotation());
            networkInstance.updatePositionInstant(self.chatLocation.getPosition());
            networkInstance.requestvRoom({u2id:self.networkID,target:self.roomLocation.getPosition(),u1Pos:self.u1Pos.getPosition(),u2Pos:self.u2Pos.getPosition(),u3Pos:self.u3Pos.getPosition(),u4Pos:self.u4Pos.getPosition()});
            // cameraLerpInstance.updateLookAt(self.lookHere.getPosition());
        },200);
    if(networkInstance.players[self.networkID])
        this.requestedName.element.text=""+networkInstance.players[self.networkID].name;
    
    this.borders.enabled=true;
    
    this.entity.collision.enabled=false;
    
    this.active.enabled=true;
   // this.dummybutton.enabled=true;
//    this.chatliveobj.script.livechat.triggerConv(this.myuid);//.openChat(this.myuid,this.entity);
    // this.cometchatliveobj.script.cometChat.triggerConv(this.firebaseID);
   // this.app.fire('lockCamera');
    
    if(this.facecam.script.faceCamera)
     this.facecam.script.faceCamera.enabled=true;
    //Begin chat
    this.initiatedHai=true;
};

OtherHandler.prototype.end=function(){
    if(!this.entity||!this.entity.script||!this.entity.script.otherMove||!this.facecam)
       return;
    console.log('ending');
    
    if(!this.initiatedHai)
        return;
    var self=this;
    this.initiatedHai=false;
   // this.tap.enabled=true;
   if(this.entity)
       if(this.entity.script)
            if(this.entity.script.otherMove){
                this.entity.script.otherMove.enabled=true;
                this.entity.script.otherMove.lookAt();
                this.entity.script.otherMove.animatePlayerP(false);
            }
    
    // setTimeout(function(){
    //     this.app.fire('unlockCamera');
    // },100);
  
    this.active.enabled=false;
    this.borders.enabled=false;

   // setTimeout(function(){
        if(self.entity.collision)
            self.entity.collision.enabled=true;    
   // },100);
    setTimeout(()=>{
        cameraLerpInstance.endRot();
        self.app.fire('unlockCamera');
    },250);
    this.app.fire('endConversation');
    if(this.facecam.script.faceCamera)
        this.facecam.script.faceCamera.enabled=false;
    
    //End chat
};

OtherHandler.prototype.endForvRoom=function(){
    if(!this.entity||!this.entity.script||!this.entity.script.otherMove||!this.facecam)
       return;
    console.log('ending vroom');
    
    if(!this.initiatedHai)
        return;
    var self=this;
    this.initiatedHai=false;
    this.borders.enabled=false;
   // this.tap.enabled=true;
   if(this.entity)
       if(this.entity.script)
            if(this.entity.script.otherMove){
                this.entity.script.otherMove.enabled=true;
                this.entity.script.otherMove.lookAt();
                this.entity.script.otherMove.animatePlayerP(false);
            }
    
    // setTimeout(function(){
    //     this.app.fire('unlockCamera');
    // },100);
  
    this.active.enabled=false;

   // setTimeout(function(){
        if(self.entity.collision)
            self.entity.collision.enabled=true;    
   // },100);
    // cameraLerpInstance.endRot();
    // this.app.fire('unlockCamera');
    this.app.fire('endConversation');
    if(this.facecam.script.faceCamera)
        this.facecam.script.faceCamera.enabled=false;
    
    //End chat
};
OtherHandler.prototype.endForvRoomOthers=function(){
    if(!this.entity||!this.entity.script||!this.entity.script.otherMove||!this.facecam)
       return;
    // console.log('ending');
    
    // if(!this.initiatedHai)
    //     return;
    var self=this;
    // this.initiatedHai=false;
    // this.borders.enabled=false;
   // this.tap.enabled=true;
   if(this.entity)
       if(this.entity.script)
            if(this.entity.script.otherMove){
                this.entity.script.otherMove.enabled=true;
                this.entity.script.otherMove.lookAt();
                this.entity.script.otherMove.animatePlayerP(false);
            }
    
    // setTimeout(function(){
    //     this.app.fire('unlockCamera');
    // },100);
  
    // this.active.enabled=false;

   // setTimeout(function(){
        if(self.entity.collision)
            self.entity.collision.enabled=true;    
   // },100);
    // cameraLerpInstance.endRot();
    // this.app.fire('unlockCamera');
    // this.app.fire('endConversation');
    if(this.facecam.script.faceCamera)
        this.facecam.script.faceCamera.enabled=false;
    
    //End chat
};
OtherHandler.prototype._onHover = function () {
         this.tap.enabled=true;
};


OtherHandler.prototype._offHover = function () {
        this.tap.enabled=false;
};
// swap method called for script hot-reloading
// inherit your script state here
// OtherHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/
// 