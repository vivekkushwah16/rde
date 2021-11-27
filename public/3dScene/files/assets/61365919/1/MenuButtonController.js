var MenuButtonController = pc.createScript('menuButtonController');

MenuButtonController.attributes.add('url', {type:'string'});

MenuButtonController.attributes.add('logThis', {type:'string'});

// initialize code called once per entity
MenuButtonController.prototype.initialize = function() {
    var self = this;
    
    this.entity.element.on("click", function(){
        
       if(self.logThis!=="")
         firebaseInstance.logevent(self.logThis);
        self.app.fire("changeScene",self.url);    
    });
};
