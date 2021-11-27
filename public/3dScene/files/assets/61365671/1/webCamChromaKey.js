var WebCamChromaKey = pc.createScript('webCamChromaKey');

WebCamChromaKey.attributes.add('ckShader', { type: 'asset', assetType: 'shader', title: 'Chroma Key Shader' });

WebCamChromaKey.attributes.add('material', { type: 'asset', assetType: 'material', title: 'Material' });

WebCamChromaKey.attributes.add('videoLoop',{ type: 'boolean' });

WebCamChromaKey.attributes.add('videoPreload',{ type: 'boolean' });

WebCamChromaKey.attributes.add('updateRate',{ type: 'number' });

WebCamChromaKey.attributes.add('videoBtn',{ type: 'entity' });

// initialize code called once per entity
WebCamChromaKey.prototype.initialize = function() {
    var self = this;
    var app = this.app;
    
    this.playing = false;
    this.frameCount = 0;
    
    this.videoBtn.element.on('click', function(){
        app.fire("VideoControllers:click");
        self.videoBtn.enabled = false;
    });
    
     var mydeviceID;
     var gotChromaCam = false;
    
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          console.log("enumerateDevices() not supported.");
          return;
        }

        // List cameras and microphones.
    
        navigator.mediaDevices.enumerateDevices()
        .then(function(devices) {
            
          devices.forEach(function(device) {
         //   console.log(device.kind + ": " + device.label +
        //                " id = " + device.deviceId);
              
              if(device.label == "ChromaCam")
              {
                  mydeviceID = device.deviceId;
                  gotChromaCam = true;
              }
          });

            
        })
        .catch(function(err) {
          console.log(err.name + ": " + err.message);
        });
    

    app.on('VideoControllers:click', function(){
        
        console.log("videoCOntoollerClicked");
       // WorldBtnCanvas.enabled = false;
        
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
        
        material.opacityMap = texture;
        
        material.chunks.opacityTexPS = self.ckShader.resource;
        
        material.update(); 
        
        self.texture = texture;
        
        
        var video = document.createElement('video');

        video.addEventListener('canplay', function (e) {
            console.log('started Video');
           self.texture.setSource(video);
        });
        
       
        var constraints;
            
            if(gotChromaCam)
            {
                console.log("mydeviceID: "+ mydeviceID);
                constraints = { audio: true, video: { width: 1280, height: 720, facingMode: "user", deviceId: { exact: mydeviceID } } }; 
            }
            else
            {
                constraints = { audio: true, video: { width: 1280, height: 720, facingMode: "user" } }; 
            }
            
            navigator.mediaDevices.getUserMedia(constraints)
                .then(function(mediaStream) {
                   video.srcObject = mediaStream;

                    video.onloadedmetadata = function(e) 
                    {
                        console.log("play video");
                        video.play();
                    };

            }).catch(function(err) { console.log(err.name + ": " + err.message); });     
        /*
            var constraints1 = { audio: true, video: { width: 1280, height: 720, facingMode: "user" } }; 
            navigator.mediaDevices.getUserMedia(constraints1)
                .then(function(mediaStream) {
                   video.srcObject = mediaStream;

                    video.onloadedmetadata = function(e) 
                    {
                        console.log("play video");
                        video.play();
                    };

            }).catch(function(err) { console.log(err.name + ": " + err.message); });      
        */
        
        
         video.addEventListener('ended', function (e) {
                console.log('Video Finished');
                //WorldBtnCanvas.enabled = true;
                self.playing = false;
                //console.log(WorldBtnCanvas + ' Finished');
             
                });
        
        self.frameCount = 0;
        self.playing = true;
        
        console.log("here at end");
        self.Video = video;
       // self.Video.play();
       
    });
};

// update code called every frame
WebCamChromaKey.prototype.update = function(dt) {
    if(this.playing)
    {
         if (this.frameCount++ % 2 === 0){     
             this.texture.upload();
         }
    }
};
