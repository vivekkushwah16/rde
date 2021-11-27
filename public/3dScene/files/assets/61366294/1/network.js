var Network = pc.createScript('network');

//Network.attributes.add("bots",{type:'entity'});
Network.attributes.add("totalText", { type: 'entity' });
Network.attributes.add("roomID", { type: 'number' });
Network.attributes.add("url", { type: 'string', default: 'https://real-multiplayer' });
// Network.attributes.add("emoteNames",{type:'string',array:true});
Network.attributes.add("requestText", { type: 'entity' });
Network.attributes.add("borders", { type: 'entity' });
Network.attributes.add("playerModelHandler", { type: 'entity' });
Network.attributes.add("playerModel", { type: 'entity' });
// static variables
Network.id = null;
Network.socket = null;
var sent = false;

let networkInstance = null;
let socketInstance = null;
netSocket = null;
netID = null;

window.parent.meraNetworkInstance=null;
// initialize code called once per entity
Network.prototype.initialize = function () {
    var self = this;
    networkInstance = this;
    window.parent.meraNetworkInstance=this;
    this.player = this.app.root.findByName('Camera Offset');
    this.other = this.app.root.findByName('Other');
    this.vRoom = this.app.root.findByName('vRoom');
    this.vRoomRequest = this.app.root.findByName('vRoomRequest');
    this.vRoomUI = this.app.root.findByName('vRoomUI');
    this.vRoomParent = this.app.root.findByName('vRoomParent');
    this.otherParent = this.app.root.findByName('OtherParent');
    this.ground = this.app.root.findByName('Ground');
    this.htmlController = this.app.root.findByName('HTML');
    this.players = {};
    this.vRooms = {};
    this.vRoomNo = 0;
    this.no = 1;
    this.fID = "";
    this.u1id = null;
    this.u2id = null;
    this.u3id = null;
    this.u4id = null;
    this.u1Pos = null;
    this.u2Pos = null;
    this.u3Pos = null;
    this.u4Pos = null;
    this.vRoomID = null;
    this.roomPosX = null;
    this.roomPosZ = null;
    this.userName = "";

    // setInterval(function(){
    //     console.log(self.players);
    //     var debuggerz=window.parent.document.getElementById("debugger");
    //     if(debuggerz){
    //         debuggerz.innerHTML="Debug View:<br>";
    //         // console.log(Object.keys(self.players));
    //         for(var i=0;i<Object.keys(self.players).length;i++){
    //             debuggerz.innerHTML+="<br> Name: "+self.players[Object.keys(self.players)[i]].name;
    //             debuggerz.innerHTML+="<br> ID: "+self.players[Object.keys(self.players)[i]].id;
    //             debuggerz.innerHTML+="<br> inCallID: "+self.players[Object.keys(self.players)[i]].vRoomID;
    //             debuggerz.innerHTML+="<br> isVisible: "+self.players[Object.keys(self.players)[i]].visibility;
    //             debuggerz.innerHTML+="<br> position: "+self.players[Object.keys(self.players)[i]].entity.localPosition+"<br>";
    //         }
    //     }
    // },5000);
    this.itsDone = false;
    // this.app.on("firebaseInitialized", function(user, avatarDetails){
    //     console.log(user.displayName + " : sending to socket");
    //     console.log(avatarDetails);
    //     self.fID=user.uid;

    //     self.userName=user.displayName;
    //     self.genderData=avatarDetails.genderData;
    //     self.mhairData=avatarDetails.mhairData;
    //     self.mtopData=avatarDetails.mtopData;
    //     self.mskinColorData=avatarDetails.mskinColorData;
    //     self.glassesF=avatarDetails.glassesF;
    //     self.glassesM=avatarDetails.glassesM;
    //     self.beard=avatarDetails.beard;

    //     self.fhairData=avatarDetails.fhairData;
    //     self.ftopData=avatarDetails.ftopData;
    //     self.flagData=avatarDetails.flagData;
    //     self.fskinColorData=avatarDetails.fskinColorData;

    //     self.mhairColorData= avatarDetails.mhairColorData;
    //     self.mbottomColorData= avatarDetails.mbottomColorData;
    //     self.mtop1ColorData= avatarDetails.mtop1ColorData;
    //     self.mtop2ColorData= avatarDetails.mtop2ColorData;
    //     self.mtop3ColorData=avatarDetails.mtop3ColorData;
    //     self.mtop4ColorData= avatarDetails.mtop4ColorData;
    //     self.ftop1ColorData= avatarDetails.ftop1ColorData;
    //     self.ftop2ColorData= avatarDetails.ftop2ColorData;
    //     self.ftop3ColorData= avatarDetails.ftop3ColorData;
    //     self.ftop4ColorData= avatarDetails.ftop4ColorData;
    //     self.fhairColorData= avatarDetails.fhairColorData;
    //     self.fbottomColorData= avatarDetails.fbottomColorData;
    //     self.frame=avatarDetails.frame;
    //     self.frameColorData=avatarDetails.frameColorData;

    //     self.playerModelHandler.script.playerModelHandler.applyAvatarDetails(avatarDetails);

    //     var myRole="Designer";
    //     var myMailID=user.email.split('@')[0].toUpperCase();
    //     console.log(myMailID);
    //     if(myMailID.includes("DSNAZS")||myMailID.includes("SS8ZS")||myMailID.includes("PRNAZS")||myMailID.includes("MM11ZS")||myMailID.includes("AG12ZS")||myMailID.includes("RS15ZS")||myMailID.includes("RS15ZS")||myMailID.includes("RSJNAZS")||myMailID.includes("PJ19ZS")||myMailID.includes("SS21ZS")||myMailID.includes("FP24ZS")||myMailID.includes("JW25ZS"))
    //         myRole="Manager";
    //     else if(myMailID.includes("SA26ZS")||myMailID.includes("BFNAZS")||myMailID.includes("ES6ZS")||myMailID.includes("NJ7ZS")||myMailID.includes("JS9ZS")||myMailID.includes("AN13ZS")||myMailID.includes("SK22ZS"))
    //         myRole="Principal";
    //     else if(myMailID.includes("RY20ZS")||myMailID.includes("SS17ZS")||myMailID.includes("RR14ZS")||myMailID.includes("LS10ZS")||myMailID.includes("EC23ZS")||myMailID.includes("NK1ZS")||myMailID.includes("SJ2ZS"))
    //         myRole="Associate Principal";
    //     else if(myMailID.includes("EMP4ZS"))
    //         myRole="Sr. HR Associate";
    //     else if(myMailID.includes("JD5ZS"))
    //         myRole="Sr. Administrative Assistant";
    //     else if(myMailID.includes("IGNAZS")||myMailID.includes("NT18ZS"))
    //         myRole="Consultant";
    //     else if(myMailID.includes("YHNAZS"))
    //         myRole="Sr. Immersive Product Designer";
    //     else if(myMailID.includes("MD27ZS"))
    //         myRole="Production Manager";

    //     // Network.socket.emit ('initialize',{name: self.userName, vRoomID:-1, userid: uid, gender:self.gender, hat:self.hat ,glass: self.glass ,skin:self.skin ,dress:self.dress, roomID: self.roomID});
    //     if(Network.socket!==null)
    //         Network.socket.emit ('initialize',{name: user.displayName,role:myRole, vRoomID:-1, userid: user.uid,glassesM:avatarDetails.glassesM,glassesF:avatarDetails.glassesF,beard:avatarDetails.beard, genderData:avatarDetails.genderData, mhairData:avatarDetails.mhairData ,mtopData:avatarDetails.mtopData ,mskinColorData:avatarDetails.mskinColorData , fhairData:avatarDetails.fhairData ,ftopData:avatarDetails.ftopData ,fskinColorData:avatarDetails.fskinColorData , roomID: self.roomID,      
    //             mhairColorData: avatarDetails.mhairColorData,
    //             mbottomColorData: avatarDetails.mbottomColorData,
    //             mtop1ColorData: avatarDetails.mtop1ColorData,
    //             mtop2ColorData: avatarDetails.mtop2ColorData,
    //             mtop3ColorData:avatarDetails.mtop3ColorData,
    //             mtop4ColorData: avatarDetails.mtop4ColorData,
    //             ftop1ColorData: avatarDetails.ftop1ColorData,
    //             ftop2ColorData: avatarDetails.ftop2ColorData,
    //             ftop3ColorData: avatarDetails.ftop3ColorData,
    //             ftop4ColorData: avatarDetails.ftop4ColorData,
    //                  flagData: avatarDetails.flagData,
    //             fhairColorData: avatarDetails.fhairColorData,
    //                   frame:avatarDetails.frame,
    //                   frameColorData:avatarDetails.frameColorData,
    //             fbottomColorData: avatarDetails.fbottomColorData
    //                                           });//send player name also
    // });

    this.app.on('unlockTheCam', function () {
        if (self.initialized) {
            if (Network.socket)
                if (self.u1id !== null && self.u2id !== null)
                    Network.socket.emit('denyvRoom', { u1id: self.u1id, uname: self.userName, u2id: self.u2id, denierID: Network.id });
        }
    });
    // this.app.on('denyvRoomRequest',function(){
    //    if (this.initialized) {
    //          if(Network.socket)
    //             Network.socket.emit('denyvRoom', {u1id: Network.id, uname:self.userName, u2id: self.u2id, denierID:Network.id});
    //     }
    // });

    this.app.on('denyvRequest', function () {
        if (self.initialized) {
            if (Network.socket)
                Network.socket.emit('denyvRoom', { u1id: self.u1id, uname: self.userName, u2id: self.u2id, denierID: Network.id });
        }
        self.vRoomRequest.enabled = false;
        setTimeout(() => {
            self.app.fire("unlockCamera");
            self.app.fire("unlockMovement");
        }, 250);
    });

    this.app.on('acceptvRequest', function () {
        if (self.initialized) {
            if (Network.socket)
                Network.socket.emit('createvRoom', { u1id: self.u1id, uname: self.userName, u2id: self.u2id, x: self.roomPosX, z: self.roomPosZ, u1Pos: self.u1Pos, u2Pos: self.u2Pos, u3Pos: self.u3Pos, u4Pos: self.u4Pos });
        }
        self.vRoomRequest.enabled = false;
    });

    this.app.on('startVideoCall', function () {
        console.log("start video call: " + self.vRoomID);
        if (Network.socket)
            Network.socket.emit('startVideoCallvRoom', { vRoomID: self.vRoomID, u1id: self.u1id, u2id: self.u2id, u3id: self.u3id, u4id: self.u4id });

        if (typeof window.parent.showCall !== "undefined")
            window.parent.showCall();
        // if(typeof window.parent.startCall !== "undefined")
        //     window.parent.startCall(self.vRoomID);

        self.vRoomUI.children[0].enabled = false;
    });

    this.app.on('leavevRoomCall', function () {
        if (!self.vRoomID)
            return;
        if (typeof window.parent.leaveCall !== "undefined")
            window.parent.leaveCall();


        self.leavevRoom(self.vRoomID);
        self.vRoomUI.enabled = false;
        self.playerModel.enabled = false;

        if (self.roomPosX !== null && self.roomPosZ !== null) {
            var roomPos = new pc.Vec3(self.roomPosX, 0, self.roomPosZ);
            var myPos = null;

            if (self.u1id == Network.id)
                myPos = self.u1Pos;
            else if (self.u2id == Network.id)
                myPos = self.u2Pos;
            else if (self.u3id == Network.id)
                myPos = self.u3Pos;
            else if (self.u4id == Network.id)
                myPos = self.u4Pos;

            if (myPos !== null) {
                roomPos.sub(myPos);
                // var dir=pc.Vec3 roomPos-myPos;
                roomPos.normalize();
                console.log(roomPos);
                roomPos = new pc.Vec3(roomPos.x * -1, 0, roomPos.z * -1);
                console.log(roomPos);
                var newPos = roomPos.add(new pc.Vec3(myPos.x, 0, myPos.z));//.add(new pc.Vec3(roomPos.x*5,0,roomPos.z*5));
                // var myRot=self.playerModelHandler.getEulerAngles();
                // var newRot = myRot.add(new pc.Vec3(0, 45, 0));//.add(new pc.Vec3(roomPos.x*5,0,roomPos.z*5));
                // var tempEn=new pc.Entity("tempen",pc.app);
                var tempEn=new pc.Entity("tempen",pc.app);
                tempEn.setPosition(self.playerModelHandler.getPosition());
                tempEn.lookAt(newPos);
                 // cameraLerpInstance.updateLookAt(newPos);
                cameraLerpInstance.updateRot(tempEn.getRotation());
                // console.log(newPos);
                cameraLerpInstance.updatePosInstant(newPos);
                self.updatePosition(newPos);
                
                tempEn.destroy();
            }
        }

        setTimeout(() => {
            self.ground.name = "Ground";
            cameraLerpInstance.endRot();
            // self.app.fire("endRot");
            self.app.fire("unlockCamera");
            self.app.fire("unlockMovement");
        }, 1000);
        // console.log(self.players[self.u1id]);console.log(self.players[self.u2id]);console.log(self.players[self.u3id]);console.log(self.players[self.u4id]);
        if (self.players[self.u1id] && self.players[self.u1id].entity)
            if (self.players[self.u1id].entity.children[0])
                self.players[self.u1id].entity.children[0].script.otherHandler.endForvRoom();
        if (self.players[self.u2id] && self.players[self.u2id].entity)
            if (self.players[self.u2id].entity.children[0])
                self.players[self.u2id].entity.children[0].script.otherHandler.endForvRoom();
        if (self.players[self.u3id] && self.players[self.u3id].entity)
            if (self.players[self.u3id].entity.children[0])
                self.players[self.u3id].entity.children[0].script.otherHandler.endForvRoom();
        if (self.players[self.u4id] && self.players[self.u4id].entity)
            if (self.players[self.u4id].entity.children[0])
                self.players[self.u4id].entity.children[0].script.otherHandler.endForvRoom();

        self.vRoomID = null;

    });

    //      this.app.on('userStatusUpdate', (data)=>{
    //         console.log(data);

    //          Object.keys(data).forEach( key =>{
    //              let val = data[key];
    //              if(self.players[val.socketID]!==undefined&&self.players[val.socketID]!==null){
    //                  if(self.players[val.socketID].entity!==undefined&&self.players[val.socketID].entity!==null)
    //                      if(val.lobbyStatus!== 'online')
    //                             self.players[val.socketID].entity.enabled=false;
    //                      else 
    //                          self.players[val.socketID].entity.enabled=true;
    //              }
    //          });

    //     });

    // this.socket=null;

    //     this.responsed="";
    //     var counterLink="https://counter-multiplayer.glitch.me/";
    //     pc.http.get(counterLink, function (err, response) {
    //            // self.initSocket("https://real-multiplayer-"+response+".glitch.me");
    //                    self.initSocket("https://real-multiplayer-1.glitch.me");

    //     });
    //  this.initSocket("https://negotiation-academy.glitch.me");
    // this.initSocket("https://zs-multi.glitch.me");
    // this.initSocket("https://real-multiplayer-1.glitch.me");
    // this.initSocket("https://www.madovertech.site");

    // this.socket.on ('playerMoved', function (data) {
    //     self.movePlayer(data);
    // });

    // this.chatinit=false;
    // this.app.on("chatInitialized",function(uid){
    //     self.chatinit=true;
    //     if(Network.socket!==null)
    //         Network.socket.emit ('initialize',{name: self.userName, vRoomID:-1, userid: self.fID, gender:self.gender, hat:self.hat ,glass: self.glass ,skin:self.skin ,dress:self.dress, roomID: self.roomID});//send player name also
    // });

    // this.app.on('sendEmote',function(emote){
    //      if(Network.socket!==null){
    //         console.log("sending emote: "+emote);
    //      //   Network.socket.emit ('emojiUpdate',{id: Network.id,uid:self.fID,  emote:emote});//send player name also
    //      }
    // });

};

