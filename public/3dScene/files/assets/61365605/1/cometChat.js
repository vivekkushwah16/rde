var CometChat = pc.createScript('cometChat');

CometChat.attributes.add('logout',{type:'entity'});

var CometChatInstance;
// initialize code called once per entity
CometChat.prototype.initialize = function() {
    const div = document.createElement('div');
    div.id = "cometchat";
    document.body.appendChild(div);
    
    CometChatInstance = this;
    this.__initalizedCometCHat = false;
    this.ChatWrapper = {
        Docked: 'true',
        widgetID: '94ee9dda-217a-46ab-8d6d-1e021cb99873',
        widgetID2: '8b2f39ef-b20a-4f14-873f-9e9d8996729e',
        toggleChatWindow: (value) => {
            CometChatWidget.openOrCloseChat(value);
        },
        openChat: (userUid) => {
            CometChatWidget.chatWithUser(userUid);
        },
        createUser: (userName, uid, callback) => {
            CometChatWidget.createOrUpdateUser({
                "uid": uid,
                "name": userName
            }).then(response => {
                if (callback) {
                    callback(null, response);
                }
            }, error => {
                console.log("User login failed with error:", error);
                if (callback) {
                    callback(error, null);
                }
            });
        },
        Login: (uid, callback) => {
            CometChatWidget.login({
                "uid": uid
            }).then(response => {
                console.log('uid logged in -', uid, response);
                if (callback)
                    callback(null, response);
            }, error => {
                console.log('uid logged in -', uid);
                console.log("User login failed with error:", error);
                if (callback) {
                    callback(error, null);
                }
            });
        },
        launchDockerWindow: (callback) => {
            CometChatWidget.launch({
                "widgetID": '8b2f39ef-b20a-4f14-873f-9e9d8996729e',
                "target": "#cometchat",
                "roundedCorners": "true",
                "docked": 'true',
                "alignment": "right",
                "height": "600px",
                "width": "800px",
                "defaultID": 'shubhamdj', //default UID (user) or GUID (group) to show,
                "defaultType": 'user' //user or group
            }).then(function(res){
                if(callback){callback(null, res);}
            }, function (err){
                if(callback){callback(err, null);}
            });
        },
        launchWindow: (callback) => {
            CometChatWidget.launch({
                "widgetID": '94ee9dda-217a-46ab-8d6d-1e021cb99873',
                "target": "#cometchat",
                "roundedCorners": "true",
                "docked": 'false',
                "alignment": "right",
                "height": "600px",
                "width": "800px",
                "defaultID": 'shubhamdj', //default UID (user) or GUID (group) to show,
                "defaultType": 'user' //user or group
            }).then(function(res){
                if(callback){callback(null, res);}
            }, function (err){
                if(callback){callback(err, null);}
            });
        },
        Logout: (callback) => CometChatWidget.logout().then(function(res){
                if(callback){callback(null, res);}
            }, function (err){
                if(callback){callback(err, null);}
            }),
        appID: '29202a7f1cb706c',
        appRegion: "us",
        authKey: "6df1996a4e6f06bc76e67d8419df534f1359a48e",
        defaultID: 'shubhamdj',
    };
    
     CometChatWidget.init({
        "appID": this.ChatWrapper.appID,
        "appRegion": this.ChatWrapper.appRegion,
        "authKey": this.ChatWrapper.authKey
    }).then(response => {
        console.log("Initialization completed successfully");
       this.__initalizedCometCHat = true;
    }, error => {
        console.log("Initialization failed with error:", error);
    });  
    
    this.logout.element.on('click',()=>{
        this.ChatWrapper.Logout((err, res)=>{
            if(err){
                window.alert(err);
            }else{   
                firebaseInstance.logout();  
            }
        });
    });
    
    this.app.on('triggerChat', (user)=>{
        this.triggerConv(user.uid);
    });
};



CometChat.prototype.openWindow = function(retry = false) {
    console.log(this.__initalizedCometCHat);
    if(this.__initalizedCometCHat){
         var self = this;
        LiveChatInstance.init();
         this.ChatWrapper.launchDockerWindow(function(err, res){
        console.log(err, res);
             if(err){
                 console.log(err);
                if (err === 'CometChat Widget Error: User not logged in.') {
                    self.loginIntoChat(firebaseInstance.user);
                   // self.ChatWrapper.Login(firebaseInstance.user.uid, (err, res)=>{
                   //     self.ChatWrapper.launchDockerWindow();
                   // });
                }
             }else{
                 if(__SceneInitalized){
                     var cw = document.getElementById("cometchat__widget");
                       if(cw){
                            cw.style.display = 'block';
                        } 
                 }
                  
                console.log('opened');        
                 self.app.fire("chatInitialized","");
             }
         });
    }else{
         if(retry){
                this.openWindow(true);
         }   
    }
};

CometChat.prototype.initChat = function (name, user) {
  this.ChatWrapper.createUser(name, user.uid, (err, res) => {
    if (err) {
      window.alert(err);
    } else {
      this.loginIntoChat(user);
    }
  });
};

CometChat.prototype.loginIntoChat = function (user) {
  this.ChatWrapper.Login(user.uid, (err, res) => {
    if (err) {
      console.log(err);
      if (err.code === "ERR_UID_NOT_FOUND") {
        this.initChat(user.displayName, user);
      }
    } else {
      console.log(res);
      this.openWindow();
    }
  });
};


CometChat.prototype.triggerConv=function(chatID){
    console.log("Trigger Chat with: "+ chatID);
    this.ChatWrapper.openChat(chatID);
    this.ChatWrapper.toggleChatWindow(true);
    this.app.fire('OneChatOn');
};
