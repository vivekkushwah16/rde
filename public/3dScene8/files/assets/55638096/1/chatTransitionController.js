var ChatTransitionController = pc.createScript('chatTransitionController');

ChatTransitionController.attributes.add('model',{type:'entity'});
ChatTransitionController.attributes.add('triggerBtn',{type:'entity'});
ChatTransitionController.attributes.add('lobbyTriggerBtn',{type:'entity'});

ChatTransitionController.attributes.add('plane',{type:'entity'});

ChatTransitionController.attributes.add('lobbyCam',{type:'entity'});
ChatTransitionController.attributes.add('chatCam',{type:'entity'});


ChatTransitionController.attributes.add('chatUI',{type:'entity'});
ChatTransitionController.attributes.add('lobbyUI',{type:'entity'});


ChatTransitionController.attributes.add('middleEventName',{type:'string'});
ChatTransitionController.attributes.add('fadeOutTriggerEventName',{type:'string'});
ChatTransitionController.attributes.add('fadeOutCompleteEventName',{type:'string'});
ChatTransitionController.attributes.add('videoUrl',{type:'string'});


ChatTransitionController.attributes.add('speedFactor',{type:'number', default: 1.5 });

ChatTransitionController.prototype.initialize = function() {
    this.animate = false;
    this.fadeIn = false;
    this.fadeOut = false;
    this.LiveChatOpen =false;
    
    this.chatCam.enabled = false;
    this.lobbyCam.camera.enabled = true;
    this.chatUI.enabled = false; 
    if(this.model)
    this.model.enabled=false;
    
    this.lobbyTriggerBtn.element.on('click', ()=> {
        console.log('click');
         this.animate = true;
        this.fadeOut = false;    
         this.fadeIn = true;
        this.lobbyTriggerBtn.enabled = false;
        if(this.currentAnotherUser){
            firebaseInstance.rejectLiveChatRequest(this.currentAnotherUser);    
            this.app.fire('enterChatRoom');
        }
                
        CometChatInstance.ChatWrapper.toggleChatWindow(false);
    });
    
    
    this.triggerBtn.element.on('click', ()=> {
        console.log('click');
         this.animate = true;
        this.fadeOut = false;    
         this.fadeIn = true;
        this.triggerBtn.enabled = false;
    });
    
    this.app.on(this.fadeOutTriggerEventName, ()=>{
        console.log('trigere');
         this.animate = true;
         this.fadeOut = true;
         this.fadeIn = false;
    });
    
    this.app.on('OneChatOn', ()=>{
        this.triggerBtn.enabled = false;
    });
    
    this.app.on('endConversation', ()=>{
        // this.triggerBtn.enabled = true;
        CometChatInstance.ChatWrapper.toggleChatWindow(false);
    });
    
    this.app.on('enterChatRoom', (data)=>{
        if(!firebaseInstance.chatStatus && data !== null){
            firebaseInstance.updateLobbyStatus(false);
             console.log('click');
            this.animate = true;
            this.fadeOut = false;    
            this.fadeIn = true
            this.triggerBtn.enabled = false;
            this.ChatRoomuid = data.uid;
            this.currentAnotherUser = data;
        }
    });
};

ChatTransitionController.prototype.update = function(dt) {
    if(this.animate){
        if(this.fadeIn){
            if(this.plane.element.opacity<1){
                this.plane.element.opacity+=dt* this.speedFactor;            
            }
            else if(this.plane.element.opacity>=1)
            {
                this.plane.element.opacity=1;
                this.app.fire(this.middleEventName);
                this.makeVideoContainer();
                this.animate = false;
                this.fadeIn = false;
            }
        }else if(this.fadeOut){
            if(this.plane.element.opacity>0){
                this.plane.element.opacity-=dt*2;  
            }
            else if(this.plane.element.opacity <= 0){
                this.plane.element.opacity = 0;
                this.app.fire(this.fadeOutCompleteEventName);
                this.animate = false;
                this.fadeIn = false;
                
                if(this.LiveChatOpen){
                    setTimeout(()=>{
                        this.lobbyTriggerBtn.enabled = true;     
                        this.chatUI.enabled = true; 
                         if(this.ChatRoomuid)
                        {
                            this.app.fire('triggerChat',this.currentAnotherUser);
                        }
                    }, 700);
                    firebaseInstance.updateLobbyStatus(false);
                }else{
                    firebaseInstance.updateLobbyStatus(true);
                    this.app.fire('exitChatRoom');
                }
            }
        }   
    }  
};


ChatTransitionController.prototype.makeVideoContainer = function() {
    var videoContainerP = document.createElement('div');
    videoContainerP.style='width: 100vw;height: 100vh;position: absolute;top: 0;left: 0; background: #fff;';
    
    var videoContainer = document.createElement('video');
    videoContainer.src = this.videoUrl;
    videoContainer.mute = true;
    videoContainer.autoplay = true;
    videoContainer.loop = false;
    videoContainer.style='width: 100%;height: 100%;';
    videoContainerP.appendChild(videoContainer);
    document.body.appendChild(videoContainerP);
    
    var self = this;
    videoContainer.onended = function() {
         self.animate = true;
         self.fadeOut = true;
         self.fadeIn = false;
         self.fadeIn = false;
         if(!self.LiveChatOpen){
             self.LiveChatOpen = true; 
             
             self.lobbyUI.enabled = false;   
             
         }else{ 
            // self.triggerBtn.enabled = true;
             self.LiveChatOpen = false;
             
             self.chatUI.enabled = false;   
             self.lobbyUI.enabled = false;
         }
         videoContainerP.remove();
    }; 
    videoContainer.play().then((eve)=>{
        console.log(self.LiveChatOpen, '<--');
         if(!self.LiveChatOpen){
               self.chatCam.enabled = true;
               self.app.fire('lockCamera');             
               self.lobbyCam.camera.fov = 0;
            self.model.enabled=true;
               self.lobbyCam.camera.enabled = false;
         }else{ 
               self.chatCam.enabled = false;
                self.app.fire('unlockCamera');
               self.lobbyCam.camera.fov = 45;
            self.model.enabled=false;
               self.lobbyCam.camera.enabled = true;
         }
    });
};

