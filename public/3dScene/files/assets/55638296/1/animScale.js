// More information about curves can be found at: 
// http://developer.playcanvas.com/en/user-manual/scripting/script-attributes/
// http://developer.playcanvas.com/en/api/pc.Curve.html

var AnimScale = pc.createScript('animScale');

// Example of creating curve attribute with as single curve
AnimScale.attributes.add("offsetCurve", {type: "curve", title: "Offset Curve"});
AnimScale.attributes.add("duration", {type: "number", default: 1, title: "Duration (secs)"});


// initialize code called once per entity
AnimScale.prototype.initialize = function() {
    // Keep track of the original scale of the entity
    this.startScale = this.entity.getLocalScale().clone();
    
    // Keep track of the current scale
    this.scale = new pc.Vec3();
    
    this.time = 0;
};


// update code called every frame
AnimScale.prototype.update = function(dt) {
    // Loop the animation forever
    this.time += dt;
    if (this.time > this.duration) {
        this.time -= this.duration;
    }
    
    // Calculate how far in time we are for the animation
    var percent = this.time / this.duration;
       
    // Get curve values using current time relative to duration (percent)
    var curveValue = this.offsetCurve.value(percent);
    
    // Create our new scale from the startScale and offset from the curve value
    this.scale.copy(this.startScale);
    this.scale.x += curveValue;
    this.scale.y += curveValue;
    this.scale.z += curveValue;
    
    this.entity.setLocalScale(this.scale);
};