window.parent.throwAlert=function(alertTxt){
    if(networkInstance){
        networkInstance.alertMaro(alertTxt);
    }
};

window.lobbyLoadingDone = function () {
    console.log("loaded");

    if(typeof window.parent.SocketManager!=="undefined")
    window.parent.SocketManager.subscribe_GetSocket((socket) => {
        socketInstance = socket;
        Network.socket = socket;
    });
};

Network.prototype.initSocket = function (url) {
    var self = this;
    var socket = io.connect(url);
    // console.log(url);
    netSocket = socket;
    Network.socket = socket;
    socket.on('playerData', function (data) {
        self.initializevRooms(data.vRooms);
        self.initializePlayers(data);
    });
    socket.on('playerJoined', function (data) {
        self.addPlayer(data);
    });
    socket.on('killPlayer', function (data) {
        self.removePlayer(data);
    });
    socket.on('playerMoved', function (data) {
        self.movePlayer(data);
    });
    socket.on('playerMovedInstant', function (data) {
        self.movePlayerInstant(data);
    });
    socket.on('visibilityChange', function (data) {
        self.visibilityChanged(data);
    });

    socket.on('userLeftvRoom', function (data) {
        if (self.players[data.id] && self.players[data.id].entity && self.players[data.id].entity.children[0])
            self.players[data.id].entity.children[0].script.otherHandler.setvRoomID(-1);//setOccupancy(true);
        if (data.vRoomID == self.vRoomID) {
            if (self.players[data.id])
                if (self.players[data.id].entity)
                    if (self.players[data.id].entity.children[0])
                        self.players[data.id].entity.children[0].script.otherHandler.endForvRoom();

        }
    });
    socket.on('requestedPermission', function (data) {
        if (data.u2id == Network.id) {
            self.requestText.element.text = "" + data.uname + "";
            self.vRoomRequest.enabled = true;
            self.app.fire("lockCamera");
            self.app.fire("lockMovement");
        }

        if (data.u2id == Network.id || data.u1id == Network.id) {
            self.roomPosX = data.x;
            self.roomPosZ = data.z;
            self.u1id = data.u1id;
            self.u2id = data.u2id;
            self.u1Pos = data.u1Pos;
            self.u2Pos = data.u2Pos;
            self.u3Pos = data.u3Pos;
            self.u4Pos = data.u4Pos;
            if (typeof window.parent.tutorialThreeComplete !== "undefined")
                window.parent.tutorialThreeComplete();
        }
    });

    socket.on('vRoomDenied', function (data) {
        self.u1id = null;
        self.u2id = null;

        // if (self.players[data.u1id] && self.players[data.u1id].entity)
        // self.players[data.u1id].entity.children[0].script.otherHandler.setvRoomID(-1);//setOccupancy(false);
        // if (self.players[data.u2id] && self.players[data.u2id].entity)
        // self.players[data.u2id].entity.children[0].script.otherHandler.setvRoomID(-1);//.setOccupancy(false);


        console.log(data);
        if (data.data.denierID == Network.id)
            return;

        if (data.data.u2id == Network.id) {
            // window.alert(data.response2);
            self.app.fire("alert", data.response2);
            self.vRoomRequest.enabled = false;
            self.app.fire("unlockCamera");
            self.app.fire("unlockMovement");
        
        }

        if (data.data.u1id == Network.id) {
            // window.alert(data.response1);
            self.app.fire("alert", data.response1);
            if (data.userLeft) {
                self.borders.enabled = false;
                self.app.fire("unlockCamera");
                self.app.fire("unlockMovement");

             }
            else
                self.app.fire("unlockTheCam");
        }
    });

    socket.on('vRoomCreated', function (data) {
        console.log(data);
        self.addvRoom(data.newvRoom);
        console.log(self.players[data.u1id]);

        if (self.players[data.u1id] && self.players[data.u1id].entity)
            self.players[data.u1id].entity.children[0].script.otherHandler.setvRoomID(data.newvRoom.specialvID);//setOccupancy(false);

        if (self.players[data.u2id] && self.players[data.u2id].entity)
            self.players[data.u2id].entity.children[0].script.otherHandler.setvRoomID(data.newvRoom.specialvID);//.setOccupancy(false);

        if (data.u2id == Network.id || data.u1id == Network.id) {

            self.entity.sound.play("joinCall");
            self.roomPosX = data.newvRoom.x;
            self.roomPosZ = data.newvRoom.z;
            self.u1id = data.newvRoom.u1id;
            self.u2id = data.newvRoom.u2id;
            self.u1Pos = data.newvRoom.u1Pos;
            self.u2Pos = data.newvRoom.u2Pos;
            self.u3Pos = data.newvRoom.u3Pos;
            self.u4Pos = data.newvRoom.u4Pos;
            if (typeof window.parent.joinvRoomInformer !== "undefined") {
                window.parent.joinvRoomInformer();
            }
            self.vRoomUI.children[0].enabled = false;
            if (typeof window.parent.showCall !== "undefined")
                window.parent.showCall();
            if (typeof window.parent.tutorialThreeComplete !== "undefined")
                window.parent.tutorialThreeComplete();
        }
        //teleport
        if (data.u2id == Network.id) {
            self.vRoomID = data.newvRoom.specialvID;
            cameraLerpInstance.updatePosInstant(data.u2Pos);
            var vec3 = new pc.Vec3();
            vec3.x = data.x;
            vec3.y = 0;
            vec3.z = data.z;
            cameraLerpInstance.updateLookAt(data.u1Pos);
            self.updatePosition(data.u2Pos);
            self.vRoomUI.enabled = true;
            // self.vRoomUI.children[0].enabled = true;

            if (typeof window.parent.startCall !== "undefined")
                window.parent.startCall(data.newvRoom.specialvID);



            if (self.players[data.u1id]) {
                self.players[data.u1id].entity.children[0].script.otherMove.teleportPlayerTo(data.u1Pos);
                self.players[data.u1id].entity.children[0].script.otherHandler.initiateForvRoom();
            }
            // self.players[data.u1id].entity.children[0].script.otherMove.lookAtPos(vec3);

            self.ground.name = "round";
            self.playerModel.enabled = true;
            self.playerModel.children[0].script.vRoomCameraRotation.deact();
            // self.playerModel.children[0].setLocalEulerAngles(0,0,0);
        }
        else if (data.u1id == Network.id) {
            self.vRoomID = data.newvRoom.specialvID;
            self.borders.enabled = false;
            self.vRoomUI.enabled = true;
            // self.vRoomUI.children[0].enabled = true;

            if (typeof window.parent.startCall !== "undefined")
                window.parent.startCall(data.newvRoom.specialvID);

            self.ground.name = "round";
            setTimeout(() => {
                self.playerModel.enabled = true;
                self.playerModel.children[0].script.vRoomCameraRotation.deact();
                // self.playerModel.children[0].setLocalEulerAngles(0,0,0);
            }, 500);
        }
    });

    socket.on('startedVideoCallvRoom', function (data) {
        if (data.u1id == Network.id || data.u2id == Network.id || data.u3id == Network.id || data.u4id == Network.id) {
            self.vRoomUI.children[0].enabled = false;
            if (typeof window.parent.showCall !== "undefined")
                window.parent.showCall();
        }
    });

    socket.on('vRoomJoinedForOthers', function (data) {
        console.log(self.players[data.data.id]);
        console.log(data.data.id);
        if (self.players[data.data.id])
        if(self.players[data.data.id].entity)
        if(self.players[data.data.id].entity.children[0])
            self.players[data.data.id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);
        // if(self.players[data.vRoom.u1id]&&self.players[data.vRoom.u1id].entity)
        //     self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);
        // if(self.players[data.vRoom.u2id]&&self.players[data.vRoom.u2id].entity)
        //     self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);
        // if(self.players[data.vRoom.u3id]&&self.players[data.vRoom.u3id].entity)
        //     self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);
        // if(self.players[data.vRoom.u4id]&&self.players[data.vRoom.u4id].entity)
        //     self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);


        if (data.vRoom.u1id == Network.id || data.vRoom.u2id == Network.id || data.vRoom.u3id == Network.id || data.vRoom.u4id == Network.id)
            self.entity.sound.play("joinCall");
        if (data.vRoom.u1id == Network.id) {
            setTimeout(() => {
                if (data.u2id != -1)
                    if (self.players[data.vRoom.u2id] && self.players[data.vRoom.u2id].entity)
                        self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u3id != -1)
                    if (self.players[data.vRoom.u3id] && self.players[data.vRoom.u3id].entity)
                        self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u4id != -1)
                    if (self.players[data.vRoom.u4id] && self.players[data.vRoom.u4id].entity)
                        self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.initiateForvRoom();
            }, 500);

        } else if (data.vRoom.u2id == Network.id) {

            setTimeout(() => {
                if (data.vRoom.u1id != -1)
                    if (self.players[data.vRoom.u1id] && self.players[data.vRoom.u1id].entity)
                        self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u3id != -1)
                    if (self.players[data.vRoom.u3id] && self.players[data.vRoom.u3id].entity)
                        self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u4id != -1)
                    if (self.players[data.vRoom.u4id] && self.players[data.vRoom.u4id].entity)
                        self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.initiateForvRoom();
            }, 500);

        } else if (data.vRoom.u3id == Network.id) {
            setTimeout(() => {
                if (data.vRoom.u1id != -1)
                    if (self.players[data.vRoom.u1id] && self.players[data.vRoom.u1id].entity)
                        self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u2id != -1)
                    if (self.players[data.vRoom.u2id] && self.players[data.vRoom.u2id].entity)
                        self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u4id != -1)
                    if (self.players[data.vRoom.u4id] && self.players[data.vRoom.u4id].entity)
                        self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.initiateForvRoom();
            }, 500);
        } else if (data.vRoom.u4id == Network.id) {
            setTimeout(() => {
                if (data.vRoom.u1id != -1)
                    if (self.players[data.vRoom.u1id] && self.players[data.vRoom.u1id].entity)
                        self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u2id != -1)
                    if (self.players[data.vRoom.u2id] && self.players[data.vRoom.u2id].entity)
                        self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u3id != -1)
                    if (self.players[data.vRoom.u3id] && self.players[data.vRoom.u3id].entity)
                        self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.initiateForvRoom();
            }, 500);
        }
    });

    socket.on('vRoomJoined', function (data) {

        if (self.players[data.vRoom.u1id] && self.players[data.vRoom.u1id].entity)
            self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);
        if (self.players[data.vRoom.u2id] && self.players[data.vRoom.u2id].entity)
            self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);
        if (self.players[data.vRoom.u3id] && self.players[data.vRoom.u3id].entity)
            self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);
        if (self.players[data.vRoom.u4id] && self.players[data.vRoom.u4id].entity)
            self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);

        if (data.vRoom.u1id == Network.id || data.vRoom.u2id == Network.id || data.vRoom.u3id == Network.id || data.vRoom.u4id == Network.id) {

            self.entity.sound.play("joinCall");
            self.vRoomUI.enabled = true;
            self.roomPosX = data.vRoom.x;
            self.roomPosZ = data.vRoom.z;
            self.u1id = data.vRoom.u1id;
            self.u2id = data.vRoom.u2id;
            self.u3id = data.vRoom.u3id;
            self.u4id = data.vRoom.u4id;
            self.u1Pos = data.vRoom.u1Pos;
            self.u2Pos = data.vRoom.u2Pos;
            self.u3Pos = data.vRoom.u3Pos;
            self.u4Pos = data.vRoom.u4Pos;

            if (typeof window.parent.startCall !== "undefined")
                window.parent.startCall(data.vRoom.specialvID);

            if (data.vRoom.videoCallStarted) {
                self.vRoomUI.children[0].enabled = false;
                if (typeof window.parent.showCall !== "undefined")
                    window.parent.showCall();
            } else {
                self.vRoomUI.children[0].enabled = true;
            }

            self.app.fire("lockCamera");
            self.app.fire("lockMovement");
            self.vRoomID = data.vRoom.specialvID;
            self.ground.name = "round";
            self.playerModel.enabled = true;
            self.playerModel.children[0].script.vRoomCameraRotation.deact();
            // self.playerModel.children[0].setLocalEulerAngles(0,0,0);
        }

        if (data.vRoom.u1id == Network.id) {
            cameraLerpInstance.updatePosInstant(data.vRoom.u1Pos);
            cameraLerpInstance.updateLookAt(data.vRoom.u2Pos);
            self.updatePositionInstant(data.vRoom.u1Pos);

            setTimeout(() => {
                if (data.u2id != -1)
                    if (self.players[data.vRoom.u2id])
                        self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u3id != -1)
                    if (self.players[data.vRoom.u3id])
                        self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u4id != -1)
                    if (self.players[data.vRoom.u4id])
                        self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.initiateForvRoom();
            }, 0);


        } else if (data.vRoom.u2id == Network.id) {
            cameraLerpInstance.updatePosInstant(data.vRoom.u2Pos);
            cameraLerpInstance.updateLookAt(data.vRoom.u1Pos);
            self.updatePositionInstant(data.vRoom.u2Pos);

            setTimeout(() => {
                if (data.vRoom.u1id != -1)
                    if (self.players[data.vRoom.u1id])
                        self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u3id != -1)
                    if (self.players[data.vRoom.u3id])
                        self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u4id != -1)
                    if (self.players[data.vRoom.u4id])
                        self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.initiateForvRoom();
            }, 0);

        } else if (data.vRoom.u3id == Network.id) {
            cameraLerpInstance.updatePosInstant(data.vRoom.u3Pos);
            cameraLerpInstance.updateLookAt(data.vRoom.u4Pos);
            self.updatePositionInstant(data.vRoom.u3Pos);

            setTimeout(() => {
                if (data.vRoom.u1id != -1)
                    if (self.players[data.vRoom.u1id])
                        self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u2id != -1)
                    if (self.players[data.vRoom.u2id])
                        self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u4id != -1)
                    if (self.players[data.vRoom.u4id])
                        self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.initiateForvRoom();
            }, 0);
        } else if (data.vRoom.u4id == Network.id) {
            cameraLerpInstance.updatePosInstant(data.vRoom.u4Pos);
            cameraLerpInstance.updateLookAt(data.vRoom.u3Pos);
            self.updatePositionInstant(data.vRoom.u4Pos);

            setTimeout(() => {
                if (data.vRoom.u1id != -1)
                    if (self.players[data.vRoom.u1id])
                        self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u2id != -1)
                    if (self.players[data.vRoom.u2id])
                        self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.initiateForvRoom();
                if (data.vRoom.u3id != -1)
                    if (self.players[data.vRoom.u3id])
                        self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.initiateForvRoom();
            }, 0);
        }
    });

    socket.on('deletevRoom', function (data) {
        console.log("removing room :" + data);
        self.removevRoom(data);
    });

    socket.on('busyUser', function (data) {
        if (data.data.u1id == Network.id) {
            // alert(data.response);
            self.app.fire("alert", data.response);
            self.u1id = null;
            self.u2id = null;
            self.app.fire("unlockTheCam");
        }
    });

    socket.on('alertThem', function (data) {
        // alert(data.response);
        self.app.fire("alert", data.response);
    });
    // if(self.chatinit){
    // if(Network.socket!==null)
    //   Network.socket.emit ('initialize',{name: self.userName, vRoomID:-1, userid: self.fID, gender:self.gender, hat:self.hat ,glass: self.glass ,skin:self.skin ,dress:self.dress, roomID: self.roomID});//send player name also
    //}
};

