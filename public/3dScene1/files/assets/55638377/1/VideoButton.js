var VideoButton = pc.createScript('videoButton');


VideoButton.attributes.add('videoAsset', {
   type: 'asset',
   assetType: 'audio',
});

VideoButton.attributes.add('cube', {
   type: 'entity'
});

var videoURL = '';

VideoButton.prototype.initialize = function() {
     //videoURL = this.videoAsset.getFileUrl();
     this.entity.on('videoButton:start', this.setVideo, this);
    
};

VideoButton.prototype.setVideo = function() {
    console.log("Video Start Reviced");
    
        this.entity.fire('VideoControllers:click', videoURL);
};