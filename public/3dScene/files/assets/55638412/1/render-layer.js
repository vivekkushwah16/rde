var RenderLayer = pc.createScript('renderLayer');

RenderLayer.attributes.add('layer', {
    type: 'number', 
    default: 14, 
    title: 'Layer', 
    description: 'Has to be between a value of 3 and 14. 3 being the highest priority'
});

// initialize code called once per entity
RenderLayer.prototype.initialize = function() {      
    this.on('attr:layer', function (value, prev) {
        this._setLayer(value);
    });
    
    this._setLayer(this.layer);
};


RenderLayer.prototype._setLayer = function(layer) {
    layer = pc.math.clamp(layer, 0, 15);
    var instances = null;
    var i = 0;
    
    if (this.entity.model) {
        instances = this.entity.model.meshInstances;
        if (instances) {
            for (i = 0; i < instances.length; ++i) {
                instances[i].layer = layer;
            }
        }
    } 
    
    var particleSystem = this.entity.particlesystem;
    if (particleSystem && particleSystem.emitter.meshInstance) {
        particleSystem.emitter.meshInstance.layer = layer;
    }
    
    var element = this.entity.element;
    if (element) {
        if (element._text && element._text._meshInstance) {
            element._text._meshInstance.layer = layer;
        }
        
        if (element._image) {
            instances = element._image._model.meshInstances;
            if (instances) {
                for (i = 0; i < instances.length; ++i) {
                    instances[i].layer = layer;
                }
            }        
        }  
    }
};
