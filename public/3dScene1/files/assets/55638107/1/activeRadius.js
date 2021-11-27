var ActiveRadius = pc.createScript('activeRadius');

ActiveRadius.attributes.add('mainModel',{type:'entity'});
ActiveRadius.attributes.add('insideActivate',{type:'entity',array:true});
ActiveRadius.attributes.add('insideDeactivate',{type:'entity',array:true});
ActiveRadius.attributes.add('camera',{type:'entity'});
ActiveRadius.attributes.add('radius',{type:'number'});

// initialize code called once per entity
ActiveRadius.prototype.initialize = function() {
    
};

// update code called every frame
ActiveRadius.prototype.update = function(dt) {
    var v1=this.camera.getPosition();
    v1.y=0;
    var v2=this.entity.getPosition();
    v2.y=0;
    var v=v1.distance(v2);
  //  console.log(v);
    if(v<this.radius){
       this.mainModel.setLocalScale(1,1,1);
       for(var i=0;i<this.insideActivate.length;i++){
            this.insideActivate[i].enabled=true;
       }
           this.entity.collision.enabled=true;
        for(i=0;i<this.insideDeactivate.length;i++){
           this.insideDeactivate[i].enabled=false;
            
       }
    }else
    {
       this.mainModel.setLocalScale(0,0,0);
       for(var j=0;j<this.insideActivate.length;j++){
            this.insideActivate[j].enabled=false;
       }
        this.entity.collision.enabled=false;
        for(j=0;j<this.insideDeactivate.length;j++){
           this.insideDeactivate[j].enabled=true;
       }
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// ActiveRadius.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/