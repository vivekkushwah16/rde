var LocatorRings = pc.createScript('locatorRings');

LocatorRings.attributes.add('animLength', {type: 'number', default: 1, title: 'Anim Length (secs)'});
LocatorRings.attributes.add('loopGap', {type: 'number', default: 1, title: 'Loop Gap (secs)'});
LocatorRings.attributes.add('yOffsetCurve', {type: 'curve', title: 'Y Offset Curve'});
LocatorRings.attributes.add('scaleOffsetCurve', {type: 'curve', title: 'Scale Offset Curve'});
LocatorRings.attributes.add('alphaCurve', {type: 'curve', title: 'Alpha Curve'});

// initialize code called once per entity
LocatorRings.prototype.initialize = function() {
    this._rings = this.entity.findByTag('locator-ring');
    this._ringCount = this._rings.length;
    this._time = 0;
    
    this._targetScaleY = 1;
    this._setScaleY(0.001);
    
    this.on('state', this._onStateChanged, this);
};

LocatorRings.ringPosition = new pc.Vec3();
LocatorRings.SCALE_LERP_FACTOR = 8;

// update code called every frame
LocatorRings.prototype.update = function(dt) {
    var t = this._time / this.animLength;
    var ringPosition = LocatorRings.ringPosition;
    var ringScale = LocatorRings.ringScale;
    
    if (t <= 1) {
        for (var i = 0; i < this._ringCount; ++i) {
            var lerpOffset = (1 / this._ringCount) * i;
            var lerp = (t + lerpOffset) % 1;
            var ring = this._rings[i];

            ringPosition.copy(ring.getLocalPosition());
            ringPosition.y = this.yOffsetCurve.value(lerp);
            ring.setLocalPosition(ringPosition);

            var scale = this.scaleOffsetCurve.value(lerp);
            ring.setLocalScale(scale, scale, scale);

            pc.util.setEntityAlpha(ring, this.alphaCurve.value(lerp));
        }
    }
    
    this._time = (this._time + dt) % (this.animLength + this.loopGap);
    
    var entityScale = this.entity.getLocalScale();
    this._setScaleY(pc.math.lerp(entityScale.y, this._targetScaleY, Math.min(LocatorRings.SCALE_LERP_FACTOR * dt, 1)));
};


LocatorRings.prototype._onStateChanged = function (enabled) {
    if (enabled) {
        this._setScaleY(0.001);
        this._targetScaleY = 1;
    } 
};


LocatorRings.prototype._setScaleY = function (value) {
    var entityScale = this.entity.getLocalScale();
    entityScale.y = value;
    this.entity.setLocalScale(entityScale);    
};
