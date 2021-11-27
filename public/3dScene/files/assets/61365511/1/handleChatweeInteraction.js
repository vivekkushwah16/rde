var HandleChatweeInteraction = pc.createScript('handleChatweeInteraction');

// initialize code called once per entity
HandleChatweeInteraction.prototype.initialize = function() {
    
};

// update code called every frame
HandleChatweeInteraction.prototype.update = function(dt) {
    var chatWindow=document.getElementsByClassName("chch-fixedPane chch-fixedPaneRight chch-fixedPaneBottom chch-reset");
    if(chatWindow[0]){
        if(chatWindow[0].style.display==="none"){
            this.entity.element.useInput=true;
        }else
            this.entity.element.useInput=false;
    }else{
            this.entity.element.useInput=true;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// HandleChatweeInteraction.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/