var Ripple = pc.createScript('ripple');

Ripple.attributes.add('speed',{type:'number',default:1});
Ripple.attributes.add('startingValue',{type:'number',default:0.1});
// initialize code called once per entity
Ripple.prototype.initialize = function() {
    this.scale=this.startingValue;
    this.entity.element.opacity=this.startingValue-0.1;
};

// update code called every frame
Ripple.prototype.update = function(dt) {
    if(this.entity.element.opacity>0){
        this.entity.element.opacity-=dt*this.speed;
        this.scale+=dt*this.speed;
        this.entity.setLocalScale(this.scale,this.scale,this.scale);
    }else{
        this.scale=0.1;
        this.entity.setLocalScale(this.scale,this.scale,this.scale);
        this.entity.element.opacity=1;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// Ripple.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/