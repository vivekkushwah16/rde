var ServerLoadTest = pc.createScript('serverLoadTest');

ServerLoadTest.attributes.add('roomID',{type:'number',default:1});
ServerLoadTest.attributes.add("url",{type:'string',default:'https://real-multiplayer.glitch.me'});

// initialize code called once per entity
ServerLoadTest.prototype.initialize = function() {
   //this.initz(0);
   // console.log("on");
    
    this.id="0";
    this.timer=0;
    this.init=false;
};

ServerLoadTest.prototype.initz=function(i){
    var self=this;
    
    // var counterLink="https://counter-multiplayer.glitch.me/";
    // pc.http.get(counterLink, function (err, response) {
    //        self.initSocket("https://real-multiplayer-"+response+".glitch.me",i);
    // });
    
    self.initSocket(self.url);
     // self.initSocket("https://www.madovertech.site");
    // this.socket = io.connect(self.url); // Google hosted server
    //    this.socket = io.connect("https://www.madovertech.site"); // Google hosted server
    // this.socket.on ('playerData', function (data) {
    //     self.initializePlayers (data);
    // });
    
    // this.socket.on ('playerJoined', function (data) {
    //     //self.addPlayer(data);
    // });
    // this.socket.on ('killPlayer', function (data) {
    //     //self.removePlayer(data);
    // });
    // this.socket.on ('changeEmoji', function (data) {
    //    // self.changeEmote(data);
    // });
    // this.socket.on ('playerMoved', function (data) {
    //   //  self.movePlayer(data);
    // });
    
  
};

ServerLoadTest.prototype.initSocket=function(url,i){
    var self=this;
    this.socket = io.connect(url);
    this.no=i;
   // console.log(url);
   // Network.socket = socket;
    this.socket.on ('playerData', function (data) {
        self.initializePlayers (data);
    });
    
    if(this.socket)
        this.socket.emit ('initialize',{name: 'User '+i, userid: 'aa', gender: Math.floor(pc.math.random(0,2)), hat: Math.floor(pc.math.random(0,2)) ,glass: Math.floor(pc.math.random(0,2)) ,skin: Math.floor(pc.math.random(0,5)) ,dress: Math.floor(pc.math.random(0,5)), roomID: self.roomID, no:i});//send player name also
};


ServerLoadTest.prototype.initializePlayers = function(data) {
    if(!data)
    {
        // alert("data or player is undefined initialize player");
        console.log(data + " :data"); 
        return;
    }
    
    this.id=data.id;
    this.init=true;
    console.log('initialized '+data.id);
};

// update code called every frame
ServerLoadTest.prototype.update = function(dt) {
    if(this.id==="0"){
        return;
    }
    
    this.timer+=dt;
    if(this.timer>1){
    //    this.updatePosition();
        this.timer=0;
    }
};

ServerLoadTest.prototype.updatePosition = function () {
    // var target=new pc.Vec3(pc.math.random(-40,40),0,pc.math.random(-50,50));
   //  this.socket.emit('positionUpdate', {roomID: this.roomID, id: this.id, tx: target.x, ty: target.y, tz: target.z});//rotation data addition
};
// swap method called for script hot-reloading
// inherit your script state here
// ServerLoadTest.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/