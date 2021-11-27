var LiveChat = pc.createScript('liveChat');

var LiveChatInstance ;

LiveChat.prototype.initialize = function() {
    LiveChatInstance = this;
    this.userlist = {};
    this.invitationArr = []; 
};

LiveChat.prototype.init = function () {
     this.makeLiveChatContainer();
    this.makeLiveChatRequestContainer();
    this.enteredChatroom = false;
    this.app.on('userStatusUpdate', (data)=>{
        console.log(data);
        this.updateUserList(data);
        if(this.enteredChatroom){
           var Id = this.chatroomie.email.split('@')[0];
            Id = Id.replace(/[&\/\\#,+$~%.'":*?<>{}]/g, '');
            Id = Id.toLowerCase();
            if(data.hasOwnProperty(Id)){
                if(data[Id].state !== 'online'){
                    firebaseInstance.rejectLiveChatRequest(this.chatroomie, (err, data)=>{
                        window.alert(  this.chatroomie.name + ' went offline.');
                        if(!err){
                            this.chatroomie = null;
                            this.enteredChatroom = false;
                        }
                    }); 
                }
            }
            else
            {
                window.alert('Other person went offline.');
            }
        }
    });
        
    this.app.on('enterChatRoom', (data)=>{
        if(data){
            this.enteredChatroom = true;
            this.chatroomie = data;
            if(this.LiveChatUserContainer){
                this.LiveChatUserContainer.classList.add('d-none');
                this.LiveChatRequestButton.classList.add('d-none');   
                
                if(this.LiveChatRequestButton.classList.contains('LiveChatRequestBtn-down')){
                    this.LiveChatRequestButton.classList.remove('LiveChatRequestBtn-down');                    
                }
            }
        }else{
            this.chatroomie = null;
            this.enteredChatroom = false;
        }
    });
     this.app.on('exitChatRoom', ()=>{
            this.enteredChatroom = false;
            this.chatroomie = null;
            if(this.LiveChatUserContainer){
                this.LiveChatUserContainer.classList.add('d-none');
                this.LiveChatRequestButton.classList.remove('d-none');  
                
                 if(this.LiveChatRequestButton.classList.contains('LiveChatRequestBtn-down')){
                    this.LiveChatRequestButton.classList.remove('LiveChatRequestBtn-down');                    
                }
            }
    });
    
    this.app.on('invitationDataRecived', (data)=>{
         console.log(data);
        this.updateInvitationList(data);
    });
    
    this.app.on('blockLiveChat', (user)=>{
        this.invitedUser = user;
        this.addBlocker();
    });

    this.app.on('removeLiveChatBlocker', ()=>{
        if(this.blocker && this.invitedUser){
             var inivationSent = document.getElementById(this.invitedUser.uid +'@invitation');
                
            var reqBtn = document.getElementById(this.invitedUser.uid +'@requestBtn');
            if(reqBtn.classList.contains('d-none'))
                reqBtn.classList.remove('d-none');

            inivationSent.classList.add('d-none');
            
            this.blocker.classList.add('d-none');
            this.cancelBtn.disabled = false; 
            this.invitedUser = null;
        }
    });
};


LiveChat.prototype.updateUserList = function(data) {
    if(data){
        var userDataMounted = [];
        Object.keys(data).forEach( (userKey, index)=>{
            var userData = data[userKey];
            if(userData.uid === firebaseInstance.currentUser.uid){
                return;
            }   
            userData.key = userKey;
            var alreadyMounted = false;
            if(document.getElementById(userData.email)){
                alreadyMounted = true;
            }
            if(userData.lobbyStatus === 'online'){
                if(!alreadyMounted){
                    this.userlist[userKey] = userData;   
                    userDataMounted.push(userData);
                    var user = this.getUserItem(data[userKey]);
                    if(this.userItemsContainer)
                        this.userItemsContainer.appendChild(user); 
                }
            }else{
                if(alreadyMounted){
                    var d = document.getElementById(userData.email);
                    if(d){
                        d.remove();
                    }
                }
            }
        });
    }
};

LiveChat.prototype.getUserItem = function(user) {
    if(!this.userItemsContainer){
        this.userItemsContainer = document.querySelector('.userItemsContainer');
    }
    
    var userItems = document.createElement('div');
    userItems.id = user.email;
    userItems.classList.add('userItems');
    
    var Info = document.createElement('div');
    Info.classList.add('Info');
    
    var userImg = document.createElement('img');
    userImg.src="https://firebasestorage.googleapis.com/v0/b/djfarmademo.appspot.com/o/profileimages%2Fblank-avatar.png?alt=media&token=2af15226-9bd7-47ce-bc72-f3c1a12a0780";
    userImg.alt="userImage";
    var nameDiv =  document.createElement('div');
    nameDiv.innerHTML = user.name ? user.name : user.key;
    
    Info.appendChild(userImg);
    Info.appendChild(nameDiv);
    userItems.appendChild(Info);
    
    var inivationSent = this.getInvitationSent();
    inivationSent.id = user.uid +'@invitation';
    inivationSent.classList.add('d-none');
    userItems.appendChild(inivationSent);
    
    var reqBtn = this.getRequestBtn();
    reqBtn.id = user.uid +'@requestBtn';
    reqBtn.addEventListener('click', (event) => {
        reqBtn.classList.add('d-none');
        
        if(inivationSent.classList.contains('d-none'))
            inivationSent.classList.remove('d-none');
        
        // setTimeout(()=>{
        //      if(reqBtn.classList.contains('d-none'))
        //             reqBtn.classList.remove('d-none');
        //     inivationSent.classList.add('d-none');
        // }, 16000);
        this.invitedUser = user;
        console.log(this.invitedUser);
        firebaseInstance.sendLiveChatRequest(user);
        this.addBlocker();
    });
    userItems.appendChild(reqBtn);
    return  userItems;
};

LiveChat.prototype.getInvitationSent = function(){
    var invitationSent = document.createElement('div');
    invitationSent.classList.add('btn-livechat');
    invitationSent.classList.add('invitationSent');
    invitationSent.innerHTML = 'Invitation Sent';
    return invitationSent;
};

LiveChat.prototype.getRequestBtn = function(){
    var RequestBtn = document.createElement('div');
    RequestBtn.classList.add('btn-livechat');
    RequestBtn.classList.add('Request-btn');
    RequestBtn.innerHTML = 'Request Invite';
    return RequestBtn;
};

LiveChat.prototype.makeLiveChatContainer = function() {
    var LiveChatUserContainer = document.createElement('div');
    LiveChatUserContainer.classList.add('LiveChatUserContainer');
    LiveChatUserContainer.classList.add('d-none');
    
    LiveChatUserContainer.addEventListener('mouseenter',()=>{
        this.app.fire('lockCamera');             
    });
    LiveChatUserContainer.addEventListener('mouseleave',()=>{
        this.app.fire('unlockCamera');             
    });
    
    var serachConatiner = document.createElement('div');
    serachConatiner.classList.add('serachConatiner');
    
    var inputField = document.createElement('input');
    inputField.setAttribute('type','text');
    inputField.setAttribute('placeholder','Search for attendees');
    inputField.id = 'chatSearch';
    inputField.addEventListener('onchange', (event)=>{
        console.log(event);
        console.log(event.target.value);
    });
    serachConatiner.appendChild(inputField);
    
    var userItemsContainer = document.createElement('div');
    userItemsContainer.classList.add('userItemsContainer');
    this.userItemsContainer = userItemsContainer;
    
    
    LiveChatUserContainer.appendChild(serachConatiner);
    LiveChatUserContainer.appendChild(userItemsContainer);
    
    
    var blocker = document.createElement('div');
    blocker.classList.add('LiveChatUserContainer-blocker');
    blocker.classList.add('d-none');
    
    var ring = document.createElement('div');
    ring.classList.add('lds-dual-ring');
    blocker.appendChild(ring);
    
     var msg = document.createElement('div');
    msg.classList.add('msg');
    msg.innerHTML = ' Waiting for user response.';
    blocker.appendChild(msg);
    
    var btn = document.createElement('button');
    btn.classList.add('cancel-btn');
    btn.innerHTML = 'Cancel';
    this.cancelBtn = btn;
    btn.addEventListener('click', ()=>{
                console.log(this.invitedUser, '<-- cancel');
        if(this.invitedUser){
            btn.disabled = true; 
            firebaseInstance.cancelLiveChatRequest(this.invitedUser, ()=>{
                var inivationSent = document.getElementById(this.invitedUser.uid +'@invitation');
                
                var reqBtn = document.getElementById(this.invitedUser.uid +'@requestBtn');
                if(reqBtn.classList.contains('d-none'))
                    reqBtn.classList.remove('d-none');
                
                inivationSent.classList.add('d-none');
            
                if(this.invitedUser){
                    this.invitedUser = null;
                }
                blocker.classList.add('d-none');
                btn.disabled = false; 
            }); 
        }
    });
    blocker.appendChild(btn);
    
    this.blocker = blocker;
    LiveChatUserContainer.appendChild(blocker);
    
    document.body.appendChild(LiveChatUserContainer);
    
    var  LiveChatRequestButton = document.createElement('div');
    LiveChatRequestButton.classList.add('LiveChatRequestBtn');
    LiveChatRequestButton.addEventListener('click',()=>{
       if(LiveChatUserContainer.classList.contains('d-none')){
            LiveChatRequestButton.classList.add('LiveChatRequestBtn-down');
            LiveChatUserContainer.classList.remove('d-none');
        }else{
            LiveChatRequestButton.classList.remove('LiveChatRequestBtn-down');
            LiveChatUserContainer.classList.add('d-none');
        }        
    });
     LiveChatRequestButton.addEventListener('mouseenter',()=>{
        this.app.fire('stopRaycast');             
    });
    LiveChatRequestButton.addEventListener('mouseleave',()=>{
        this.app.fire('resumeRaycast');             
    });
    this.LiveChatUserContainer = LiveChatUserContainer;
    this.LiveChatRequestButton = LiveChatRequestButton;
    document.body.appendChild(LiveChatRequestButton);
    
    if(__SceneInitalized){
          LiveChatRequestButton.style.display = 'block'; 
    }
};

LiveChat.prototype.makeLiveChatRequestContainer = function() {
    var LiveChatRequestContainer = document.createElement('div');
    LiveChatRequestContainer.classList.add('LiveChatRequestContainer');
   
    
    LiveChatRequestContainer.addEventListener('mouseenter',()=>{
        this.app.fire('stopRaycast');             
    });
    LiveChatRequestContainer.addEventListener('mouseleave',()=>{
        this.app.fire('resumeRaycast');             
    });
    
    document.body.appendChild(LiveChatRequestContainer);
    
    this.LiveChatRequestContainer = LiveChatRequestContainer;
      if(__SceneInitalized){
          LiveChatRequestContainer.style.display = 'block'; 
    }
};

LiveChat.prototype.updateInvitationList = function(data) {
   if(data){
       // if(data.length == 0){
       //      if(this.LiveChatRequestContainer){
       //           while (this.LiveChatRequestContainer.firstChild) {
       //              this.LiveChatRequestContainer.removeChild(parent.firstChild);
       //          }
       //      }           
       //     return;
       // }
       console.log(data, this.invitationArr);
       var newIdArray = data.map(e => e.email);
       
       if(this.invitationArr.length > 0){
           this.invitationArr.forEach(id =>{
               console.log(newIdArray, id);
               if(newIdArray.indexOf(id) === -1){
                  var el = document.getElementById(id + '@invitation');
                   if(el){el.remove();}
               } 
            });  
       }
     
       if(data.length == 0){return;}
       
       this.invitationArr = data.map(e => e.email);
        var userDataMounted = [];
        data.forEach( (user)=>{
             var alreadyMounted = false;
             var id = user.email + '@invitation';
             var el = document.getElementById(id);
             if(el){  
                 alreadyMounted = true;
                 return;
             }
             if(user){
                 var userDiv = this.getUserInvitation(user);
                 console.log(userDiv);
                 if(this.LiveChatRequestContainer){
                     this.LiveChatRequestContainer.appendChild(userDiv);
                 }
             }
        });
    }
};

LiveChat.prototype.getUserInvitation = function(user) {
    if(!this.LiveChatRequestContainer){
        this.LiveChatRequestContainer = document.querySelector('.LiveChatRequestContainer');
    }
    
    var userItems = document.createElement('div');
    userItems.id = user.email + '@invitation';
    userItems.classList.add('userItems');
    
    var Info = document.createElement('div');
    Info.classList.add('Info');
    
    var userImg = document.createElement('img');
    userImg.src="https://firebasestorage.googleapis.com/v0/b/djfarmademo.appspot.com/o/profileimages%2Fblank-avatar.png?alt=media&token=2af15226-9bd7-47ce-bc72-f3c1a12a0780";
    userImg.alt="userImage";
    var nameDiv =  document.createElement('div');
    nameDiv.innerHTML = user.name ? user.name : user.key;
    
    Info.appendChild(userImg);
    Info.appendChild(nameDiv);
    userItems.appendChild(Info);
    
     var buttons = document.createElement('div');
    buttons.classList.add('buttons');
    
    var Reject = document.createElement('div');
    Reject.classList.add('Reject-btn');
    Reject.classList.add('btn-liverquest');
    Reject.id = user.uid +'@reqject';
    Reject.innerHTML = 'Reject';
    Reject.addEventListener('click', ()=>{
            Reject.style.pointerEvent = 'none';
            accept.style.pointerEvent = 'none';
        firebaseInstance.rejectLiveChatRequest(user, function(){
            userItems.remove();
        });
        
    });
    
    var accept = document.createElement('div');
    accept.classList.add('accept-btn');
    accept.classList.add('btn-liverquest');
    accept.id = user.uid +'@accept';
    accept.innerHTML = 'Accept Invite';
    accept.addEventListener('click', ()=>{
            Reject.style.pointerEvent = 'none';
            accept.style.pointerEvent = 'none';
        firebaseInstance.acceptLiveChatRequest(user, function(){
            userItems.remove();
        });
        
    });
    
    buttons.appendChild(Reject);
    buttons.appendChild(accept);
    
    userItems.appendChild(buttons);
    
//     var timer = document.createElement('div');
//     timer.classList.add('timer');
    
    // userItems.appendChild(timer);
    
    // setTimeout(()=>{
    //     userItems.remove();
    // }, 15000);
    
    return userItems;
};


LiveChat.prototype.addBlocker = function(data) {
    if(this.blocker.classList.contains('d-none')){
        this.blocker.classList.remove('d-none');
    }
};