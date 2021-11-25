var Livechat = pc.createScript('livechat');

Livechat.attributes.add('logout',{type:'entity'});

Livechat.prototype.initialize = function () {

    var self=this;

    this.chatUID="";   

    this.chatId="5ee92775446e71100107eb06"; //Change 
    this.chatAPIKey="a5cb7ad38293e598b590e750"; //Change 

    this.logout.element.on('click',function(){
        
        var chatweeManager = new ChatweeLib.ChatweeManager(self.chatId);
        chatweeManager.Dispose();
        
        if(self.chatUID!==""){

            var logout="https://chatwee-api.com/v2/sso-user/logout?chatId="+self.chatId+"&clientKey="+self.chatAPIKey+"&userId="+self.chatUID; //Returns UserID

            pc.http.get(logout, function (err, response) {
                console.log(response+" logging out");
                if(response)
                {
                   console.log("Logged out from Chat!");
                }
                firebaseInstance.logout();    
            });

        }
    });


    this.app.on("firebaseInitialized", function(user, avatarDetails){
        console.log(user.displayName+" i am alive?");
        var temp=firebaseInstance.getChatId(function(chatId){
            self.chatUID=chatId;
            console.log('Login '+self.chatUID);
            self.login(self.chatUID);
        }, function(){
            console.log('Register '+user.displayName);
            self.chatUID=self.register(user.displayName);
        });
   });

};

Livechat.prototype.register=function(name){
    var registerLink="https://chatwee-api.com/v2/sso-user/register?chatId="+this.chatId+"&clientKey="+this.chatAPIKey+"&login="+name+"&isAdmin=0"; //Returns UserID
    var self = this;
    pc.http.get(registerLink, function (err, response) {
        console.log(response);
        firebaseInstance.updateChatId(response);
        self.login(response);
    });

};

Livechat.prototype.login=function(userCID){
    var loginLink= "https://chatwee-api.com/v2/sso-user/login?chatId="+this.chatId+"&clientKey="+this.chatAPIKey+"&userId="+userCID;
    var self = this;
    
    pc.http.get(loginLink, function (err, response) {
        console.log(response);
         document.cookie = "chatwee-SID-"+self.chatId+"="+response+ "; path="+window.location.pathname; //Change
         self.validateSession(response);
      });
};

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function eraseCookie(name) {   
    document.cookie = name+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";  
}

Livechat.prototype.validateSession=function(sessionID){
    var validateLink= "https://chatwee-api.com/v2/sso-user/validate-session?chatId="+this.chatId+"&clientKey="+this.chatAPIKey+"&sessionId="+sessionID;
    var self = this;

    pc.http.get(validateLink, function (err, response) {
        console.log(response);
        if(response){

            var chatweeManager = null;      
            chatweeManager = new ChatweeLib.ChatweeManager(self.chatId);	
            chatweeManager.Run();
        }
         var checkforroom=setInterval(function(){
                var room=document.getElementsByClassName("chch-collapsibleGroupChatList");
                //   console.log("trying");
                if(room[0])
                {
                    room[0].style.display="none";//.setAttribute('display',"none");
                    //  console.log("room none");
                    clearInterval(checkforroom);
                }   
            },1000);
         var checkforroom1=setInterval(function(){
                var room1=document.getElementsByClassName("chch-button chch-pullRight");
               
             if(room1[1])
                {
                    room1[1].style.display="none";//.setAttribute('display',"none");
                    //  console.log("room none");
                }
             if(room1[2])
                {
                    room1[2].style.display="none";//.setAttribute('display',"none");
                    //  console.log("room none");
                    clearInterval(checkforroom1);
                }
            },1000);
        
         var checkforroom2=setInterval(function(){
               var div1 = document.getElementsByClassName("chch-fixedPane chch-fixedPaneRight chch-fixedPaneBottom chch-reset");
                if(div1[0])
                {
                    div1[0].addEventListener("mouseleave", function(){
                        self.app.fire('resumeRaycast');
                    });
                    div1[0].addEventListener("mouseenter", function(){
                        self.app.fire('stopRaycast');
                    });
                    clearInterval(checkforroom2);
                } 
             
            },1000);
         var checkforroom3=setInterval(function(){
               var div1 = document.getElementsByClassName("chch-fixedChatweeWindowSwitch chch-cursorPointer");
                 if(div1[0])
                {
                    div1[0].addEventListener("mouseleave", function(){
                        self.app.fire('resumeRaycast');
                    });
                    div1[0].addEventListener("mouseenter", function(){
                        self.app.fire('stopRaycast');
                    });
                    clearInterval(checkforroom3);
                }   
            },1000);
     
         self.app.fire("chatInitialized",self.chatUID);
    });
};

function eventFire(el, etype){
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}



Livechat.prototype.triggerConv=function(chatID){
    var chatweeManager = null;      
    var self=this;
    chatweeManager = new ChatweeLib.ChatweeManager(self.chatId);	
    chatweeManager.TriggerConversation(chatID);

    var buttons=document.getElementsByClassName('chch-fixedChatweeWindowSwitch chch-cursorPointer');
    if(buttons[0])
        eventFire(buttons[0], 'click');     
};

// update code called every frame
Livechat.prototype.update = function(dt) {

};
