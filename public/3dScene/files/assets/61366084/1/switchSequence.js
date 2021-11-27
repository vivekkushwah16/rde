var SwitchSequence = pc.createScript('switchSequence');

SwitchSequence.attributes.add('elements',{type:'entity',array:true});
SwitchSequence.attributes.add('time',{type:'number'});

// initialize code called once per entity
SwitchSequence.prototype.initialize = function() {
    var self=this;
    self.start(0);
};

SwitchSequence.prototype.start=function(i){
    var self=this;
    setTimeout(function(){
       if(i<self.elements.length)
       { 
           self.elements[i].enabled=true;
           self.start(i+1);
       }
    },self.time);  
};

// update code called every frame
SwitchSequence.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// SwitchSequence.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/