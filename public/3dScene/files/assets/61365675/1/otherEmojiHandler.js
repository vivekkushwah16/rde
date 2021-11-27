var OtherEmojiHandler = pc.createScript('otherEmojiHandler');

OtherEmojiHandler.attributes.add('emojiImage',{type:'entity'});

OtherEmojiHandler.attributes.add('emojis',{type:'asset',array:true});

// initialize code called once per entity
OtherEmojiHandler.prototype.initialize = function() {
    
};

// update code called every frame
OtherEmojiHandler.prototype.update = function(dt) {
    
};

OtherEmojiHandler.prototype.switchEmoji = function(no) {
    this.emojiImage.enabled=true;
    this.emojiImage.element.texture = this.emojis[no].resource;
};
OtherEmojiHandler.prototype.test = function() {
   console.log("TESTED");
};
// swap method called for script hot-reloading
// inherit your script state here
// OtherEmojiHandler.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/