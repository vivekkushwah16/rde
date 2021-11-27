// More information about curves can be found at: 
// http://developer.playcanvas.com/en/user-manual/scripting/script-attributes/
// http://developer.playcanvas.com/en/api/pc.Curve.html

var AnimatePosition = pc.createScript('animatePosition');

// Example of creating curve attribute with multiple curves (in this case, x, y, z)
AnimatePosition.attributes.add("offsetCurve", {type: "curve", title: "Offset Curve"});
AnimatePosition.attributes.add('animLength', {type: 'number', default: 1, title: 'Anim Length (secs)'});
AnimatePosition.attributes.add('loopGap', {type: 'number', default: 1, title: 'Loop Gap (secs)'});


// initialize code called once per entity
AnimatePosition.prototype.initialize = function() {
    // Store the original position of the entity so we can offset from it
    this.startPosition = this.entity.getLocalPosition().clone();
    
    // Keep track of the current position
    this.position = new pc.Vec3();
    
    this._time = 0;
};


// update code called every frame
AnimatePosition.prototype.update = function(dt) {
    
     var t = this._time / this.animLength;
     if (t <= 1) {
          var curveValue = this.offsetCurve.value(t);
    
    // Create our new position from the startPosition and curveValue
        this.position.copy(this.startPosition);
        this.position.y += curveValue;

        this.entity.setLocalPosition(this.position);
        }
     this._time = (this._time + dt) % (this.animLength + this.loopGap);
};
