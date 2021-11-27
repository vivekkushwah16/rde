var ImageBase64 = pc.createScript('imageBase64');

ImageBase64.attributes.add('jsonlink', {type: 'string'});

ImageBase64.attributes.add('updateEvery', {type: 'number', title: 'Update every_frame'});//screenshoht viewer

ImageBase64.attributes.add('material', { type: 'asset', assetType: 'material', title: 'Material' });

ImageBase64.prototype.initialize = function() {
  
    var self = this;
    var app = this.app;   
    this.playing = true;
    this.frameCount = 0;
    self.image = document.createElement('img');
    self.image.setAttribute("id", "screenshotPreview");
    
};

ImageBase64.prototype.loadJsonFromRemote = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        callback(JSON.parse(this.response));
    });
    xhr.open("GET", url);
    xhr.send();
};

ImageBase64.prototype.update = function (dt) {
     if (this.playing) {
        if (this.frameCount++ % this.updateEvery === 0)
            {
                var self = this;
                     this.loadJsonFromRemote(this.jsonlink, function (data) {
                        self.data = data;  
                        self.updateTexture();
                     });
            }
    } 
};


ImageBase64.prototype.updateTexture = function()
{
    var self = this;
     
   
    self.image.src = self.data.base64Img;
    
     var tex = new pc.Texture( this.app.graphicsDevice, {
            mipmaps: false
        } );

     tex.minFilter = pc.FILTER_LINEAR;
     tex.magFilter = pc.FILTER_LINEAR;
     tex.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
     tex.addressV = pc.ADDRESS_CLAMP_TO_EDGE;
    
     tex.setSource( self.image );  
     self.texture = tex;
   
     var material = this.material.resource;
        material.emissiveMap = tex;
        material.update();
    
    self.playing = true;
};