Network.prototype.visibilityChanged = function (data) {
    console.log(data);
    var self = this;
    // if (this.initialized) 
    if (this.players[data.id]) {
        console.log("visibility change: " + data.visibility);
        if (data) {
            console.log("visibility changed: " + data.visibility);
            console.log(this.players[data.id].entity);
            var temp = data.visibility ? 0.392 : 0;
            this.players[data.id].entity.setLocalScale(temp, temp, temp);
            // this.players[data.id].entity.children[0].collision.enabled=data.visibility;
        }
    }
};

Network.prototype.requestvRoom = function (data) {
    var self = this;
    console.log(data);
    if (this.initialized) {
        if (Network.socket) {
            this.roomPosX = data.target.x;
            this.roomPosZ = data.target.z;
            self.u1id = Network.id;
            self.u2id = data.u2id;
            if (typeof window.parent.tutorialThreeComplete !== "undefined")
                window.parent.tutorialThreeComplete();
            Network.socket.emit('requestvRoom', { u1id: Network.id, uname: self.userName, u2id: data.u2id, x: data.target.x, z: data.target.z, u1Pos: data.u1Pos, u2Pos: data.u2Pos, u3Pos: data.u3Pos, u4Pos: data.u4Pos });
        }
    }
};

Network.prototype.joinvRoom = function (vRoomID) {
    if (this.initialized) {
        if (Network.socket) {
            Network.socket.emit('joinvRoom', { id: Network.id, vRoomID: vRoomID });//rotation data addition

        }
    }
};

