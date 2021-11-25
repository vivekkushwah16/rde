var StallHtmlHandler = pc.createScript('stallHtmlHandler');

var stallComponent;

StallHtmlHandler.attributes.add('html', {type: 'asset', assetType:'html', title: 'HTML Asset'});

StallHtmlHandler.attributes.add('fileadress', {type: 'string',default:"https://storage.googleapis.com/virtual-event-273009.appspot.com/BroadExpo/StallImages/"});



StallHtmlHandler.prototype.initialize = function() {
    this.asset = null;
    this.assetId = 0;
    this.counter = 0;
};


StallHtmlHandler.prototype.attachAsset = function(assetId, fn) {
    // remember current assetId
    this.assetId = assetId;
    
    stallComponent=this;
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


StallHtmlHandler.prototype.template = function(asset, html) {
    if (this.asset && this.asset !== asset)
        this.asset.off('load', this.asset._onLoad);
    this.asset = asset;
    this.element.innerHTML = html || ''; 
};

StallHtmlHandler.prototype.showStallContent = function (filename) {
    var self=this;
    if(document.getElementById('stall-container'))
    {
        document.getElementById('stall-container').remove();
    }
    
    this.element = document.createElement('div');
    this.element.classList.add('stall-container');
    this.element.setAttribute("id", 'stall-container');
    
 
    
    document.body.appendChild(this.element);
    this.asset = null;
    this.assetId = 0;

    this.counter = 0;
     if (this.assetId !== this.html.id)
        this.attachAsset(this.html.id, this.template);
    
    if(this.element.getElementsByClassName("stall-image")[0])
        this.element.getElementsByClassName("stall-image")[0].src=self.fileadress+filename;
    
    if(this.element.getElementsByClassName('close')[0]){
        this.element.getElementsByClassName('close')[0].style.display='none';
        setTimeout(function(){
            
            self.element.getElementsByClassName('close')[0].style.display='block';
        },1500);
    }
    
    if(this.element.getElementsByClassName('download')[0]){
        this.element.getElementsByClassName('download')[0].style.display='none';
        setTimeout(function(){
            
            self.element.getElementsByClassName('download')[0].style.display='block';
        },1400);
    }
};

StallHtmlHandler.prototype.downloadThis=function(){
    var x=new XMLHttpRequest();
	x.open("GET", this.fileurl, true);
	x.responseType = 'blob';
	x.onload=function(e){download(x.response, "broadspectrum", "image/jpeg" ); };
	x.send();
    
   // download(this.url,this.filename,'img/jpeg');
    /*
     var link =  document.createElement('a');
     link.href = this.url;
     link.download = this.filename;
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link); 
    */
};

StallHtmlHandler.prototype.removeIFRMAE = function () {
    this.element.remove();
};

StallHtmlHandler.prototype.removeDownloadButt = function () {
     var self=this;
    
     if(self.downloadButton)
         self.downloadButton.enabled=false;
};



function getfileurl(){
    
     if(stallComponent){
        return stallComponent.fileurl;
     }else
         return null;
}

function closeStallConetent(){
    
     if(stallComponent)
     {
         stallComponent.removeDownloadButt();
         stallComponent.removeIFRMAE();
     }
     if(document.getElementById('stall-container'))
     {
        document.getElementById('stall-container').remove();
     }
}


 function downloadStallConetent(){
    
     if(stallComponent)
     {
         stallComponent.downloadThis();
     }
}
