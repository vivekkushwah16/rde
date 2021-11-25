var AnimateRing = pc.createScript('animateRing');

AnimateRing.attributes.add("speed",{type:'number'});
AnimateRing.attributes.add("loop",{type:'boolean',default:false});
// initialize code called once per entity
AnimateRing.prototype.initialize = function() {
    
};

// update code called every frame
AnimateRing.prototype.update = function(dt) {
   // console.log("enabled");
    var tempx=this.entity.getLocalScale().x;
    var x=tempx+(tempx*dt*this.speed);
    var a=1.6-x;
    
    if(a<0){
        a=0;
        if(this.loop){
            this.entity.setLocalScale(1,1,1);
            console.log(this.entity.getLocalScale());
            this.entity.model.material.opacity=0;
        }else
        {
            this.entity.enabled=false;
        }
    }else{
        
        this.entity.setLocalScale(x,x,x);
   //     console.log("value:"+a);
        this.entity.model.material.opacity =a*(this.speed+0.2);
        this.entity.model.material.update();
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// AnimateRing.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/