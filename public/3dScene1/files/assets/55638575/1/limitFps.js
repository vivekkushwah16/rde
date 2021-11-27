var LimitFps = pc.createScript('limitFps');

LimitFps.attributes.add('targetFps', { type: 'number', default: 30 });

// initialize code called once per entity
LimitFps.prototype.initialize = function() {
    var app = this.app;

    this.limit(this.targetFps);

    // Handle any runtime changes to the FPS target
    this.on('attr:targetFps', function (value, prev) {
        this.limit(value);
    });
};

LimitFps.prototype.limit = function(targetFps) {
    var app = this.app;

    if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    if (targetFps >= 60) {
        app.autoRender = true;
    } else {
        app.autoRender = false;

        this.intervalId = setInterval(function () {
            app.renderNextFrame = true;
        }, 1000 / targetFps);
    }
};