Network.prototype.leavevRoom = function (vRoomID) {
    if (this.initialized) {
        if (Network.socket) {
            Network.socket.emit('leavevRoom', { vRoomID: vRoomID, id: Network.id });//rotation data addition
            if (typeof window.parent.leftvRoomInformer !== "undefined")
                window.parent.leftvRoomInformer();

        }
    }
};

Network.prototype.initializevRooms = function (data) {
    if (data === undefined) {
        // alert("data or player is undefined initialize player");
        console.log(data);
        console.log(data + " :data");

        return;
    }

    this.vRooms = data;
    //firebaseInstance.updateStatus();

    var self = this;
    console.log(data);
    var flagi = 0;
    for (var room in data) {
        // setTimeout(function(){
        self.vRooms[room].entity = self.createRoomEntity(data[room]);
        if( self.vRooms[room].u1id!=-1&&self.vRooms[room].u2id!=-1&&self.vRooms[room].u3id!=-1&&self.vRooms[room].u4id!=-1)
             self.vRooms[room].entity.script.vRoomHandler.setJoinShow(false);
        //  },500*flagi);
        flagi++;
    }
};

Network.prototype.createRoomEntity = function (data) {
    console.log(data);
    if (data === undefined) {
        // alert("data or player is undefined create player entity");
        console.log(data);
        console.log(data + " :data");

        return;
    }
    var newRoom = this.vRoom.clone();
    this.vRoomNo++;
    //newPlayer.enabled = true;
    //this.bots.enabled=false;
    this.vRoomParent.addChild(newRoom);
    newRoom.script.vRoomHandler.setvRoomID(data.specialvID);
    newRoom.setPosition(data.x, 0, data.z);
    newRoom.enabled = true;
    // this.otherParent.script.avatarloadHandler.addedChild(newPlayer);

    // this.otherParent.script.avatarloadHandler.addedChild(newPlayer);
    //console.log(newPlayer.getParent());
    // newPlayer.children[0].script.nameHandler.changeName(data.name);
    // newPlayer.children[0].script.pathFollower.setRandomStart();
    //newPlayer.children[0].script.otherHandler.setuid(data.userid);
    // console.log(data.userid);
    // console.log(data.id);
    // newPlayer.children[0].script.otherHandler.setFirebaseID(data.userid);
    // newPlayer.children[0].script.otherHandler.setNetworkID(data.id);

    // newPlayer.children[0].script.avatarHandler.updateAvatar(data);

    //     var vec3=new pc.Vec3();
    //     vec3.x=data.tx;
    //     vec3.y=data.ty;
    //     vec3.z=data.tz;

    //     if(vec3.x!==0)
    //         newPlayer.children[0].script.otherMove.movePlayerTo(vec3);
    // if (data)
    //     newPlayer.rigidbody.teleport(data.x, data.y, data.z);

    return newRoom;
};

