var HotspotImage = pc.createScript('hotspotImage');

HotspotImage.attributes.add('independent', {
   type: 'boolean',
    title: 'Independent hotspot'
});


HotspotImage.attributes.add('ImageUrl', {type:'string'});
HotspotImage.attributes.add('pdfName', {type: 'string'});
HotspotImage.attributes.add('pdfUrl', {type: 'string'});

HotspotImage.attributes.add('material', { type: 'asset', assetType: 'material', title: 'Material' });

HotspotImage.attributes.add('worldCanvas', { type: 'entity' });
var WorldCanvasImg;
var TextureImg;
var MaterialImg;
HotspotImage.attributes.add('close', {
   type: 'entity',
   title: 'close button'
});

HotspotImage.attributes.add('download', {
   type: 'entity',
   title: 'Download button'
});



// initialize code called once per entity
HotspotImage.prototype.initialize = function() {
    var app = this.app;
    var self = this;
    
    WorldCanvasImg = this.worldCanvas;
    MaterialImg = this.material;

    this.close.element.on('click', function(){
        self.closebtn();
    });
    
     this.download.element.on('click', function(){
        self.pdfdownload(self.pdfName, self.pdfUrl);
    });
    
    this.entity.on("hotspot:click", function(){
        self.imageDisplay(); 
    });
};

HotspotImage.prototype.closebtn = function() {
    if(self.independent)
        {
            this.app.fire('locakCamera');
        }
    WorldCanvasImg.enabled = false;

};


/*
HotspotImage.prototype.pdfdownload = function (){
    
    console.log(""+this.pdfName+"___"+this.pdfUrl);
    
    var w = window.open('', '');
    
    w.document.title = "Download" + this.pdfName;
    
    var link =  w.document.createElement('a');
     link.download = this.pdfName +'.pdf';
    
    link.href = this.pdfUrl;
    
    w.document.body.appendChild(link);
     link.click();
     w.document.body.removeChild(link);  
};*/

HotspotImage.prototype.pdfdownload = function (pdfName, pdfURL){
     var win = window.open('', '');
     var link =  win.document.createElement('a');
     link.href = pdfURL;
     link.download = pdfName +'.pdf';
     win.document.body.appendChild(link);
     link.click();
     win.document.body.removeChild(link);  
};


HotspotImage.prototype.imageDisplay = function (){
    
       if(app.mouse)
       {
           app.mouse.disablePointerLock();
       }
      if(self.independent)
        {
            this.app.fire('locakCamera');
        }
        console.log("image command recived");
    
        WorldCanvasImg.enabled = true;
        
        var texture = new pc.Texture(app.graphicsDevice, {
        format: pc.PIXELFORMAT_R8_G8_B8,
        autoMipmap: false
            });
        texture.minFilter = pc.FILTER_LINEAR;
        texture.magFilter = pc.FILTER_LINEAR;
        texture.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
        texture.addressV = pc.ADDRESS_CLAMP_TO_EDGE; 
        TextureImg = texture;
        
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = function () {
        TextureImg.setSource(image);
    };
    image.src = this.ImageUrl;
    
    console.log(image.src);
    
     var material = MaterialImg.resource;
        material.emissiveMap = TextureImg;
        material.update(); 
};
