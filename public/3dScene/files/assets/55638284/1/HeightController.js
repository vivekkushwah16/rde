var HeightController = pc.createScript('heightController');

// initialize code called once per entity
HeightController.prototype.initialize = function() {
    
    this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    
};

/*
* Event handler called when key is pressed
*/
HeightController.prototype.onKeyDown = function (event) {
    if (event.key === pc.KEY_UP ) 
    {   
         this.entity.translateLocal(0,0.05,0);
    }
    else if(event.key === pc.KEY_DOWN )
    {
         this.entity.translateLocal(0, - 1 * 0.05,0);
    }
     console.log("camera position: " + this.entity.getLocalPosition());
    event.event.preventDefault();
};