Network.prototype.addvRoom = function (data) {
    console.log("add room");
    if (!data) {
        // alert("data or player is undefined addPlayer");
        console.log(data);
        console.log(data + " :data");

        return;
    }

    var self = this;

    if (data) {
        // console.log("player connnected: "+data.id);
        this.vRooms[data.specialvID] = data;
        this.vRooms[data.specialvID].entity = this.createRoomEntity(data);

    } else {
        console.log("data not defined :" + data);
    }

};

Network.prototype.removevRoom = function (data) {
    if (!data || !this.vRooms) {
        console.log(data);
        console.log(this.vRooms);
        console.log(data + " :data");
        return;
    }
    if (this.initialized) {
        if (this.vRooms[data.vRoomID]) {
            if (this.vRooms[data.vRoomID].entity) {
                this.vRoomNo--;
                this.vRooms[data.vRoomID].entity.destroy();
                this.vRooms[data.vRoomID].deleted = true;
            }
        }
    }
};

Network.prototype.initializePlayers = function (data) {
    console.log(data);
    var self = this;
    if (!data) {
        // alert("data or player is undefined initialize player");
        console.log(data);
        // console.log(data + " :data");
        return;
    }
    Network.id = data.id;
    netID = data.id;

    console.log(this.players);
    for (var key of Object.keys(data.players)) {
        console.log(key + " -> " +  data.players[key]);
        if(this.players[key]) {
            console.log(this.players[key]);
            console.log("player already exists: "+ data.players[key].name);
            break;
        }


        if(key != Network.id){
            this.players[key] = data.players[key];
            if (this.players[key].roomID === self.roomID) {
                this.players[key].entity = this.createPlayerEntity(this.players[key]);

                console.log("visibility:" + this.players[key].visibility);
                this.visibilityChanged({ id: key, visibility: this.players[key].visibility });
            }
        }
    }
    // this.players = data.players;
    //firebaseInstance.updateStatus();


    // for (var id in this.players) {
    //     // console.log(id + " :::::::: " + Network.id);
    //     if (id != Network.id) {
    //         // console.log(id + " :::::::: " + Network.id);
    //         if (this.players[id].roomID === self.roomID) {
    //             // setTimeout(function(){
                
    //             self.players[id].entity = self.createPlayerEntity(self.players[id]);

    //             console.log("visibility:" + self.players[id].visibility);
    //             self.visibilityChanged({ id: id, visibility: self.players[id].visibility });
    //             //  },500*flagi);
    //         }
    //     }
    // }

    this.initialized = true;
};
// Network.prototype.initializePlayers = function (data) {
//     console.log(data);
//     if (!data) {
//         // alert("data or player is undefined initialize player");
//         console.log(data);
//         console.log(data + " :data");

//         return;
//     }
//     // this.players = data;//data.players;
//     for(var z=0;z<data.length;z++){
//     }
//     Network.id = data.userid;
//     netID=data.userid;
//     //firebaseInstance.updateStatus();

//     var self = this;

//     var flagi = 0;
//     console.log(data.length);
//     for (var i = 0; i < data.length; i++) {
//         self.players[data[i].userid]= {entity:null,data:data[i],id:data[i].userid,no:-1,visibility:true,name:data[i].name,userid:data[i].userid,role:data[i].role,tx:0,ty:0,tz:0};
//         console.log(data[i].userid, self.fID);
//         if (data[i].userid != self.fID) {
//             // setTimeout(function(){
//             self.players[data[i].userid].entity = self.createPlayerEntity(data[i]);

//             // console.log("visibility:"+self.players[id].visibility);
//             // self.visibilityChanged({id:id,visibility:self.players[id].visibility});
//             //  },500*flagi);


//             flagi++;
//         }
//     }
//     // for(var id in this.players){
//     //     if(id != Network.id){
//     //         if(this.players[id].roomID===self.roomID){
//     //             // setTimeout(function(){
//     //             self.players[id].entity = self.createPlayerEntity(self.players[id]);    

//     //             console.log("visibility:"+self.players[id].visibility);
//     //             self.visibilityChanged({id:id,visibility:self.players[id].visibility});
//     //             //  },500*flagi);


//     //             flagi++;
//     //         }
//     //     }
//     // }

//     this.initialized = true;
//     //  console.log('initialized');
// };
Network.prototype.alertMaro=function(txt){
    this.app.fire("alert", txt);
};

Network.prototype.addPlayer = function (data) {
    if (!data) {
        // alert("data or player is undefined addPlayer");
        console.log(data);
        console.log(data + " :data");

        return;
    }

    var self = this;

    if (data) {
        if(this.players[data.id])
        {
            console.log(this.players[data.id]);
            console.log("Z Player already exists: "+data.name);
            return;
        }
        console.log(this.players[data.id]+" creating player: "+data.name);
        this.players[data.id] = data;

        if (this.players[data.id].roomID === self.roomID) {
            this.players[data.id].entity = this.createPlayerEntity(data);
            console.log("visibility:" + data.visibility);
            this.visibilityChanged(data);
        }
    } else {
        console.log("data not defined :" + data);
    }


};
// Network.prototype.addPlayer = function (data) {
//     if (!data) {
//         // alert("data or player is undefined addPlayer");
//         console.log(data);
//         console.log(data + " :data");

//         return;
//     }

//     var self = this;
//     console.log(data._data.name);
//     if (data) {
//         // console.log("player connnected: "+data.id);
//         this.players[data.data.userid] = {};

//         var dataz={avatar_data:data.data.data,name:data._data.name,role:data._data.role,userid:data._data.userid};
//         this.players[data.data.userid].entity = this.createPlayerEntity(dataz);
//         // console.log("visibility:" + data.visibility);
//         // this.visibilityChanged(data);
//     } else {
//         console.log("data not defined :" + data);
//     }


// };

Network.prototype.movePlayer = function (data) {
    var self = this;
    if (this.initialized) {
        if (this.players[data.id]) {
            if (!this.players[data.id].deleted) {
                var vec3 = new pc.Vec3();
                vec3.x = data.tx;
                vec3.y = data.ty;
                vec3.z = data.tz;
                this.players[data.id].entity.children[0].script.otherMove.movePlayerTo(vec3);
            }
        }
    }
};

Network.prototype.movePlayerInstant = function (data) {
    var self = this;
    if (this.initialized) {
        if (this.players[data.id]) {
            if (!this.players[data.id].deleted && data.roomID === self.roomID) {

                var playerEntity = this.players[data.id].entity;
                if (playerEntity) {
                    var vec3 = new pc.Vec3();
                    vec3.x = data.tx;
                    vec3.y = playerEntity.getPosition().y;
                    vec3.z = data.tz;

                    playerEntity.setPosition(vec3);
                    this.players[data.id].entity.children[0].script.otherMove.teleportPlayerTo(vec3);
                }
            }
        }
    }
};

// Network.prototype.changeEmoji = function (data) {
//     var self=this;
//     console.log("emoji change to "+data.emote);
//     console.log(data);
//     if (this.initialized) {
//         if(this.players[data.id]){

//                 if(specialZoneOtherInstance.otherUID===data.uid){
//                     console.log(self.emoteNames[data.emote]);
//                     specialZoneOtherInstance.otherModel.animation.loop=false;
//                     specialZoneOtherInstance.otherModel.animation.play(self.emoteNames[data.emote],0.5);

//                     // setTimeout(function(){    
//                     //      specialZoneOtherInstance.otherModel.animation.play('Idol.glb',2);
//                     //      specialZoneOtherInstance.otherModel.animation.loop=true;
//                     // },4000);
//                 }

//         }
//     }
// };


Network.prototype.removePlayer = function (data) {
    if (!data || !this.players) {
        // alert("data or player is undefined RemovePlayer");
        console.log(data);
        console.log(this.player);
        console.log(data + " :data");
        return;
    }
    if (this.initialized) {
        if (this.players[data]) {
            if (this.players[data].entity) {
                this.no--;
                this.otherParent.script.avatarloadHandler.removedChild(this.players[data].entity.enabled);
                this.players[data].entity.destroy();
                this.players[data].deleted = true;
                this.players[data]=null;
            }
        }
    }
};

