var MenuButton = pc.createScript('menuButton');

MenuButton.attributes.add('animSpeed', {type: 'number', default: 1, title: 'Anim Speed'});

MenuButton.attributes.add("menuParent", {type: "entity", title: "2d canvas for fade In Screen"});

MenuButton.attributes.add("FinalPosition", {type: "vec3"});

MenuButton.attributes.add('MenuButton', {type: 'entity', title: 'Menu Button'});
MenuButton.attributes.add('ChatButton', {type: 'entity', title: 'Chat Button'});

MenuButton.attributes.add('crossButton', {type: 'entity', title: 'Cross Button'});


MenuButton.prototype.initialize = function() {
    var self = this;
    
    this.MenuButton.element.on("click", function(){
      console.log("Menu Button clicked");  
        self.animate = true;
        self.MenuButton.enabled = false;
    });
    
    this.crossButton.element.on("click", function(){
      console.log("Cross Button clicked");  
        self.animate = true;
        self.crossButton.enabled = false;
    });
    
    
    this.isClosed = true;
    this.animate = false;
    this.position = new pc.Vec3();
     this.startPosition = this.menuParent.getLocalPosition().clone();
    // this.animSpeed = ;
};

MenuButton.prototype.update = function(dt) {
    
    if(this.animate)
    {
        if(this.isClosed)
        {
             if (this.menuParent.getLocalPosition().x > this.FinalPosition.x) 
             {
                    this.ChatButton.enabled=false;
                    this.position = this.menuParent.getLocalPosition().clone();
                    var temp=new pc.Vec3(this.FinalPosition.x-20,0,0);
                    
                    this.position.lerp(this.position,temp,dt*this.animSpeed);
                    //console.log(this.menuParent.getLocalPosition());
                    //this.position.x -= this.animSpeed ;
                    this.menuParent.setLocalPosition(this.position);
            }else{
                    this.menuParent.setLocalPosition(this.FinalPosition);
                    this.animate = false;
                    this.isClosed = false;
                
                    this.crossButton.enabled = true;
                
                    this.ChatButton.enabled=false;
            }
        }
        else
        {
             if (this.menuParent.getLocalPosition().x < this.startPosition.x) 
             {
                    this.position = this.menuParent.getLocalPosition().clone();
                    var temp1=new pc.Vec3(this.startPosition.x+50,0,0);
                    this.position.lerp(this.position,temp1,dt*this.animSpeed);
                    //this.position.x += this.animSpeed ;
                    this.menuParent.setLocalPosition(this.position);
            }else{
                    this.menuParent.setLocalPosition(this.startPosition);
                    this.animate = false;
                    this.isClosed = true;
                    this.MenuButton.enabled = true;
                    this.ChatButton.enabled = true;
                }
        }
    }
};