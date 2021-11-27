if (window.WebVRConfig) WebVRConfig.BUFFER_SCALE = 0.5;
var WebVrUi = pc.createScript('webVrUi');

WebVrUi.attributes.add("camera", {type: "entity", title: "Camera"});
WebVrUi.attributes.add("enterVrWhite", {type: "asset", title: "Enter VR White Asset"});
WebVrUi.attributes.add("enterVrOrange", {type: "asset", title: "Enter VR Orange Asset"});
WebVrUi.attributes.add("infoBoxLifeSpan", {type: "number", default: 3, title: "Info Box Life Span",});

WebVrUi.prototype.initialize = function() {    
    if (this.app.vr && this.app.vr.display) {
        this.app.vr.display.on("presentchange", this._onVrPresentChange, this);
        if (this.app.vr.display.display.bufferScale_) this.app.vr.display.display.bufferScale_ = 0.5;
    }

    this.app.assets.load(this.enterVrWhite);
    this.app.assets.load(this.enterVrOrange);

    // HTML UI setup
    var css = '#vr-button {position: absolute;right: 24px;bottom: 0px;background-image: url("'+ this.enterVrWhite.getFileUrl() +'"); width: 120px; height: 120px; display: block;'+
        'background-position: 0px 0px;background-size: 120px 120px; cursor: pointer;}' +		
        '#vr-button:hover {background-image: url("' + this.enterVrOrange.getFileUrl() + '");}' +
        '#info-box {position: absolute;	right: 160px;bottom: 32px; display: block; background-color: rgba(0,0,0, 168); color: rgb(218, 218, 218); padding: 5px 10px 5px 10px; max-width: 220px;}' +
        '#info-box a, #info-box a:hover, #info-box a:visited, #info-box a:active {text-decoration: underline; color: rgb(218, 218, 218);}';

    var style = pc.createStyle(css);
    document.head.appendChild(style);

    this._vrButtonDiv = document.createElement("div");
    this._vrButtonDiv.id = "vr-button";
    this._vrButtonDiv.innerHTML = "&nbsp"; 

    document.body.appendChild(this._vrButtonDiv);

    this._infoBoxDiv = document.createElement("div");
    this._infoBoxDiv.id = "info-box";    

    this._infoBoxLifeTime = 0;
    this._infoBoxShowing = false;

    this._vrEntered = false;

    var self = this;

    var onEnterVrPressedEvent = function(e) {
        if (e) e.stopPropagation();
        
        // If WebVR is available and a VrDisplay is attached
        if (self.app.vr && self.app.vr.display) {
            
            // Create framedata from the web vr 1.1 shim
            if (!self.app.vr.display._frameData) {
                if (window.VRFrameData) {
                    self.app.vr.display._frameData = new window.VRFrameData();
                }
            }            
            
            if(self._vrEntered) {
                // Exit vr (needed for non-mobile)
                self.camera.camera.exitVr(function (err) {
                    if (err) {
                        console.warn(err);
                    } 
                });
            }
            else {
                // Enter vr
                self.camera.camera.enterVr(function (err) {
                    if (err) {
                        console.warn(err);
                    } 
                });
            }
        } 
        else {
            if (!self._infoBoxShowing) {
                if (self.app.vr.isSupported) {
                    self._infoBoxDiv.innerHTML = "No VR display or headset is detected.";
                }
                else {
                    self._infoBoxDiv.innerHTML = "Sorry, your browser does not support WebVR :(. Please go to <a href='https://webvr.info/' target='_blank'>WebVR.info</a> for more information.";
                }   

                self._infoBoxLifeTime = self.infoBoxLifeSpan;
                document.body.appendChild(self._infoBoxDiv);
                self._infoBoxShowing = true;
            }
        }
    };

    this._vrButtonDiv.addEventListener('click', onEnterVrPressedEvent, false);
    
    if (pc.util.DEBUG) {
        this.app.keyboard.on(pc.EVENT_KEYDOWN, function (e) { 
            if (e.key == pc.KEY_SPACE) { 
                onEnterVrPressedEvent(e.event); 
            }
        });
    }
    
    // for carmel
//     setTimeout(function () {
        onEnterVrPressedEvent();
//     }, 500);
};

// update code called every frame
WebVrUi.prototype.update = function(dt) {
    if (this._infoBoxShowing) {
        this._infoBoxLifeTime -= dt;
        if (this._infoBoxLifeTime <= 0) {
            document.body.removeChild(this._infoBoxDiv);
            this._infoBoxShowing = false;
        }
    }
};

WebVrUi.prototype._onVrPresentChange = function(display) {
    if (display.presenting) {
        // Only remove the VR button if we are on mobile
        if (pc.util.isMobile()) {
            document.body.removeChild(this._vrButtonDiv);
        }
        this._vrEntered = true;
    }
    else {
        if (pc.util.isMobile()) {
            document.body.appendChild(this._vrButtonDiv);
        }
        this._vrEntered = false;
    }
};


