pc.DEFAULT_HUMAN_HEIGHT = 1.67;

(function(){
    pc.util = {};
    
    pc.util.DEBUG = false;
    pc.util.DEFAULT_VEC3_0 = new pc.Vec3(0, 0, 0);
    pc.util.DEFAULT_VEC3_1 = new pc.Vec3(1, 1, 1);
    pc.util.DEFAULT_QUAT = new pc.Quat(0, 0, 0, 1);
    
    pc.util.HIGHLIGHT_ENTITY_GREEN = new pc.Color(0.25, 0.5, 0.25);
    pc.util.HIGHLIGHT_ENTITY_RED = new pc.Color(0.5/2, 0.25/2, 0.25/2);
    pc.util.HIGHLIGHT_ENTITY_Blue = new pc.Color(0.25/2, 0.25/2, 0.5);
    pc.util.HIGHLIGHT_ENTITY_DEFAULT = new pc.Color(0,0,0);
    
    pc.util.setEntityAlpha = function(entity, alpha) {
        if (entity.model && entity.model.enabled) {
            var a = pc.math.clamp(alpha, 0, 1);
            var meshInstances = entity.model.meshInstances;
            for(var i = 0; i < meshInstances.length; ++i) {
                // WARNING: setParameter() is still a beta feature and may change in the future      
                // This is where we set how transparent we want the object to be on a value between 0 and 1
                // 0 = fully transparent
                // 1 = fully opaque

                // Note: The materials on the model MUST have alpha set on opacity -> blend type and be slight less than 1
                meshInstances[i].setParameter("material_opacity", a);
            }  
        }
    };
    
    
    pc.util.setEntityEmissive = function(entity, color) {
        if (entity.model && entity.model.enabled) {
            var meshInstances = entity.model.meshInstances;    
            for(var i = 0; i < meshInstances.length; ++i) {
                // WARNING: setParameter() is still a beta feature and may change in the future
                meshInstances[i].setParameter("material_emissive", color.data3);
            }
        }
    };
    
    
    pc.util.isMobile = function() {
        return /Android/i.test(navigator.userAgent) ||
            /iPhone|iPad|iPod/i.test(navigator.userAgent);
    };
    
    
    pc.util.canPlayOgg = function () {
        var str = navigator.userAgent.toLowerCase();
        if (str.search('safari') >= 0 && str.search('chrome') < 0) {
            return false;
        }
        
        return true;
    };
    
    
    pc.util.unitCurve = function(x, curve) { 
        if (1 == curve ) {
            return x;
        } else {
            var out = x;
            var d = curve - curve * out + out;
            if (0 !== d)
            {
                out = out / d;
            }
            return out;
        }
    };
    
    
    pc.util.sCurve = function (x) {
        return x * x * (3 - 2 * x);
    };
    
    
    pc.util.playSoundSlot = function (entity, slotName, volume) {
        if (entity.sound) {
            var soundSlot = entity.sound.slots[slotName];
            if (soundSlot) {
                if (volume) {
                    soundSlot.volume = volume;
                }
                
                soundSlot.play();
            }
            return soundSlot;
        }
        return null;
    };
    
    
    pc.util.stopSoundSlot = function (entity, slotName) {
        if (entity.sound) {
            var soundSlot = entity.sound.slots[slotName];
            if (soundSlot) {
                soundSlot.stop();
            }
            return soundSlot;
        }
        return null;
    };
    
    
    pc.util.pauseSoundSlot = function (entity, slotName) {
        if (entity.sound) {
            var soundSlot = entity.sound.slots[slotName];
            if (soundSlot) {
                soundSlot.pause();
            }
            return soundSlot;
        }
        return null;
    };
    
    
    pc.util.isPlayingSoundSlot = function (entity, slotName) {
        if (entity.sound) {
            var soundSlot = entity.sound.slots[slotName];
            if (soundSlot) {
                return soundSlot.isPlaying;
            }
        }
        return false;
    };    
    
    
    pc.util.initSoundSlotAssets = function (app, entity) {
        // Check if we can play OGG or MP3 and load the right assets for the platform
        var fileExt = pc.util.canPlayOgg() ? '.ogg' : '.mp3';
        var soundSlots = entity.sound ? entity.sound.slots : null;
        var count = 0;
        
        if (soundSlots) {
            for (var key in soundSlots) {
                if (soundSlots.hasOwnProperty(key)) {
                    var asset = app.assets.find(key + fileExt, 'audio');
                    if (asset) {
                        soundSlots[key].asset = asset.id;
                        count += 1;
                    }
                }
            }
        }
        
        return count;
    };    
    
    
    var _transformedForward = new pc.Vec3();
    pc.util.getYaw = function (quat) {
        var transformedForward = _transformedForward;
        quat.transformVector(pc.Vec3.FORWARD, transformedForward);

        return Math.atan2(-transformedForward.x, -transformedForward.z) * pc.math.RAD_TO_DEG;    
    };
    
    
    var _inverseQuat = new pc.Quat();
    var _resultQuat = new pc.Quat();
    pc.util.angleBetweenQuats = function (quat1, quat2) {
        var inverseQuat = _inverseQuat.copy(quat1).invert();
        var resultQuat = _resultQuat.mul2(quat2, inverseQuat);
        var result = Math.acos(pc.math.clamp(resultQuat.w, -1, 1)) * 2 * pc.math.RAD_TO_DEG;
                
        if (result > 180) {
            result = 360 - result;
        }
        
        return result;
    };
    
    
    pc.util.clampQuatToYAxis = function(quat) {
        quat.x = 0; quat.z = 0;
        var mag = Math.sqrt(quat.w * quat.w + quat.y * quat.y);
        quat.w /= mag;
        quat.y /= mag;    
    };
})();

