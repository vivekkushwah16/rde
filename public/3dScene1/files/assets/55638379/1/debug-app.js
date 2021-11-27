var DebugApp = pc.createScript('debugApp');

// initialize code called once per entity
DebugApp.prototype.initialize = function() {
    this._debugVrPositionalController = this.app.root.findByName('Debug Vr Controller');
};

// update code called every frame
DebugApp.prototype.update = function(dt) {
    if (pc.util.DEBUG) {
        var keyboard = this.app.keyboard;
        if (keyboard.wasPressed(pc.KEY_0)) {
            this._debugVrPositionalController.enabled = !this._debugVrPositionalController.enabled;
        }
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// DebugApp.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/