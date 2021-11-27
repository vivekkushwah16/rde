var ChatButton = pc.createScript('chatButton');

ChatButton.attributes.add('htmlHandler', {type: 'entity'});
ChatButton.attributes.add('url', {type: 'string'});
ChatButton.attributes.add('button', {type: 'entity'});

var chatbuttonInstance;
// initialize code called once per entity
ChatButton.prototype.initialize = function() {
    var self = this;
    this.button.element.on("click", function(){
        self.openChat();
    });
    chatbuttonInstance = this;
};

// update code called every frame
ChatButton.prototype.update = function(dt) {
    
};

ChatButton.prototype.openChat = function() {
 console.log("clicked");
    this.htmlHandler.script.htmlHandlerForAll.showIFRMAE(this.url);
     this.app.fire('disableButts');
    if(this.button)
        this.button.enabled=false;
    setTimeout(function(){
        this.app.fire('lockCamera');   
    },1000);
};

ChatButton.prototype.closeChat = function() {
    
     console.log(this);
    if(this.button)
        this.button.enabled=true;
       // this.htmlHandler.script.htmlHandlerForAll.showIFRMAE();
     this.app.fire('unlockCamera');
    this.app.fire('enableButts');
     this.reset = true;     
};


function closeIframeSpacialForChat(){  
      
    //playcanvas remove 
        chatbuttonInstance.closeChat();
    //button or Iframe remove
      if (document.getElementById("chat-container")) {
        document.getElementById("chat-container").style.display="none";//.remove();
    }
}
