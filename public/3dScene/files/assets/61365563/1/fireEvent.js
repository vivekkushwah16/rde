var FireEvent = pc.createScript('fireEvent');

FireEvent.attributes.add('event', {type: 'string'});
FireEvent.attributes.add('imageBtn', {type: 'entity'});
// initialize code called once per entity
FireEvent.prototype.initialize = function() {
    var self=this;
    this.imageBtn.element.on('click',()=>{
        self.app.fire("unlockTheCam");
    });
    
};

// update code called every frame
FireEvent.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// FireEvent.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/