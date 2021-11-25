var ChatbotController = pc.createScript('chatbotController');

// initialize code called once per entity
ChatbotController.prototype.initialize = function() {
    var self = this;
        window.__be = window.__be || {};
    window.__be.id = "5ecc248ed830ee0007e250eb";
    (function() {
        var be = document.createElement('script'); be.type = 'text/javascript'; be.async = true;
        be.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.chatbot.com/widget/plugin.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(be, s);
    })();
   
    this.app.on("exitStall", function(){
        self.close();
    });
    
    this.app.on("enterStall", function(){
        console.log("enter event=======");
        self.open();
    });

    
window.BE_API = window.BE_API || {};
    window.BE_API.onLoad = function () {
    window.BE_API.hideChatWindow();
};
       
};

// update code called every frame
ChatbotController.prototype.update = function(dt) {
    
};

ChatbotController.prototype.open = function(dt) {
      if(!window.BE_API.isInitialized())
    {
        return;
    }    
    if(window.BE_API.isChatWindowOpened())
    {
        return;
    }
                window.BE_API.openChatWindow();   
};


ChatbotController.prototype.close = function(dt) {
    if(!window.BE_API.isInitialized())
    {
        return;
    }
    if(window.BE_API.isChatWindowHidden())
    {
       return;
    }
    window.BE_API.hideChatWindow();   
};
