var Streamer = pc.createScript('streamer');

Streamer.attributes.add('material', { type: 'asset', assetType: 'material', title: 'Material' });

Streamer.attributes.add('videoLoop',{ type: 'boolean' });
Streamer.attributes.add('videoPreload',{ type: 'boolean' });
Streamer.attributes.add('updateRate',{ type: 'number', default: 2 });

Streamer.attributes.add('videoURL',{ type: 'string' });

Streamer.attributes.add('videoBtn',{ type: 'entity' });


// initialize code called once per entity
Streamer.prototype.initialize = function() {
    var self = this;
    var app = this.app;
    this.playing = false;
    
    this.videoBtn.element.on('click', function(){
        app.fire("VideoControllers:click");
        self.videoBtn.enabled = false;
    });
    
    this.app.fire('lockCamera');
    
    app.on('VideoControllers:click', function(){
        
        console.log("ButtonCliked");
        
        var texture = new pc.Texture(app.graphicsDevice, {
        format: pc.PIXELFORMAT_R8_G8_B8,
        autoMipmap: false
            });
        texture.minFilter = pc.FILTER_LINEAR;
        texture.magFilter = pc.FILTER_LINEAR;
        texture.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
        texture.addressV = pc.ADDRESS_CLAMP_TO_EDGE;
    
        var material = self.material.resource;
        material.emissiveMap = texture;
        material.update(); 
        
        self.texture = texture;
        
        var video = document.createElement('video');

        video.addEventListener('canplay', function (e) {
            console.log('started Video');
            self.texture.setSource(video);
        });
        
        if (Hls.isSupported()) 
        {
            var hls = new Hls();
            console.log("Hls Suppoerted");
            hls.loadSource(self.videoURL);
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                console.log("play video");
                 video.play();
            });
        }  
        else if (video.canPlayType('application/vnd.apple.mpegurl')) 
        {
            video.src = self.videoURL;
            video.addEventListener('loadedmetadata', function() {
            video.play();
            });
        }

         video.addEventListener('ended', function (e) {
                console.log('Video Finished');
                self.playing = false;
                });
        
        self.frameCount = 0;
        self.playing = true;
        
        
        self.video = video;
       // this.Video.play();
       self.app.fire('unlockCamera');
    });
};

// update code called every frame
Streamer.prototype.update = function(dt) {
    if(this.playing)
    {
         if (this.frameCount++ % 2 === 0){     
             this.texture.upload();
         }
    }
};

//sample link - https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8