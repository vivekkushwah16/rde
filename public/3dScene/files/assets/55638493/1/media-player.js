var MediaPlayer = pc.createScript('mediaPlayer');

MediaPlayer.attributes.add('material', { type: 'asset', assetType: 'material', title: 'Materials' });

MediaPlayer.attributes.add('playButton', { type: 'entity', title: 'Play button' });

MediaPlayer.attributes.add('videoAsset', {
   type: 'asset',
   assetType: 'audio',
});

MediaPlayer.attributes.add('url', {
   type: 'string'
});

MediaPlayer.prototype.createTexture = function () {
    var app = this.app;
    var i, texture, material;

    texture = new pc.Texture(app.graphicsDevice, {
        format: pc.PIXELFORMAT_R8_G8_B8,
        autoMipmap: false
    });
    texture.minFilter = pc.FILTER_LINEAR;
    texture.magFilter = pc.FILTER_LINEAR;
    texture.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
    texture.addressV = pc.ADDRESS_CLAMP_TO_EDGE;

    material = this.material.resource;
    material.emissiveMap = texture;
    material.update();

    return texture;
};

MediaPlayer.prototype.initialize = function () {
    var self = this;
    
    this.isVideo = false;
    this.updateEvery = 2;
    this.playing = false;
    this.frameCount = 0;

    this.app.fire('lockCamera');
    
    var texture = this.createTexture();
    var video = document.createElement('video');
    var image = new Image();
    
    video.addEventListener('canplay', function (e) {
            texture.setSource(video);
        });
        
        video.src = this.videoAsset.getFileUrl();
        //video.src = this.url;
        
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.preload = true;

        this.isVideo = true;
    
    this.texture = texture;
    this.image = image;
    this.video = video;
    
    this.playButton.element.on('click', function(){
    self.video.play(); 
    self.playButton.enabled = false;
    self.playing = true;
  //  self.app.fire('unlockCamera');
    });
};

// Video API
MediaPlayer.prototype.isPlaying = function () {
    return this.isVideo && this.playing;
};


MediaPlayer.prototype.update = function (dt) {
    
    if (this.playing) {
        if (this.frameCount++ % this.updateEvery === 0)
            this.texture.upload();
    } 
};