var ProfileImage = pc.createScript('profileImage');

ProfileImage.attributes.add('material', { type: 'asset', assetType: 'material', title: 'Material' });

ProfileImage.prototype.initialize = function() {
    var self = this;
    this.app.on("updateProfileImage", function(url){
        if(url)
        {
        self.imageDisplay(url);    
        }else{
            self.imageDisplay('https://storage.googleapis.com/virtual-event-273009.appspot.com/ic_default_avatar.png');
        }
        
    });
};

// update code called every frame
ProfileImage.prototype.update = function(dt) {
    
};


ProfileImage.prototype.imageDisplay = function (url){
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
        image.src = url;
        var material = this.material.resource;
        material.emissiveMap = TextureImg;
        material.update(); 
};
