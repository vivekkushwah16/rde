var HotspotVideoInfo = pc.createScript('hotspotVideoInfo');


HotspotVideoInfo.attributes.add('independent', {
   type: 'boolean',
    title: 'Independent hotspot'
});

HotspotVideoInfo.attributes.add('videoUrl', {type: 'string'});


HotspotVideoInfo.attributes.add('material', { type: 'asset', assetType: 'material', title: 'Material' });

HotspotVideoInfo.attributes.add('worldCanvas', { type: 'entity' });
var Video;
var Texture;
var Material;
var Playing;
var frameCount = 0;

HotspotVideoInfo.attributes.add('videoLoop',{ type: 'boolean' });
HotspotVideoInfo.attributes.add('videoPreload',{ type: 'boolean' });
HotspotVideoInfo.attributes.add('updateRate',{ type: 'number', default: 2 });

HotspotVideoInfo.attributes.add('close', {
   type: 'entity',
   title: 'close button'
});


HotspotVideoInfo.attributes.add('play', {
   type: 'entity',
   title: 'Play button'
});

HotspotVideoInfo.attributes.add('pause', {
   type: 'entity',
   title: 'Pause button'
});



// initialize code called once per entity
HotspotVideoInfo.prototype.initialize = function() {
    var self = this;
    var app = this.app;
    
    Material = this.material;
    Playing = false;
    
    this.entity.on("hotspot:click", function(){
        
        console.log("playing from"+ self.entity.name );
        
       if(app.mouse)
       {
           app.mouse.disablePointerLock();
         //  console.log(app.mouse.isPointerLocked());
       }
        
        if(self.independent)
        {
            this.app.fire('locakCamera');
        }
        
        self.worldCanvas.enabled = true;
        console.log("worldCanvas: "+ self.worldCanvas.name);
        
        var texture = new pc.Texture(app.graphicsDevice, {
        format: pc.PIXELFORMAT_R8_G8_B8,
        autoMipmap: false
            });
        texture.minFilter = pc.FILTER_LINEAR;
        texture.magFilter = pc.FILTER_LINEAR;
        texture.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
        texture.addressV = pc.ADDRESS_CLAMP_TO_EDGE;
    
        var material = Material.resource;
        material.emissiveMap = texture;
        material.update(); 
        
        Texture = texture;
                    
        var video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.preload = this.videoPreload;
        
        video.src = self.videoUrl;
        console.log("VIDEO url RECIVED "+ self.videoUrl);
       // video.src = VideoAsset.getFileUrl();
        
        video.addEventListener('canplay', function (e) {
            console.log('started Video');
                Texture.setSource(video);
                });
        
         video.addEventListener('ended', function (e) {
                console.log('Video Finished');
                Playing = false;
                });
        
        frameCount = 0;
        Playing = true;
        
        
        this.Video = video;
        this.Video.play();
         Video = this.Video;
        self.pause.enabled = true;
            self.play.enabled = false;
    });
    
    this.close.element.on('click', function(){
        self.closebtn();
    });
    
    
    this.play.element.on('click', function(){
        self.playbtn();
    });
    
    
    this.pause.element.on('click', function(){
        self.playbtn();
    });


};

HotspotVideoInfo.prototype.update = function(dt) {
    if(Playing)
    {
         if (frameCount++ % 2 === 0){     
             Texture.upload();
         }
    }
};


HotspotVideoInfo.prototype.closebtn = function() {
    Video.pause();
    
    this.worldCanvas.enabled = false;
    
        if(self.independent)
        {
           this.app.fire('unlockCamera');
        }
    //this.app.fire('unlockCamera');
    //    if(this.app.mouse)
    //   {
      //  this.app.mouse.enablePointerLock ();
    //   }
};

HotspotVideoInfo.prototype.playbtn = function() {
     if (Video.paused) {
            Video.play();
            this.pause.enabled = true;
            this.play.enabled = false;
     } else {
            Video.pause();
            this.pause.enabled = false;
            this.play.enabled = true;
        }
};
