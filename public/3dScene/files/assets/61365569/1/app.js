var App = pc.createScript('app');

// initialize code called once per entity
App.prototype.initialize = function() {
    this._prevVrInputPresent = false;
};

// update code called every frame
App.prototype.update = function(dt) {
    // Check if vr input is present and if so, notify the app so entities
    // like the gaze controller can be disabled    
    var vrInputPresent = false;

    var pads = this.app.gamepads.current;
    for (var i = 0; i < pads.length; ++i) {
        var pad = pads[i].pad;
        if (pad.hand && pad.pose) {
            vrInputPresent = true;
        }
    }

    if (this._prevVrInputPresent != vrInputPresent) {
        if (vrInputPresent) {
            this.app.fire('vrinput:enabled');
        } else {
            this.app.fire('vrinput:disabled');

        }
    }

    this._prevVrInputPresent = vrInputPresent;
};