Network.prototype.createPlayerEntity = function (data) {
    if (!data) {
        // alert("data or player is undefined create player entity");
        console.log(data);
        console.log(data + " :data");

        return;
    }

    
    console.log("Player Created");
    console.log("data is: " + data.name + data.role);
    var newPlayer = this.other.clone();
    this.no++;
    //newPlayer.enabled = true;
    //this.bots.enabled=false;
    this.otherParent.addChild(newPlayer);
    this.otherParent.script.avatarloadHandler.addedChild(newPlayer);


    // this.otherParent.script.avatarloadHandler.addedChild(newPlayer);
    //console.log(newPlayer.getParent());
    newPlayer.children[0].script.nameHandler.changeName(data.name, data.role);
    // newPlayer.children[0].script.pathFollower.setRandomStart();
    //newPlayer.children[0].script.otherHandler.setuid(data.userid);
    console.log(data.userid);
    console.log(data.id);
    newPlayer.children[0].script.otherHandler.setFirebaseID(data.userid);
    newPlayer.children[0].script.otherHandler.setvRoomID(data.vRoomID);
    newPlayer.children[0].script.otherHandler.setNetworkID(data.id);
    newPlayer.children[0].script.negotiationAvatarUpdate.applyAvatarDetails(data);
    newPlayer.children[0].script.avatarHandler.updateAvatar(data);

    var vec3 = new pc.Vec3();
    vec3.x = data.tx;
    vec3.y = data.ty;
    vec3.z = data.tz;

    if (vec3.x !== 0)
        newPlayer.children[0].script.otherMove.teleportPlayerTo(vec3);
    // if (data)
    //     newPlayer.rigidbody.teleport(data.x, data.y, data.z);

    return newPlayer;
};

// Network.prototype.createPlayerEntity = function (data) {
//     if (!data) {
//         // alert("data or player is undefined create player entity");
//         console.log(data);
//         console.log(data + " :data");

//         return;
//     }
//     console.log("data is: " + data.name + data.role);
//     var newPlayer = this.other.clone();
//     this.no++;
//     //newPlayer.enabled = true;
//     //this.bots.enabled=false;
//     this.otherParent.addChild(newPlayer);
//     this.otherParent.script.avatarloadHandler.addedChild(newPlayer);


//     // this.otherParent.script.avatarloadHandler.addedChild(newPlayer);
//     //console.log(newPlayer.getParent());
//     newPlayer.children[0].script.nameHandler.changeName(data.name, data.role);
//     // newPlayer.children[0].script.pathFollower.setRandomStart();
//     //newPlayer.children[0].script.otherHandler.setuid(data.userid);
//     console.log(data.userid);
//     console.log(data.id);
//     newPlayer.children[0].script.otherHandler.setFirebaseID(data.userid);
//     // newPlayer.children[0].script.otherHandler.setvRoomID(data.vRoomID);
//     newPlayer.children[0].script.otherHandler.setNetworkID(data.userid);
//     newPlayer.children[0].script.negotiationAvatarUpdate.applyAvatarDetails(data.avatar_data);
//     newPlayer.children[0].script.avatarHandler.updateAvatar(data.avatar_data);

//     var vec3 = new pc.Vec3();
//     vec3.x = 0;//data.tx;
//     vec3.y = 0;//data.ty;
//     vec3.z = 0;//data.tz;

//     if (vec3.x !== 0)
//         newPlayer.children[0].script.otherMove.teleportPlayerTo(vec3);
//     // if (data)
//     //     newPlayer.rigidbody.teleport(data.x, data.y, data.z);

//     return newPlayer;
// };


// Network.prototype.socketInit = function (dt) {

