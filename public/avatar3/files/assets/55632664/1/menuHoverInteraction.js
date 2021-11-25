var MenuHoverInteraction = pc.createScript('menuHoverInteraction');

MenuHoverInteraction.attributes.add("buttons",{type:'entity',array:true});
MenuHoverInteraction.attributes.add("menu",{type:'entity',array:true});
MenuHoverInteraction.attributes.add("stroke",{type:'entity',array:true});
// initialize code called once per entity
MenuHoverInteraction.prototype.initialize = function() {
    var self=this;
    this.selected=0;
    self.updateMenu(0);
    
    // for(let i=0;i<this.buttons.length;i++){
    //     this.buttons[i].element.on('mouseenter', function(){
    //         self.updateMenu(i);
    //     });
    // }
    
    this.buttons[0].element.on('mouseenter', function(){
        self.updateMenu(0);
    });
    this.buttons[1].element.on('mouseenter', function(){
        self.updateMenu(1);
    });
    this.buttons[2].element.on('mouseenter', function(){
        self.updateMenu(2);
    });
     this.buttons[3].element.on('mouseenter', function(){
        self.updateMenu(3);
    }); 
    
    this.buttons[4].element.on('mouseenter', function(){
        self.updateMenu(4);
    });
    // for(var i=0;i< this.buttons.length;i++){
    //     if(this.buttons[i])
    //     {
    //         let button=this.buttons[i];
    //         var temp=i;
    //         button.element.on('mouseenter', function(temp){console.log(temp);}, this);
    //         button.element.on('mouseleave', function(temp){this.onLeave(temp);}, this);   
    //         // this.buttons[i].element.on("click",function(){
    //         //    // this.app.fire('disableButts');
    //         // });
    //     }
    // }
    
    
};

MenuHoverInteraction.prototype.updateMenu = function (data) {
    this.selected=data;
    for(var i=0;i< this.menu.length;i++){
        if(this.selected==i)
            this.menu[i].enabled=true;
        else
            this.menu[i].enabled=false;
    }
    for(i=0;i< this.stroke.length;i++){
        if(this.selected==i)
            this.stroke[i].enabled=true;
        else
            this.stroke[i].enabled=false;
    }
};
// update code called every frame
MenuHoverInteraction.prototype.update = function(dt) {
    

};

MenuHoverInteraction.prototype.onEnter = function (temp) {
    // console.log(temp);
    // document.body.style.cursor = 'pointer';
};

// When the cursor leaves the element assign the original texture
MenuHoverInteraction.prototype.onLeave = function (event) {
    // document.body.style.cursor = 'context-menu';
};

// swap method called for script hot-reloading
// inherit your script state here
// MenuHoverInteraction.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/