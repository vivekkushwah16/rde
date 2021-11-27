var TvScreen = pc.createScript('tvScreen');

TvScreen.attributes.add('screenMaterial', {
    title: 'Screen Material',
    description: 'The screen material of the TV that displays the video texture.',
    type: 'asset',
    assetType: 'material'
});
TvScreen.attributes.add('playEvent', {
    title: 'Play Event',
    description: 'Set the TV screen material emissive map on this event.',
    type: 'string',
    default: ''
});

// initialize code called once per entity
TvScreen.prototype.initialize = function() {
    this.app.on(this.playEvent, function (videoTexture) {
        var material = this.screenMaterial.resource;
        material.emissiveMap = videoTexture;
        material.update();
    }, this);
};

// swap method called for script hot-reloading
// inherit your script state here
// TvScreen.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/