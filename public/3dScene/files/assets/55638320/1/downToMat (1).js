var DownTomat = pc.createScript('downTomat');

DownTomat.attributes.add("links", {type: "string", array: true, title: "Links"});

DownTomat.attributes.add("models", {type: "entity", array: true, title: "Models"});

DownTomat.attributes.add("instance", {type: 'number', array: true, title: "instance"});

// initialize code called once per entity
DownTomat.prototype.initialize = function() {
    var self=this;

    for(var i=0;i<self.models.length;i++){
        var image = new Image();
        image.crossOrigin = "anonymous";
        var material = self.models[i].model.meshInstances[self.instance[i]].material;
        
        image.onload = function () {
            var texture = new pc.Texture(self.app.graphicsDevice);
            texture.setSource(image);

            material.diffuseMap = texture;
            material.update();
            console.log("image loaded");
        };
        image.src = self.links[i];
    }
};

// update code called every frame
DownTomat.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// DownTomat.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/