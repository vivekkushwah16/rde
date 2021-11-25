var Screen360 = pc.createScript('screen360');

Screen360.attributes.add('material', { type: 'asset', assetType: 'material', title: 'Material' });

Screen360.attributes.add('worldCanvas', { type: 'entity' });
var WorldCanvas;
var Video;
var Texture;
var Material;
var VideoAsset;
var Playing;
var frameCount = 0;
var pdfURL ="";
var pdfName ="";

Screen360.attributes.add('videoLoop',{ type: 'boolean' });
Screen360.attributes.add('videoPreload',{ type: 'boolean' });
Screen360.attributes.add('updateRate',{ type: 'number', default: 2 });

Screen360.attributes.add('videoAsset', {
   type: 'asset',
   assetType: 'audio',
});

Screen360.attributes.add('close', {
   type: 'entity',
   title: 'close button'
});


Screen360.attributes.add('play', {
   type: 'entity',
   title: 'Play button'
});

Screen360.attributes.add('pause', {
   type: 'entity',
   title: 'Pause button'
});

Screen360.attributes.add('download', {
   type: 'entity',
   title: 'Download button'
});

// initialize code called once per entity
Screen360.prototype.initialize = function() {
  
    var app = this.app;
    var self = this;
    
    WorldCanvas = this.worldCanvas;
    Material = this.material;
    VideoAsset = this.videoAsset;
    Playing = false;
    
    
    this.app.on('playVideo', function(videoURL, _pdfURL, _pdfName){
       console.log("playing from"+ self.entity.name );
        pdfURL = _pdfURL;
        pdfName = _pdfName;
        
        // this.app.mouse.enablePointerLock ();
       if(app.mouse)
       {
           app.mouse.disablePointerLock();
         //  console.log(app.mouse.isPointerLocked());
       }
        WorldCanvas.enabled = true;
        console.log("worldCanvas: "+ WorldCanvas);
        
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
        
        video.src = videoURL;
        console.log("VIDEO url RECIVED "+ videoURL);
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
    
     this.download.element.on('click', function(){
        self.pdfdownload();
    });
};

// update code called every frame
Screen360.prototype.update = function(dt) {
    if(Playing)
    {
         if (frameCount++ % 2 === 0){     
             Texture.upload();
         }
    }
};


Screen360.prototype.closebtn = function() {
    Video.pause();
    
    WorldCanvas.enabled = false;
    
    this.app.fire('resume');
    this.app.fire('unlockCamera');
        if(this.app.mouse)
       {
        this.app.mouse.enablePointerLock ();
       }
};

Screen360.prototype.playbtn = function() {
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

Screen360.prototype.pdfdownload = function (){
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