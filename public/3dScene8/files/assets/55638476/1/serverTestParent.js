var ServerTestParent = pc.createScript('serverTestParent');

ServerTestParent.attributes.add('server',{type:'entity'});
ServerTestParent.attributes.add('noOfClients',{type:'number'});
ServerTestParent.attributes.add('delay',{type:'number'});

// initialize code called once per entity
ServerTestParent.prototype.initialize = function() {
    this.timer=0;
    this.i=0;
};

ServerTestParent.prototype.spawn = function(dt) {
    
};

// update code called every frame
ServerTestParent.prototype.update = function(dt) {
    if(this.i>=this.noOfClients)
        return;
    
    this.timer+=dt;
    if(this.timer>this.delay){
        this.timer=0;
        var serverz=this.server.clone();
        serverz.enabled=true;
        serverz.script.serverLoadTest.initz(this.i);
        this.i++;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// ServerTestParent.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/