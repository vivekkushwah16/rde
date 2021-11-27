var Chat1Handler = pc.createScript('chat1Handler');

Chat1Handler.attributes.add('htmlHandler', {type: 'entity'});
Chat1Handler.attributes.add('url', {type: 'string'});

var Chat1HandlerInstance;
// initialize code called once per entity
Chat1Handler.prototype.initialize = function() {
    var self = this;
    this.other=new pc.Entity();
    Chat1HandlerInstance = this;
    
};


// update code called every frame
Chat1Handler.prototype.update = function(dt) {
    
};

Chat1Handler.prototype.openChat = function(urlattached,obj) {
    this.other=obj;
    console.log(this.url+"?"+urlattached);
    this.htmlHandler.script.htmlHandlerForAll.showIFRMAE(this.url+"?"+urlattached);
    this.app.fire('disableButts');
   
};

Chat1Handler.prototype.closeChat = function() {

       // this.htmlHandler.script.htmlHandlerForAll.showIFRMAE();
     this.app.fire('unlockCamera');
     this.app.fire('enableButts');
     this.other.script.otherHandler.end();
     this.reset = true;     
};


function closeIframeSpacialForChat1(){  
    console.log('endit');
    //playcanvas remove 
        Chat1HandlerInstance.closeChat();
    //button or Iframe remove
      if (document.getElementById("chat-container")) {
        document.getElementById("chat-container").remove();
    }
}
