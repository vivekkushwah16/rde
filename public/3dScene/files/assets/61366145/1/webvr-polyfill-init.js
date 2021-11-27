// shim - fixed in new engine
// pc.Application.prototype.enableVr = function () {
//     if (!this.vr) {
//         this.vr = new pc.VrManager(this);
//     }
// };

// pc.Application.prototype.disableVr = function () {
//     if (this.vr) {
//         this.vr.destroy();
//         this.vr = null;
//     }
// };

// create the polyfill
window.webvrPolyfill = new WebVRPolyfill();
var app = pc.Application.getApplication();
app.enableVr();