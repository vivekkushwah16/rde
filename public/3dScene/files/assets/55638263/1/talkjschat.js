var Talkjschat = pc.createScript('talkjschat');

Talkjschat.attributes.add('css', {type: 'asset', assetType:'css', title: 'CSS Asset'});
Talkjschat.attributes.add('html', {type: 'asset', assetType:'html', title: 'HTML Asset'});

// initialize code called once per entity
Talkjschat.prototype.initialize = function() {
 // create STYLE element
    var style = document.createElement('style');

    // append to head
    document.head.appendChild(style);
    style.innerHTML = this.css.resource || '';
    
    // Add the HTML
    this.div = document.createElement('div');
    this.div.classList.add('chatbox-container');
    this.div.innerHTML = this.html.resource || '';
    
    // append to body
    // can be appended somewhere else
    // it is recommended to have some container element
    // to prevent iOS problems of overfloating elements off the screen
    document.body.appendChild(this.div);
    
};



// update code called every frame
Talkjschat.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// Talkjschat.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/