var AcceptCookies = pc.createScript('acceptCookies');

AcceptCookies.attributes.add('cookies',{type:'entity'});
AcceptCookies.attributes.add('okay',{type:'entity'});

// initialize code called once per entity
AcceptCookies.prototype.initialize = function() {
     var self=this;
     if (!sessionStorage.getItem("cookies")) 
     {
         this.cookies.enabled=true;
     }
    //else
 //        sessionStorage.removeItem("cookies");
     this.okay.element.on('click',function(){
         //accept cookies here
          sessionStorage.setItem("cookies", "accepted");
          self.cookies.enabled=false;
     });
};

// update code called every frame
AcceptCookies.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// AcceptCookies.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/