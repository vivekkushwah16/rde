var EmojiHandler = pc.createScript('emojiHandler');

EmojiHandler.attributes.add('emojisButton',{type:'entity',array:true});
EmojiHandler.attributes.add('root',{type:'entity'});


// initialize code called once per entity
EmojiHandler.prototype.initialize = function() {
    this.selected=-1;
    
    for(var i=0;i<this.emojisButton.length;i++){
        this.emojisButton[i].element.on('click', this.createClickHandler(i));
    }
};
                                        
EmojiHandler.prototype.createClickHandler = function(i) {
    var self=this;
    return function() {
        if(self.selected!==-1){
            self.emojisButton[self.selected].setLocalScale(1,1,1);
        }
        self.root.script.network.updateEmote(i); 
        self.selected=i;
        console.log("pointeer:"+i);
        self.emojisButton[i].setLocalScale(1.75,1.75,1.75);
    };
};
// swap method called for script hot-reloading
// inherit your script state here
// EmojiHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/