var StartButton = pc.createScript('startButton');

StartButton.attributes.add('tutorial', {type:'entity'});
StartButton.attributes.add('root', {type:'entity'});
StartButton.attributes.add('footer', {type:'entity'});

StartButton.attributes.add('tutorialz', {type:'entity'});
StartButton.attributes.add('camera360', {type:'entity'});
StartButton.attributes.add('logThis', {type:'string'});
StartButton.attributes.add('tutorial_on', {type:'boolean'});

// initialize code called once per entity
StartButton.prototype.initialize = function() {
    
    var self = this;
    this.entity.element.on('click', function(){
      //  setInterval(function(){
               
        if(this.tutorial_on){
            setTimeout(function(){
                self.tutorial.enabled=true;           
            },500);
        }
        setTimeout(function(){
            if(window.localStorage.getItem("tutorialDone")=="true");
            else
                self.tutorialz.enabled=true;},
       500);
        
       // self.root.script.touchInput.enabled = true;
        self.camera360.script.camera360.enabled = true;
        self.root.script.pointAndClick.enabled = true;
        self.footer.enabled = true;
        
           if(self.logThis!==""&&firebaseInstance)
             firebaseInstance.logevent(self.logThis);
     //   },00);
    });
    
};

// update code called every frame
StartButton.prototype.update = function(dt) {
    
};