// };
var onceSocket = true;
Network.prototype.update = function (dt) {
    this.totalText.element.text = "" + this.no;  //User Count

    if (onceSocket) {
        if (socketInstance && networkInstance) {
            var self = networkInstance;
            onceSocket = false;
            console.log("socket found");
            // window.parent.socketRef.emit('avatar:allUsersAvatar',null);
            socketInstance.emit('updateUserLocation', "lobby");
            // socketInstance.on('avatar:allUsersAvatar:lobby', function (data) {
            //     console.log("getAllUserDetails: " + data);
            //     // self.initializePlayers(data);
            // });
            socketInstance.emit('getUserDetails');
            socketInstance.on('getUserDetails', function (data) {
                console.log("getUserDetails: " + data.name);
                self.userName = data.name;
                self.myRole = data.role;
            });
            // socketInstance.on('avatar:joined:lobby', function (data) {
            //     console.log("avatar:joined:lobby " + data);
            //     // self.addPlayer(data);
            // });

            socketInstance.emit('avatar:userAvatar', "lobby");
            socketInstance.on('avatar:userAvatar', function ({ data, _data }) {
                if (self.itsDone)
                    return;
                var avatarDetails = data.data;
                console.log(avatarDetails);
                console.log("name: " + _data.name);
                self.fID = data.userid;

                self.userName = _data.name;
                self.myRole = _data.role;
                self.genderData = avatarDetails.genderData;
                self.mhairData = avatarDetails.mhairData;
                self.mtopData = avatarDetails.mtopData;
                self.mskinColorData = avatarDetails.mskinColorData;
                self.glassesF = avatarDetails.glassesF;
                self.glassesM = avatarDetails.glassesM;
                self.beard = avatarDetails.beard;

                self.fhairData = avatarDetails.fhairData;
                self.ftopData = avatarDetails.ftopData;
                self.flagData = avatarDetails.flagData;
                self.fskinColorData = avatarDetails.fskinColorData;

                self.mhairColorData = avatarDetails.mhairColorData;
                self.mbottomColorData = avatarDetails.mbottomColorData;
                self.mtop1ColorData = avatarDetails.mtop1ColorData;
                self.mtop2ColorData = avatarDetails.mtop2ColorData;
                self.mtop3ColorData = avatarDetails.mtop3ColorData;
                self.mtop4ColorData = avatarDetails.mtop4ColorData;
                self.ftop1ColorData = avatarDetails.ftop1ColorData;
                self.ftop2ColorData = avatarDetails.ftop2ColorData;
                self.ftop3ColorData = avatarDetails.ftop3ColorData;
                self.ftop4ColorData = avatarDetails.ftop4ColorData;
                self.fhairColorData = avatarDetails.fhairColorData;
                self.fbottomColorData = avatarDetails.fbottomColorData;
                self.frame = avatarDetails.frame;
                self.frameColorData = avatarDetails.frameColorData;

                self.playerModelHandler.script.playerModelHandler.applyAvatarDetails(avatarDetails);
                socketInstance.emit('enteredLobby', {
                    name: self.userName, role: self.myRole, vRoomID: -1, userid: data.userid, glassesM: avatarDetails.glassesM, glassesF: avatarDetails.glassesF, beard: avatarDetails.beard, genderData: avatarDetails.genderData, mhairData: avatarDetails.mhairData, mtopData: avatarDetails.mtopData, mskinColorData: avatarDetails.mskinColorData, fhairData: avatarDetails.fhairData, ftopData: avatarDetails.ftopData, fskinColorData: avatarDetails.fskinColorData, roomID: self.roomID,
                    mhairColorData: avatarDetails.mhairColorData,
                    mbottomColorData: avatarDetails.mbottomColorData,
                    mtop1ColorData: avatarDetails.mtop1ColorData,
                    mtop2ColorData: avatarDetails.mtop2ColorData,
                    mtop3ColorData: avatarDetails.mtop3ColorData,
                    mtop4ColorData: avatarDetails.mtop4ColorData,
                    ftop1ColorData: avatarDetails.ftop1ColorData,
                    ftop2ColorData: avatarDetails.ftop2ColorData,
                    ftop3ColorData: avatarDetails.ftop3ColorData,
                    ftop4ColorData: avatarDetails.ftop4ColorData,
                    flagData: avatarDetails.flagData,
                    fhairColorData: avatarDetails.fhairColorData,
                    frame: avatarDetails.frame,
                    frameColorData: avatarDetails.frameColorData,
                    fbottomColorData: avatarDetails.fbottomColorData
                });
                self.itsDone = true;
            });

            socketInstance.on('playerData', function (data) {
                self.initializevRooms(data.vRooms);
                self.initializePlayers(data);
            });
            socketInstance.on('playerJoined', function (data) {
                self.addPlayer(data);
            });
            socketInstance.on('killPlayer', function (data) {
                console.log("killplayer: " + data);
                self.removePlayer(data);
            });
            socketInstance.on('playerMoved', function (data) {
                self.movePlayer(data);
            });
            socketInstance.on('playerMovedInstant', function (data) {
                self.movePlayerInstant(data);
            });
            socketInstance.on('visibilityChange', function (data) {
                self.visibilityChanged(data);
            });

            socketInstance.on('userLeftvRoom', function (data) {
                if (self.players[data.id] && self.players[data.id].entity && self.players[data.id].entity.children[0])
                    self.players[data.id].entity.children[0].script.otherHandler.setvRoomID(-1);//setOccupancy(true);
            
                if(self.vRooms[data.vRoomID])
                    self.vRooms[data.vRoomID].entity.script.vRoomHandler.setJoinShow(true);
           
                if (data.vRoomID == self.vRoomID) {
                    if (self.players[data.id])
                        if (self.players[data.id].entity)
                            if (self.players[data.id].entity.children[0])
                                self.players[data.id].entity.children[0].script.otherHandler.endForvRoom();

                }
            });
            socketInstance.on('requestedPermission', function (data) {
                if (data.u2id == Network.id) {
                    self.requestText.element.text = "" + data.uname + "";
                    self.vRoomRequest.enabled = true;
                    self.app.fire("lockCamera");
                    self.app.fire("lockMovement");
                }

                if (data.u2id == Network.id || data.u1id == Network.id) {
                    self.roomPosX = data.x;
                    self.roomPosZ = data.z;
                    self.u1id = data.u1id;
                    self.u2id = data.u2id;
                    self.u1Pos = data.u1Pos;
                    self.u2Pos = data.u2Pos;
                    self.u3Pos = data.u3Pos;
                    self.u4Pos = data.u4Pos;
                    if (typeof window.parent.tutorialThreeComplete !== "undefined")
                        window.parent.tutorialThreeComplete();
                }
            });

            socketInstance.on('vRoomDenied', function (data) {
                self.u1id = null;
                self.u2id = null;
                console.log(data);
                if (data.data.denierID == Network.id)
                    return;

                if (data.data.u2id == Network.id) {
                    // window.alert(data.response2);
                    self.app.fire("alert", data.response2);
                    self.vRoomRequest.enabled = false;
                    self.app.fire("unlockCamera");
                    self.app.fire("unlockMovement");
                }

                if (data.data.u1id == Network.id) {
                    // window.alert(data.response1);
                    self.app.fire("alert", data.response1);
                    if (data.userLeft) {
                        self.borders.enabled = false;
                        self.app.fire("unlockCamera");
                        self.app.fire("unlockMovement");
                    }
                    else
                        self.app.fire("unlockTheCam");
                }
            });

            socketInstance.on('vRoomCreated', function (data) {
                console.log(data);
                self.addvRoom(data.newvRoom);
                console.log(self.players[data.u1id]);

                if (self.players[data.u1id] && self.players[data.u1id].entity)
                    self.players[data.u1id].entity.children[0].script.otherHandler.setvRoomID(data.newvRoom.specialvID);//setOccupancy(false);

                if (self.players[data.u2id] && self.players[data.u2id].entity)
                    self.players[data.u2id].entity.children[0].script.otherHandler.setvRoomID(data.newvRoom.specialvID);//.setOccupancy(false);

                if (data.u2id == Network.id || data.u1id == Network.id) {

                    self.entity.sound.play("joinCall");
                    self.roomPosX = data.newvRoom.x;
                    self.roomPosZ = data.newvRoom.z;
                    self.u1id = data.newvRoom.u1id;
                    self.u2id = data.newvRoom.u2id;
                    self.u1Pos = data.newvRoom.u1Pos;
                    self.u2Pos = data.newvRoom.u2Pos;
                    self.u3Pos = data.newvRoom.u3Pos;
                    self.u4Pos = data.newvRoom.u4Pos;

                    self.vRoomUI.children[0].enabled = false;
                    // if (typeof window.parent.showCall !== "undefined")
                    //     window.parent.showCall();

                    if (typeof window.parent.joinvRoomInformer !== "undefined") {
                        window.parent.joinvRoomInformer();
                    }
                    if (typeof window.parent.tutorialThreeComplete !== "undefined")
                        window.parent.tutorialThreeComplete();
                }
                //teleport
                if (data.u2id == Network.id) {

                    self.vRoomID = data.newvRoom.specialvID;
                    cameraLerpInstance.updatePosInstant(data.u2Pos);
                    var vec3 = new pc.Vec3();
                    vec3.x = data.x;
                    vec3.y = 0;
                    vec3.z = data.z;
                    cameraLerpInstance.updateLookAt(data.u1Pos);
                    self.updatePosition(data.u2Pos);
                    self.vRoomUI.enabled = true;
                    // self.vRoomUI.children[0].enabled = true;

                    if (typeof window.parent.startCall !== "undefined")
                        window.parent.startCall(data.newvRoom.specialvID);

                    if (self.players[data.u1id]) {
                        self.players[data.u1id].entity.children[0].script.otherMove.teleportPlayerTo(data.u1Pos);
                        self.players[data.u1id].entity.children[0].script.otherHandler.initiateForvRoom();
                    }
                    // self.players[data.u1id].entity.children[0].script.otherMove.lookAtPos(vec3);

                    self.ground.name = "round";
                    self.playerModel.enabled = true;
                    self.playerModel.children[0].script.vRoomCameraRotation.deact();
                    // self.playerModel.children[0].setLocalEulerAngles(0,0,0);
                }
                else if (data.u1id == Network.id) {
                    self.vRoomID = data.newvRoom.specialvID;
                    self.borders.enabled = false;
                    self.vRoomUI.enabled = true;
                    // self.vRoomUI.children[0].enabled = true;

                    if (typeof window.parent.startCall !== "undefined")
                        window.parent.startCall(data.newvRoom.specialvID);

                    self.ground.name = "round";
                    setTimeout(() => {
                        self.playerModel.enabled = true;
                        self.playerModel.children[0].script.vRoomCameraRotation.deact();
                        // self.playerModel.children[0].setLocalEulerAngles(0,0,0);
                    }, 500);
                }
            });

            socketInstance.on('startedVideoCallvRoom', function (data) {
                if (data.u1id == Network.id || data.u2id == Network.id || data.u3id == Network.id || data.u4id == Network.id) {
                    self.vRoomUI.children[0].enabled = false;
                    if (typeof window.parent.showCall !== "undefined")
                        window.parent.showCall();
                }
            });

            socketInstance.on('vRoomJoinedForOthers', function (data) {
                console.log(self.players[data.data.id]);
                console.log(data.data.id);
                if (self.players[data.data.id])
                    if(self.players[data.data.id].entity)
                        if(self.players[data.data.id].entity.children[0])
                            self.players[data.data.id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);
                // if(self.players[data.vRoom.u1id]&&self.players[data.vRoom.u1id].entity)
                //     self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);
                // if(self.players[data.vRoom.u2id]&&self.players[data.vRoom.u2id].entity)
                //     self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);
                // if(self.players[data.vRoom.u3id]&&self.players[data.vRoom.u3id].entity)
                //     self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);
                // if(self.players[data.vRoom.u4id]&&self.players[data.vRoom.u4id].entity)
                //     self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);
                if(data.vRoom.u1id!=-1&&data.vRoom.u2id!=-1&&data.vRoom.u3id!=-1&&data.vRoom.u4id!=-1){
                    self.vRooms[data.data.vRoomID].entity.script.vRoomHandler.setJoinShow(false);
                }

                if (data.vRoom.u1id == Network.id || data.vRoom.u2id == Network.id || data.vRoom.u3id == Network.id || data.vRoom.u4id == Network.id)
                    self.entity.sound.play("joinCall");
                if (data.vRoom.u1id == Network.id) {
                    setTimeout(() => {
                        if (data.u2id != -1)
                            if (self.players[data.vRoom.u2id] && self.players[data.vRoom.u2id].entity)
                                self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u3id != -1)
                            if (self.players[data.vRoom.u3id] && self.players[data.vRoom.u3id].entity)
                                self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u4id != -1)
                            if (self.players[data.vRoom.u4id] && self.players[data.vRoom.u4id].entity)
                                self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.initiateForvRoom();
                    }, 500);

                } else if (data.vRoom.u2id == Network.id) {

                    setTimeout(() => {
                        if (data.vRoom.u1id != -1)
                            if (self.players[data.vRoom.u1id] && self.players[data.vRoom.u1id].entity)
                                self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u3id != -1)
                            if (self.players[data.vRoom.u3id] && self.players[data.vRoom.u3id].entity)
                                self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u4id != -1)
                            if (self.players[data.vRoom.u4id] && self.players[data.vRoom.u4id].entity)
                                self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.initiateForvRoom();
                    }, 500);

                } else if (data.vRoom.u3id == Network.id) {
                    setTimeout(() => {
                        if (data.vRoom.u1id != -1)
                            if (self.players[data.vRoom.u1id] && self.players[data.vRoom.u1id].entity)
                                self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u2id != -1)
                            if (self.players[data.vRoom.u2id] && self.players[data.vRoom.u2id].entity)
                                self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u4id != -1)
                            if (self.players[data.vRoom.u4id] && self.players[data.vRoom.u4id].entity)
                                self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.initiateForvRoom();
                    }, 500);
                } else if (data.vRoom.u4id == Network.id) {
                    setTimeout(() => {
                        if (data.vRoom.u1id != -1)
                            if (self.players[data.vRoom.u1id] && self.players[data.vRoom.u1id].entity)
                                self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u2id != -1)
                            if (self.players[data.vRoom.u2id] && self.players[data.vRoom.u2id].entity)
                                self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u3id != -1)
                            if (self.players[data.vRoom.u3id] && self.players[data.vRoom.u3id].entity)
                                self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.initiateForvRoom();
                    }, 500);
                }
            });

            socketInstance.on('vRoomJoined', function (data) {

                if (self.players[data.vRoom.u1id] && self.players[data.vRoom.u1id].entity)
                    self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);
                if (self.players[data.vRoom.u2id] && self.players[data.vRoom.u2id].entity)
                    self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);
                if (self.players[data.vRoom.u3id] && self.players[data.vRoom.u3id].entity&&self.players[data.vRoom.u3id].entity.children[0])
                    self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);
                if (self.players[data.vRoom.u4id] && self.players[data.vRoom.u4id].entity&&self.players[data.vRoom.u4id].entity.children[0])
                    self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.setvRoomID(data.vRoom.specialvID);//.setOccupancy(false);

                if (data.vRoom.u1id == Network.id || data.vRoom.u2id == Network.id || data.vRoom.u3id == Network.id || data.vRoom.u4id == Network.id) {
                    if (typeof window.parent.joinvRoomInformer !== "undefined") {
                        window.parent.joinvRoomInformer();
                    }
                    if (typeof window.parent.tutorialThreeComplete !== "undefined")
                        window.parent.tutorialThreeComplete();
                    self.entity.sound.play("joinCall");
                    self.vRoomUI.enabled = true;
                    self.roomPosX = data.vRoom.x;
                    self.roomPosZ = data.vRoom.z;
                    self.u1id = data.vRoom.u1id;
                    self.u2id = data.vRoom.u2id;
                    self.u3id = data.vRoom.u3id;
                    self.u4id = data.vRoom.u4id;
                    self.u1Pos = data.vRoom.u1Pos;
                    self.u2Pos = data.vRoom.u2Pos;
                    self.u3Pos = data.vRoom.u3Pos;
                    self.u4Pos = data.vRoom.u4Pos;

                    if (typeof window.parent.startCall !== "undefined")
                        window.parent.startCall(data.vRoom.specialvID);

                    if (data.vRoom.videoCallStarted) {
                        self.vRoomUI.children[0].enabled = false;
                        if (typeof window.parent.showCall !== "undefined")
                            window.parent.showCall();
                    } else {
                        self.vRoomUI.children[0].enabled = true;
                    }

                    self.app.fire("lockCamera");
                    self.app.fire("lockMovement");
                    self.vRoomID = data.vRoom.specialvID;
                    self.ground.name = "round";
                    self.playerModel.enabled = true;
                    self.playerModel.children[0].script.vRoomCameraRotation.deact();
                    // self.playerModel.children[0].setLocalEulerAngles(0,0,0);
                }

                if (data.vRoom.u1id == Network.id) {
                    cameraLerpInstance.updatePosInstant(data.vRoom.u1Pos);
                    cameraLerpInstance.updateLookAt(data.vRoom.u2Pos);
                    self.updatePositionInstant(data.vRoom.u1Pos);

                    setTimeout(() => {
                        if (data.u2id != -1)
                            if (self.players[data.vRoom.u2id])
                                self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u3id != -1)
                            if (self.players[data.vRoom.u3id])
                                self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u4id != -1)
                            if (self.players[data.vRoom.u4id])
                                self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.initiateForvRoom();
                    }, 0);


                } else if (data.vRoom.u2id == Network.id) {
                    cameraLerpInstance.updatePosInstant(data.vRoom.u2Pos);
                    cameraLerpInstance.updateLookAt(data.vRoom.u1Pos);
                    self.updatePositionInstant(data.vRoom.u2Pos);

                    setTimeout(() => {
                        if (data.vRoom.u1id != -1)
                            if (self.players[data.vRoom.u1id])
                                self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u3id != -1)
                            if (self.players[data.vRoom.u3id])
                                self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u4id != -1)
                            if (self.players[data.vRoom.u4id])
                                self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.initiateForvRoom();
                    }, 0);

                } else if (data.vRoom.u3id == Network.id) {
                    cameraLerpInstance.updatePosInstant(data.vRoom.u3Pos);
                    cameraLerpInstance.updateLookAt(data.vRoom.u4Pos);
                    self.updatePositionInstant(data.vRoom.u3Pos);

                    setTimeout(() => {
                        if (data.vRoom.u1id != -1)
                            if (self.players[data.vRoom.u1id])
                                self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u2id != -1)
                            if (self.players[data.vRoom.u2id])
                                self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u4id != -1)
                            if (self.players[data.vRoom.u4id])
                                self.players[data.vRoom.u4id].entity.children[0].script.otherHandler.initiateForvRoom();
                    }, 0);
                } else if (data.vRoom.u4id == Network.id) {
                    cameraLerpInstance.updatePosInstant(data.vRoom.u4Pos);
                    cameraLerpInstance.updateLookAt(data.vRoom.u3Pos);
                    self.updatePositionInstant(data.vRoom.u4Pos);

                    setTimeout(() => {
                        if (data.vRoom.u1id != -1)
                            if (self.players[data.vRoom.u1id])
                                self.players[data.vRoom.u1id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u2id != -1)
                            if (self.players[data.vRoom.u2id])
                                self.players[data.vRoom.u2id].entity.children[0].script.otherHandler.initiateForvRoom();
                        if (data.vRoom.u3id != -1)
                            if (self.players[data.vRoom.u3id])
                                self.players[data.vRoom.u3id].entity.children[0].script.otherHandler.initiateForvRoom();
                    }, 0);
                }
            });

            socketInstance.on('deletevRoom', function (data) {
                console.log("removing room :" + data);
                self.removevRoom(data);
            });

            socketInstance.on('busyUser', function (data) {
                if (data.data.u1id == Network.id) {
                    // alert(data.response);
                    self.app.fire("alert", data.response);
                    self.u1id = null;
                    self.u2id = null;
                    self.app.fire("unlockTheCam");
                }
            });

            socketInstance.on('alertThem', function (data) {
                // alert(data.response);
                self.app.fire("alert", data.response);
            });

            setInterval(()=>{
                socketInstance.emit("requestPlayersList");

            },5000);
            socketInstance.on("playersList",function(data){
                console.log(data);
                var debuggerz=window.parent.document.getElementById("debugger");
                if(debuggerz){
                    debuggerz.innerHTML="<b>Debug View:</b><br>";
                    // console.log(Object.keys(self.players));
                    for(var i=0;i<Object.keys(data).length;i++){
                        debuggerz.innerHTML+="<br> <b>Name:</b> "+data[Object.keys(data)[i]].name;
                        debuggerz.innerHTML+="<br> <b>ID:</b> "+data[Object.keys(data)[i]].id;
                        debuggerz.innerHTML+="<br> <b>inCallID:</b> "+data[Object.keys(data)[i]].vRoomID;
                        debuggerz.innerHTML+="<br> <b>isVisible:</b> "+data[Object.keys(data)[i]].visibility;
                        debuggerz.innerHTML+="<br> <b>serverPosition:</b> ["+data[Object.keys(data)[i]].tx+", "+data[Object.keys(data)[i]].ty+", "+data[Object.keys(data)[i]].tz+"]";
                        // if(self.players[Object.keys(self.players)[i]])
                        // debuggerz.innerHTML+="<br> <b>localPositon:</b> "+self.players[Object.keys(self.players)[i]].entity.localPosition;
                        debuggerz.innerHTML+="<br>";
                    }
                }
            });
        }
    }
    // console.log(networkInstance);
};

