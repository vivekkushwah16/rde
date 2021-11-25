var InstructionHandler = pc.createScript('instructionHandler');
InstructionHandler.attributes.add('delay',{type:'number'});
InstructionHandler.attributes.add('fadeSpeed',{type:'number'});

InstructionHandler.attributes.add('texts',{type:'entity',array:true});

// initialize code called once per entity
InstructionHandler.prototype.initialize = function() {
    var self=this;

    this.current=0;
    this.old=0;
    
    setTimeout(function(){
        self.next();
    },this.delay);
};

InstructionHandler.prototype.next = function() {
    var self=this;
        self.old=self.current;
        self.current=-1;
        setTimeout(function(){
            self.current=self.old+1;
            if(self.current>=self.texts.length)
                self.current=0;
        },1300);
        setTimeout(function(){
            self.next();
        },self.delay);
};

// update code called every frame
InstructionHandler.prototype.update = function(dt) {
    var self=this;
    for(var i=0;i<this.texts.length;i++){
        if(this.current==i){
             if(this.texts[i].element.opacity<1)
                this.texts[i].element.opacity+=dt*this.fadeSpeed;
        }
        else{
            if(this.texts[i].element.opacity>0)
                this.texts[i].element.opacity-=dt*this.fadeSpeed;
        }
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// InstructionHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/