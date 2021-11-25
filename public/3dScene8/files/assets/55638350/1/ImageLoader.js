
var ImageLoader = pc.createScript('imageLoader');

ImageLoader.attributes.add('material', { type: 'asset', assetType: 'material', title: 'Material' });

ImageLoader.attributes.add('worldCanvas', { type: 'entity' });
var WorldCanvas;
var Texture;
var Material;
var Playing;
var pdfURL ="";
var pdfName ="";
ImageLoader.attributes.add('close', {
   type: 'entity',
   title: 'close button'
});

ImageLoader.attributes.add('download', {
   type: 'entity',
   title: 'Download button'
});


// initialize code called once per entity
ImageLoader.prototype.initialize = function() {
  
    var app = this.app;
    var self = this;
    
    WorldCanvas = this.worldCanvas;
    Material = this.material;
  
    this.app.on('showImage',function(imageURL, _pdfURL, _pdfName){
       self.imageDisplay(imageURL, _pdfURL, _pdfName); 
    });
    
    
    this.close.element.on('click', function(){
        self.closebtn();
    });
    
     this.download.element.on('click', function(){
        self.pdfdownload();
    });
};



ImageLoader.prototype.closebtn = function() {
  
    WorldCanvas.enabled = false;

};


ImageLoader.prototype.pdfdownload = function (){
    console.log(""+pdfName+"___"+pdfURL);
     var w = window.open('', '');
     w.document.title = "Download" + pdfName;
     var link =  w.document.createElement('a');
     link.download = pdfName +'.pdf';
     link.href = pdfURL;
     w.document.body.appendChild(link);
     link.click();
     w.document.body.removeChild(link);  
};

/*
 * var link = document.createElement('a');
        link.href = pdfURL;
        link.download = pdfName +'.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);  
        
*/
ImageLoader.prototype.imageDisplay = function (imageURL, _pdfURL, _pdfName){
        pdfURL = _pdfURL;
        pdfName = _pdfName;
        // this.app.mouse.enablePointerLock ();
       if(app.mouse)
       {
           app.mouse.disablePointerLock();
         //  console.log(app.mouse.isPointerLocked());
       }
        console.log("image command recived");
        WorldCanvas.enabled = true;
        
        var texture = new pc.Texture(app.graphicsDevice, {
        format: pc.PIXELFORMAT_R8_G8_B8,
        autoMipmap: false
            });
        texture.minFilter = pc.FILTER_LINEAR;
        texture.magFilter = pc.FILTER_LINEAR;
        texture.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
        texture.addressV = pc.ADDRESS_CLAMP_TO_EDGE; 
        Texture = texture;
        
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = function () {
        Texture.setSource(image);
    };
    image.src = imageURL;
    
    console.log(image.src);
    
     var material = Material.resource;
        material.emissiveMap = texture;
        material.update(); 
};