Network.prototype.onSwitchScene = function (target) {
    if (this.initialized) {
        if (Network.socket)
            Network.socket.emit('letsDisc');//rotation data addition
    }
};

Network.prototype.updatePosition = function (target) {
    if (this.initialized) {
        if (Network.socket)
            Network.socket.emit('positionUpdate', { roomID: this.roomID, id: Network.id, tx: target.x, ty: target.y, tz: target.z });//rotation data addition
    }
};

Network.prototype.updatePositionInstant = function (target) {
    if (this.initialized) {
        if (Network.socket)
            Network.socket.emit('positionUpdateInstant', { roomID: this.roomID, id: Network.id, tx: target.x, ty: target.y, tz: target.z });//rotation data addition
    }
};
Network.prototype.changeVisibility = function (data) {

    if (Network.socket) {
        console.log("visibility :" + data);
        Network.socket.emit('visiblityChanged', { id: Network.id, visibility: data });//rotation data addition
    }

};

// Network.prototype.fireSignal = function (data) {
//      var self=this;
//     self.app.fire(""+data);
// };
Network.prototype.sendleavevRoomCall = function () {
    this.app.fire("leavevRoomCall");
};
window.parent.leavevRoomCallNow = function () {
    if (networkInstance)
        networkInstance.sendleavevRoomCall();
};
window.parent.showInLobby = function () {
    if (networkInstance)
        networkInstance.changeVisibility(true);
};
window.parent.hideInLobby = function () {
    if (networkInstance)
        networkInstance.changeVisibility(false);
};
window.parent.switchScene = function (data) {
    console.log("trying to switch the scene: " + data);
    if (networkInstance)
        networkInstance.onSwitchScene();

    if (typeof window.parent.switchSceneInformer !== "undefined")
        window.parent.switchSceneInformer(data);
};
// window.parent.vCallHangUp=function(){
//     networkInstance.fireSignal("leavevRoomCall");
// };