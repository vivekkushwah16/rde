// More information here: http://developer.playcanvas.com/en/api/pc.aabbShape.html
var Shape = pc.createScript('shape');

Shape.attributes.add('type', { type: 'string', enum: [{ 'Sphere': 'sphere' }, { 'AABB': 'aabb' }, { 'OBB': 'obb' }], default: 'sphere', title: 'Type'});

Shape.attributes.add('childOfActualEntity', {
    type: 'boolean', 
    default: false, 
    title: 'Child Of Actual Entity', 
    description: 'Tick if the shape is a child of the actual entity object'
});

Shape.attributes.add('keepUpdating', {
    type: 'boolean', 
    default: false, 
    title: 'Keep Updating', 
    description: 'Update the shape data every frame (only toggle if the entity moves as can be expensive)'
});

Shape.attributes.add('addToObject', { type: 'string', enum: [{'Global': 'app'}, {'Actual Entity': 'actualEntity'}], title: 'Add to Object', default: 'app'});


// initialize code called once per entity
Shape.prototype.initialize = function() {
    this._halfExtents = this.entity.getLocalScale().clone().scale(0.5);

    switch (this.type) {
        case 'sphere': 
            // Create the sphere and use the largest scale dimension for the radius
            this._shape = new pc.BoundingSphere(this.entity.getPosition().clone(), Math.max(this._halfExtents.x, Math.max(this._halfExtents.y, this._halfExtents.z)));
            break;
            
        case 'aabb':
            this._shape = new pc.BoundingBox(this.entity.getPosition().clone(), this._halfExtents);
            break;
            
        case 'obb': 
            this._worldTransform = new pc.Mat4().setTRS(this.entity.getPosition(), this.entity.getRotation(), pc.util.DEFAULT_VEC3_1);
            this._shape = new pc.OrientatedBox(this._halfExtents, this._worldTransform);
            break;
    }
    
    var self = this;
    
//     // Hide the model as it's just there to aid placement in the editor
//     if (this.entity.model) {
//         var instances = this.entity.model.meshInstances;
//         if (instances) {
//             for (var i = 0; i < instances.length; ++i) {
//                 instances[i].visible = false;
//             }
//         }
//     }
};


Shape.prototype.postInitialize = function() {
    this._getAddToObject().fire("shapeworld:add", this._getActualEntity(), this._shape);
    this.on('state', this._onStateChanged, this);
};


Shape.prototype.update = function(dt) {  
    if (this.keepUpdating) {
        switch (this.type) {
            case 'sphere': 
                this._shape.center.copy(this.entity.getPosition());
                break;

            case 'aabb':
                this._shape.center.copy(this.entity.getPosition());
                break;

            case 'obb': 
                this._worldTransform.setTRS(this.entity.getPosition(), this.entity.getRotation(), pc.util.DEFAULT_VEC3_1);
                this._shape.worldTransform = this._worldTransform;
                break;
        }
    }
};


Shape.prototype._onStateChanged = function (enabled) {
    var addToObject = this._getAddToObject();
    if (enabled) {
        addToObject.fire("shapeworld:add", this._getActualEntity(), this._shape);    
    } else {
      //  addToObject.fire("shapeworld:remove", this._getActualEntity(), this._shape);    
    }
};


Shape.prototype._getAddToObject = function () {
    switch(this.addToObject) {
        case 'app':
            return this.app;
            
        case 'actualEntity':
            return this._getActualEntity();
            
        default:
            return null;
    }
};


Shape.prototype._getActualEntity = function () {
    return this.childOfActualEntity ? this.entity.parent : this.entity;
};