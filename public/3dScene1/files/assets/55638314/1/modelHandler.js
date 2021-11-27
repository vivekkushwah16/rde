var ModelHandler = pc.createScript('modelHandler');

ModelHandler.attributes.add('main',{type:'entity'});
ModelHandler.attributes.add('modelen',{type:'entity'});
ModelHandler.attributes.add('hat',{type:'entity'});
ModelHandler.attributes.add('glass',{type:'entity'});
// initialize code called once per entity
ModelHandler.prototype.initialize = function() {
    
   // this.onEnable();
    this.enabledFlag=false;
    
    this.meshIns= this.modelen.model.meshInstances;
    this.hatmeshIns= this.hat.model.meshInstances;
    this.glassmeshIns= this.glass.model.meshInstances;
};

ModelHandler.prototype.onDisable = function() {
    
    for(var i=0;i<this.meshIns.length;i++){
        var material1= this.meshIns[i].material.clone();
        material1.opacity=0;
        material1.update();
        this.meshIns[i].material=material1;
    }
    
    var material2= this.hatmeshIns[0].material.clone();
    material2.opacity=0;
    material2.update();
    this.hatmeshIns[0].material=material2;
    
    var material3= this.glassmeshIns[0].material.clone();
    material3.opacity=0;
    material3.update();
    this.glassmeshIns[0].material=material3;
    
    this.enabledFlag=false;
};


ModelHandler.prototype.onEnable = function() {
    
    for(var i=0;i<this.meshIns.length;i++){
        this.meshIns[i].material.opacity=0;
        this.meshIns[i].material.update();
    }
    
    this.hatmeshIns[0].material.opacity=0;
    this.glassmeshIns[0].material.opacity=0;
    
    this.hatmeshIns[0].material.update();
    this.glassmeshIns[0].material.update();
    
    this.enabledFlag=true;
};

// update code called every frame
ModelHandler.prototype.update = function(dt) {
    if(this.main.enabled&&!this.enabledFlag){
        this.onEnable();
    }else if(!this.main.enabled&&this.enabledFlag){
        this.onDisable();
    }
    
    if(!this.enabledFlag)
        return;
    
     
    for(var i=0;i<this.meshIns.length;i++){
        if(this.meshIns[i].material.opacity<1){      
            var material1= this.meshIns[i].material.clone();
            material1.opacity+=dt*1.5;
            material1.update();
            this.meshIns[i].material=material1;
        }else{
            if(this.hatmeshIns[0].material.opacity!=1){
                var material2= this.hatmeshIns[0].material.clone();
                material2.opacity=1;
                material2.update();
                this.hatmeshIns[0].material=material2;
            }
             if(this.glassmeshIns[0].material.opacity!=1){
                    var material3= this.glassmeshIns[0].material.clone();
                    material3.opacity=1;
                    material3.update();
                    this.glassmeshIns[0].material=material3;
             }
        }
    }
    /*
     if(this.hatmeshIns[0].material.opacity<1){
            var material2= this.hatmeshIns[0].material.clone();
            material2.opacity+=dt*1.5;
            material2.update();
            this.hatmeshIns[0].material=material2;
     }
    
     if(this.glassmeshIns[0].material.opacity<1){
           var material3= this.glassmeshIns[0].material.clone();
           material3.opacity+=dt*1.5;
           material3.update();
           this.glassmeshIns[0].material=material3;
     }*/
    
};

// swap method called for script hot-reloading
// inherit your script state here
// ModelHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/