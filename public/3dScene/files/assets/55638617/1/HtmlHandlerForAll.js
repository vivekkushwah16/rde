var HtmlHandlerForAll = pc.createScript('htmlHandlerForAll');


var thatForAll;

HtmlHandlerForAll.attributes.add('html', {type: 'asset', assetType:'html', title: 'HTML Asset'});

HtmlHandlerForAll.attributes.add('className', {type: 'string', title: 'Class Name'});

HtmlHandlerForAll.attributes.add('autoStart', {type: 'boolean', title: 'Auto start html'});

HtmlHandlerForAll.attributes.add('hide', {type: 'boolean', title: 'Hide html'});

HtmlHandlerForAll.prototype.initialize = function() {

    // asset
    this.asset = null;
    this.assetId = 0;
    this.counter = 0;
     thatForAll=this;
    
    if(this.autoStart){
        this.showIFRMAE(); 
    }
    
    this.url = "";
};


HtmlHandlerForAll.prototype.attachAsset = function(assetId, fn) {
    // remember current assetId
    this.assetId = assetId;
   
    // might be no asset provided
    if (! this.assetId)
        return fn.call(this);

    // get asset from registry
    var asset = this.app.assets.get(this.assetId);

    // store callback of an asset load event
    var self = this;
    asset._onLoad = function(asset) {
        fn.call(self, asset, asset.resource);
    };

    // subscribe to changes on resource
    asset.on('load', asset._onLoad);
    // callback
    fn.call(this, asset, asset.resource);
    // load asset if not loaded
    this.app.assets.load(asset);
};


HtmlHandlerForAll.prototype.template = function(asset, html) {
    // unsubscribe from old asset load event if required
    if (this.asset && this.asset !== asset)
        this.asset.off('load', this.asset._onLoad);

    // remember current asset
    this.asset = asset;

    // template element
    // you can use templating languages with renderers here
    // such as hogan, mustache, handlebars or any other
    this.element.innerHTML = html || '';
    this.bindEvent();
};


HtmlHandlerForAll.prototype.bindEvent = function () {
    var iframe = this.element.querySelector(".chat-iframe");
    iframe.src = this.url;
};


HtmlHandlerForAll.prototype.showIFRMAE = function (url) {
    this.url = url;
     if(document.getElementById(this.className)&&!this.hide)
    { 
        document.getElementById(this.className).remove();
    }
    
    if(this.hide){
       var chatContainer = document.getElementById(this.className);
        if(chatContainer)
        {
            chatContainer.style.display = "flex";
            return;
        }
    }
    
    this.element = document.createElement('div');
    this.element.classList.add(this.className);
    this.element.setAttribute("id", this.className);
    document.body.appendChild(this.element);
      this.asset = null;
    this.assetId = 0;

    this.counter = 0;
     if (this.assetId !== this.html.id)
        this.attachAsset(this.html.id, this.template);
    
    
};


HtmlHandlerForAll.prototype.removeIFRMAE = function () {
    if(this.element)
        this.element.remove();
};

HtmlHandlerForAll.prototype.showFullScreenVideo = function () {
        this.showIFRMAE(); 
};

// function closeIframe(){
//         console.log('Hi');
//       if(thatForAll)
//           {
//               thatForAll.removeIFRMAE();
//           }

// }


// function closeIframeSpacialForChat(){
    
//         console.log('Hi');
//        if (document.getElementById("chat-container")) {
//         document.getElementById("chat-container").remove();
//     }

// }