pc.extend(pc, function () {
    var OrientatedBox = function OrientatedBox(halfExtents, worldTransform) {
        this.halfExtents = halfExtents || new pc.Vec3(0.5, 0.5, 0.5);
        
        this._worldTransform = worldTransform || new pc.Mat4();
        this._modelTransform = this._worldTransform.clone().invert();
        this._aabb = new pc.BoundingBox(new pc.Vec3(), this.halfExtents);
    };
    
    var transformedRay = new pc.Ray();
    var transformedPoint = new pc.Vec3();
    var transformedBoundingSphere = new pc.BoundingSphere();

    OrientatedBox.prototype = {
        intersectsRay: function (ray, point) {            
            this._modelTransform.transformPoint(ray.origin, transformedRay.origin);
            this._modelTransform.transformVector(ray.direction, transformedRay.direction);
            
            if (point) {
                var result = this._aabb._intersectsRay(transformedRay, point);
                this._worldTransform.transformPoint(point, point);
                return result;
            } else {
                return modelBox._fastIntersectsRay(this._transformedRay);
            }
        },
        
        containsPoint: function (point) {
            this._modelTransform.transformPoint(point, transformedPoint);
            return this._aabb.containsPoint(transformedPoint);
        },        

        intersectsBoundingSphere: function (sphere) {
            this._modelTransform.transformPoint(sphere.center, transformedBoundingSphere.center);
            transformedBoundingSphere.radius = sphere.radius;

            if (this._aabb.intersectsBoundingSphere(transformedBoundingSphere)) { 
                return true;
            }

            return false;
        }
    };
    
    Object.defineProperty(OrientatedBox.prototype, 'worldTransform', {
        get: function () {
            return this._worldTransform;
        },
        set: function (value) {
            this._worldTransform = value;
            this._modelTransform.copy(this._worldTransform).invert();
        }
    });
    
    return {
        OrientatedBox: OrientatedBox
    };
}());


pc.BoundingSphere.diffBetweenPoints = new pc.Vec3();

pc.BoundingSphere.prototype.intersectsBoundingSphere = function (sphere) {
    var diff = pc.BoundingSphere.diffBetweenPoints;
    diff.sub2(sphere.center, this.center);
    var totalRadius = sphere.radius + this.radius;
    if (diff.lengthSq() <= totalRadius * totalRadius) {
        return true;
    }
    
    return false;
};

pc.BoundingBox.prototype._distanceToBoundingSphereSq = function (sphere) {
    var boxMin = this.getMin();
    var boxMax = this.getMax();
    
    var sq = 0;
    
    for (var i = 0; i < 3; ++i) {
        var out = 0;
        var pn = sphere.center.data[i];
        var bMin = boxMin.data[i];
        var bMax = boxMax.data[i];
        var val = 0;
        
        if (pn < bMin) {
            val = (bMin - pn);
            out += val * val;
        }
        
        if (pn > bMax) { 
            val = (pn - bMax);
            out += val * val;
        }
        
        sq += out;
    }
    
    return sq;
};

pc.BoundingBox.prototype.intersectsBoundingSphere = function (sphere) {
    var sq = this._distanceToBoundingSphereSq(sphere);
    if (sq <= sphere.radius * sphere.radius) {
        return true;
    }
    
    return false;    
};
