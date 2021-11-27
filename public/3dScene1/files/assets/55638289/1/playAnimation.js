var PlayAnimation = pc.createScript('playAnimation');

PlayAnimation.attributes.add('animName', {type: 'string', title: 'Anim Name'});
PlayAnimation.attributes.add("emoteID",{type:'number'});

// initialize code called once per entity
PlayAnimation.prototype.initialize = function() {
    var self=this;
         this.entity.element.on("click", function(){
             self.entity.button.enabled=false;
             self.app.fire("sendEmote",self.emoteID);
             firebaseInstance.myModel.animation.play(networkInstance.emoteNames[self.emoteID],0.5);
             firebaseInstance.myModel.animation.loop=false;
             
             setTimeout(function(){    
                 self.entity.button.enabled=true;
                 firebaseInstance.myModel.animation.play('Idol.glb',1);
                 firebaseInstance.myModel.animation.loop=true;
             },4000);
        });
};

// update code called every frame
PlayAnimation.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// PlayAnimation.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/